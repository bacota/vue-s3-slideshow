import { fetchImagesFromS3 } from './services/s3Service.js';
import { state, nextImage, previousImage, goToImage, toggleAutoPlay, stopAutoPlay } from './ui/state.js';
import { render, handleImageError } from './ui/renderer.js';
import { AUTO_PLAY_DELAY } from './config.js';

/**
 * Load images from S3
 */
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

/**
 * Retry fetching images
 */
function retryFetch() {
    loadImages();
}

// Expose functions to global scope for inline event handlers
window.nextImage = () => {
    nextImage();
    render();
};

window.previousImage = () => {
    previousImage();
    render();
};

window.goToImage = (index) => {
    goToImage(index);
    render();
};

window.toggleAutoPlay = () => {
    toggleAutoPlay();
    // Set up interval to re-render during auto-play
    if (state.isAutoPlaying) {
        const originalInterval = state.autoPlayInterval;
        clearInterval(originalInterval);
        state.autoPlayInterval = setInterval(() => {
            nextImage();
            render();
        }, AUTO_PLAY_DELAY);
    }
    render();
};

window.retryFetch = retryFetch;
window.handleImageError = handleImageError;

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
    loadImages();
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    stopAutoPlay();
});
