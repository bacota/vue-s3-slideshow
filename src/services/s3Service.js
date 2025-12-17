const BUCKET_NAME = 'tabs.14strings.com';
const BUCKET_URL = `https://${BUCKET_NAME}`;

// Demo mode - set to true to use sample images when S3 is not accessible
const USE_DEMO_MODE = true;

// Sample images for demo mode
const DEMO_IMAGES = [
  {
    key: 'demo/sample-1.jpg',
    url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200',
    caption: 'Beautiful Mountain Landscape',
    size: 245678,
    lastModified: new Date('2024-01-15'),
  },
  {
    key: 'demo/sample-2.jpg',
    url: 'https://images.unsplash.com/photo-1511884642898-4c92249e20b6?w=1200',
    caption: 'Serene Ocean View',
    size: 312456,
    lastModified: new Date('2024-01-16'),
  },
  {
    key: 'demo/sample-3.jpg',
    url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200',
    caption: 'Forest Trail',
    size: 287931,
    lastModified: new Date('2024-01-17'),
  },
  {
    key: 'demo/sample-4.jpg',
    url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200',
    caption: 'Desert Sunset',
    size: 298765,
    lastModified: new Date('2024-01-18'),
  },
  {
    key: 'demo/sample-5.jpg',
    url: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=1200',
    caption: 'Tropical Paradise',
    size: 325890,
    lastModified: new Date('2024-01-19'),
  },
];

/**
 * Parse XML response from S3 ListBucket
 * @param {string} xmlText - XML response text
 * @returns {Array} Array of objects from the bucket
 */
function parseS3ListResponse(xmlText) {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
  
  const contents = xmlDoc.getElementsByTagName('Contents');
  const objects = [];
  
  for (let i = 0; i < contents.length; i++) {
    const keyElement = contents[i].getElementsByTagName('Key')[0];
    const sizeElement = contents[i].getElementsByTagName('Size')[0];
    const lastModifiedElement = contents[i].getElementsByTagName('LastModified')[0];
    
    if (keyElement && keyElement.textContent) {
      objects.push({
        Key: keyElement.textContent,
        Size: sizeElement ? parseInt(sizeElement.textContent) : 0,
        LastModified: lastModifiedElement ? new Date(lastModifiedElement.textContent) : null,
      });
    }
  }
  
  return objects;
}

/**
 * Fetch metadata for an object using HEAD request
 * @param {string} url - Object URL
 * @returns {Promise<Object>} Object metadata
 */
async function fetchObjectMetadata(url) {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const headers = response.headers;
    const metadata = {};
    
    // Extract custom metadata (x-amz-meta-* headers)
    for (let [key, value] of headers.entries()) {
      if (key.startsWith('x-amz-meta-')) {
        const metaKey = key.replace('x-amz-meta-', '');
        metadata[metaKey] = value;
      }
    }
    
    return metadata;
  } catch (error) {
    console.warn(`Failed to fetch metadata for ${url}:`, error.message);
    return {};
  }
}

/**
 * Fetch list of images from the S3 bucket
 * @returns {Promise<Array>} Array of image objects with URL and caption
 */
export async function fetchImagesFromS3() {
  // Return demo images if demo mode is enabled
  if (USE_DEMO_MODE) {
    return new Promise(resolve => {
      setTimeout(() => resolve(DEMO_IMAGES), 500);
    });
  }

  try {
    // Fetch bucket listing
    const response = await fetch(BUCKET_URL);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const xmlText = await response.text();
    const objects = parseS3ListResponse(xmlText);
    
    if (objects.length === 0) {
      return [];
    }

    // Filter for image files only
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'];
    const imageObjects = objects.filter(obj => {
      const key = obj.Key.toLowerCase();
      return imageExtensions.some(ext => key.endsWith(ext));
    });

    // Fetch metadata for each image
    const imagesWithMetadata = await Promise.all(
      imageObjects.map(async (obj) => {
        const url = `${BUCKET_URL}/${obj.Key}`;
        const metadata = await fetchObjectMetadata(url);
        
        return {
          key: obj.Key,
          url: url,
          caption: metadata.caption || obj.Key.split('/').pop(), // Use filename as fallback
          size: obj.Size,
          lastModified: obj.LastModified,
        };
      })
    );

    return imagesWithMetadata;
  } catch (error) {
    console.error('Error fetching images from S3:', error);
    throw new Error(`Failed to fetch images: ${error.message}`);
  }
}
