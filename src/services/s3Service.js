import { S3Client, ListObjectsV2Command, HeadObjectCommand } from '@aws-sdk/client-s3';

const BUCKET_NAME = 'tabs.14strings.com';
const REGION = 'us-east-1'; // Default region, can be adjusted

// Create S3 client with anonymous credentials for public bucket access
const s3Client = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId: 'anonymous',
    secretAccessKey: 'anonymous',
  },
});

/**
 * Fetch list of images from the S3 bucket
 * @returns {Promise<Array>} Array of image objects with URL and caption
 */
export async function fetchImagesFromS3() {
  try {
    const command = new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
    });

    const response = await s3Client.send(command);
    
    if (!response.Contents || response.Contents.length === 0) {
      return [];
    }

    // Filter for image files only
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'];
    const imageObjects = response.Contents.filter(obj => {
      const key = obj.Key.toLowerCase();
      return imageExtensions.some(ext => key.endsWith(ext));
    });

    // Fetch metadata for each image
    const imagesWithMetadata = await Promise.all(
      imageObjects.map(async (obj) => {
        try {
          const headCommand = new HeadObjectCommand({
            Bucket: BUCKET_NAME,
            Key: obj.Key,
          });
          
          const headResponse = await s3Client.send(headCommand);
          
          return {
            key: obj.Key,
            url: `https://${BUCKET_NAME}/${obj.Key}`,
            caption: headResponse.Metadata?.caption || obj.Key, // Use filename as fallback
            size: obj.Size,
            lastModified: obj.LastModified,
          };
        } catch (error) {
          // If metadata fetch fails, return image with basic info
          console.warn(`Failed to fetch metadata for ${obj.Key}:`, error.message);
          return {
            key: obj.Key,
            url: `https://${BUCKET_NAME}/${obj.Key}`,
            caption: obj.Key,
            size: obj.Size,
            lastModified: obj.LastModified,
          };
        }
      })
    );

    return imagesWithMetadata;
  } catch (error) {
    console.error('Error fetching images from S3:', error);
    throw new Error(`Failed to fetch images: ${error.message}`);
  }
}
