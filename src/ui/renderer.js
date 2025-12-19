import { escapeHtml } from '../utils/helpers.js';
import { state } from './state.js';

/**
 * Render the UI based on current state
 */
export function render() {
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
                <button onclick="window.retryFetch()" class="retry-button">Retry</button>
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
                    onclick="window.goToImage(${index})"
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
                    onerror="window.handleImageError(this)"
                />
            </div>

            <div class="caption-wrapper">
                <p class="caption">${escapeHtml(currentImage.caption)}</p>
                <p class="image-info">
                    Image ${state.currentIndex + 1} of ${state.images.length}
                </p>
            </div>

            <div class="controls">
                <button onclick="window.previousImage()" class="nav-button" ${state.images.length <= 1 ? 'disabled' : ''}>
                    ← Previous
                </button>
                <button onclick="window.toggleAutoPlay()" class="nav-button">
                    ${state.isAutoPlaying ? '⏸ Pause' : '▶ Play'}
                </button>
                <button onclick="window.nextImage()" class="nav-button" ${state.images.length <= 1 ? 'disabled' : ''}>
                    Next →
                </button>
            </div>

            ${thumbnailsHTML}
        </div>
    `;
}

/**
 * Handle image loading errors
 * @param {HTMLImageElement} imgElement - Image element that failed to load
 */
export function handleImageError(imgElement) {
    console.error('Failed to load image:', imgElement.src);
    imgElement.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23ddd" width="400" height="300"/%3E%3Ctext fill="%23999" font-family="sans-serif" font-size="16" dy="10.5" font-weight="bold" x="50%25" y="50%25" text-anchor="middle"%3EImage Not Available%3C/text%3E%3C/svg%3E';
}
