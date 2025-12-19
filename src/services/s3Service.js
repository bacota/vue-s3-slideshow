import { S3Client, ListObjectsV2Command, HeadObjectCommand } from '@aws-sdk/client-s3';
import { BUCKET_NAME, BUCKET_URL, S3_FOLDER, USE_DEMO_MODE, DEMO_IMAGES } from '../config.js';

// Initialize S3 client with anonymous credentials for public bucket access
const s3Client = new S3Client({
    region: 'us-east-1', // Default region, will work for public buckets
    credentials: {
        accessKeyId: 'anonymous',
        secretAccessKey: 'anonymous',
    },
});

/**
 * Fetch object metadata from S3 using AWS SDK
 * @param {string} key - Object key
 * @returns {Promise<Object>} Metadata object
 */
async function fetchObjectMetadata(key) {
    try {
        const command = new HeadObjectCommand({
            Bucket: BUCKET_NAME,
            Key: key,
        });
        
        const response = await s3Client.send(command);
        return response.Metadata || {};
    } catch (error) {
        console.warn(`Failed to fetch metadata for ${key}:`, error.message);
        // Fallback to HTTP HEAD request for public buckets
        try {
            const url = `${BUCKET_URL}/${key}`;
            const httpResponse = await fetch(url, { method: 'HEAD' });
            if (!httpResponse.ok) {
                return {};
            }

            const headers = httpResponse.headers;
            const metadata = {};

            for (let [headerKey, value] of headers.entries()) {
                if (headerKey.startsWith('x-amz-meta-')) {
                    const metaKey = headerKey.replace('x-amz-meta-', '');
                    metadata[metaKey] = value;
                }
            }

            return metadata;
        } catch (fallbackError) {
            console.warn(`Fallback fetch also failed for ${key}:`, fallbackError.message);
            return {};
        }
    }
}

/**
 * Fetch images from S3 bucket using AWS SDK
 * @returns {Promise<Array>} Array of image objects
 */
export async function fetchImagesFromS3() {
    if (USE_DEMO_MODE) {
        return new Promise(resolve => {
            setTimeout(() => resolve(DEMO_IMAGES), 500);
        });
    }

    try {
        // Use AWS SDK ListObjectsV2Command with prefix parameter
        const command = new ListObjectsV2Command({
            Bucket: BUCKET_NAME,
            Prefix: `${S3_FOLDER}/`,
        });

        const response = await s3Client.send(command);
        const objects = response.Contents || [];

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
                const metadata = await fetchObjectMetadata(obj.Key);

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
