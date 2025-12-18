// S3 Image Gallery Application
// Configuration
const BUCKET_NAME = 'tabs.14strings.com';
const BUCKET_URL = `https://${BUCKET_NAME}`;
const S3_FOLDER = 'roster'; // S3 folder to read images from
const USE_DEMO_MODE = false;
const AUTO_PLAY_DELAY = 3000; // milliseconds

// Demo images for testing
const DEMO_IMAGES = [
    {
        key: 'roster/player-1.jpg',
        url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200',
        caption: 'Player 1',
        size: 245678,
        lastModified: new Date('2024-01-15'),
    },
    {
        key: 'roster/player-2.jpg',
        url: 'https://images.unsplash.com/photo-1511884642898-4c92249e20b6?w=1200',
        caption: 'Player 2',
        size: 312456,
        lastModified: new Date('2024-01-16'),
    },
    {
        key: 'roster/player-3.jpg',
        url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200',
        caption: 'Player 3',
        size: 287931,
        lastModified: new Date('2024-01-17'),
    },
];

// Application State
let state = {
    images: [],
    currentIndex: 0,
    loading: true,
    error: null,
    isAutoPlaying: false,
    autoPlayInterval: null,
};

// S3 Service Functions
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

async function fetchImagesFromS3() {
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

// UI Functions
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function render() {
    const container = document.getElementById('slideshow-container');
    
    if (state.loading) {
        container.innerHTML = `
            <div class="loading">
                <div class="spinner"></div>
                <p>Loading images from S3...</p>
            </div>
        `;
        return;
    }

    if (state.error) {
        container.innerHTML = `
            <div class="error">
                <h2>⚠️ Error Loading Images</h2>
                <p>${escapeHtml(state.error)}</p>
                <button onclick="retryFetch()" class="retry-button">Retry</button>
            </div>
        `;
        return;
    }

    if (state.images.length === 0) {
        container.innerHTML = `
            <div class="empty">
                <h2>No Images Found</h2>
                <p>The S3 bucket does not contain any images.</p>
            </div>
        `;
        return;
    }

    const currentImage = state.images[state.currentIndex];
    const thumbnailsHTML = state.images.length > 1 ? `
        <div class="thumbnails">
            ${state.images.map((img, index) => `
                <div 
                    class="thumbnail ${index === state.currentIndex ? 'active' : ''}"
                    style="background-image: url('${escapeHtml(img.url)}')"
                    title="${escapeHtml(img.caption)}"
                    onclick="goToImage(${index})"
                ></div>
            `).join('')}
        </div>
    ` : '';

    container.innerHTML = `
        <div class="slideshow">
            <div class="image-wrapper">
                <img 
                    src="${escapeHtml(currentImage.url)}" 
                    alt="${escapeHtml(currentImage.caption)}"
                    class="slideshow-image"
                    onerror="handleImageError(this)"
                />
            </div>

            <div class="caption-wrapper">
                <p class="caption">${escapeHtml(currentImage.caption)}</p>
                <p class="image-info">
                    Image ${state.currentIndex + 1} of ${state.images.length}
                </p>
            </div>

            <div class="controls">
                <button onclick="previousImage()" class="nav-button" ${state.images.length <= 1 ? 'disabled' : ''}>
                    ← Previous
                </button>
                <button onclick="toggleAutoPlay()" class="nav-button">
                    ${state.isAutoPlaying ? '⏸ Pause' : '▶ Play'}
                </button>
                <button onclick="nextImage()" class="nav-button" ${state.images.length <= 1 ? 'disabled' : ''}>
                    Next →
                </button>
            </div>

            ${thumbnailsHTML}
        </div>
    `;
}

// Action Functions
async function loadImages() {
    try {
        state.loading = true;
        state.error = null;
        render();
        
        state.images = await fetchImagesFromS3();
        state.loading = false;
        render();
    } catch (err) {
        state.error = err.message || 'Failed to load images';
        state.loading = false;
        render();
    }
}

function retryFetch() {
    loadImages();
}

function nextImage() {
    if (state.images.length > 0) {
        state.currentIndex = (state.currentIndex + 1) % state.images.length;
        render();
    }
}

function previousImage() {
    if (state.images.length > 0) {
        state.currentIndex = (state.currentIndex - 1 + state.images.length) % state.images.length;
        render();
    }
}

function goToImage(index) {
    state.currentIndex = index;
    render();
}

function toggleAutoPlay() {
    if (state.isAutoPlaying) {
        stopAutoPlay();
    } else {
        startAutoPlay();
    }
}

function startAutoPlay() {
    state.isAutoPlaying = true;
    state.autoPlayInterval = setInterval(() => {
        nextImage();
    }, AUTO_PLAY_DELAY);
    render();
}

function stopAutoPlay() {
    state.isAutoPlaying = false;
    if (state.autoPlayInterval) {
        clearInterval(state.autoPlayInterval);
        state.autoPlayInterval = null;
    }
    render();
}

function handleImageError(imgElement) {
    console.error('Failed to load image:', imgElement.src);
    imgElement.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23ddd" width="400" height="300"/%3E%3Ctext fill="%23999" font-family="sans-serif" font-size="16" dy="10.5" font-weight="bold" x="50%25" y="50%25" text-anchor="middle"%3EImage Not Available%3C/text%3E%3C/svg%3E';
}

// Initialize application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    loadImages();
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    stopAutoPlay();
});
