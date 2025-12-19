import { BUCKET_URL, S3_FOLDER, USE_DEMO_MODE, DEMO_IMAGES } from '../config.js';
import { parseS3ListResponse } from '../utils/helpers.js';

/**
 * Fetch object metadata from S3 using HTTP HEAD request
 * @param {string} url - Object URL
 * @returns {Promise<Object>} Metadata object
 */
async function fetchObjectMetadata(url) {
    try {
        const response = await fetch(url, { method: 'HEAD' });
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const headers = response.headers;
        const metadata = {};

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
 * Fetch images from S3 bucket using public HTTP access
 * @returns {Promise<Array>} Array of image objects
 */
export async function fetchImagesFromS3() {
    if (USE_DEMO_MODE) {
        return new Promise(resolve => {
            setTimeout(() => resolve(DEMO_IMAGES), 500);
        });
    }

    try {
        // Use ListObjectsV2 API with prefix parameter to filter by folder
        const listUrl = `${BUCKET_URL}?list-type=2&prefix=${S3_FOLDER}/`;
        const response = await fetch(listUrl);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const xmlText = await response.text();
        const objects = parseS3ListResponse(xmlText);

        if (objects.length === 0) {
            return [];
        }

        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'];
        const imageObjects = objects.filter(obj => {
            const key = obj.Key.toLowerCase();
            // Only filter by image extension since prefix already filtered by folder
            return imageExtensions.some(ext => key.endsWith(ext));
        });

        const imagesWithMetadata = await Promise.all(
            imageObjects.map(async (obj) => {
                const url = `${BUCKET_URL}/${obj.Key}`;
                const metadata = await fetchObjectMetadata(url);

                return {
                    key: obj.Key,
                    url: url,
                    caption: metadata.caption || obj.Key.split('/').pop(),
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
