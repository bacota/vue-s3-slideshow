import { AUTO_PLAY_DELAY } from '../config.js';

/**
 * Application state management
 */
export const state = {
    images: [],
    currentIndex: 0,
    loading: true,
    error: null,
    isAutoPlaying: false,
    autoPlayInterval: null,
};

/**
 * Navigate to next image
 */
export function nextImage() {
    if (state.images.length > 0) {
        state.currentIndex = (state.currentIndex + 1) % state.images.length;
    }
}

/**
 * Navigate to previous image
 */
export function previousImage() {
    if (state.images.length > 0) {
        state.currentIndex = (state.currentIndex - 1 + state.images.length) % state.images.length;
    }
}

/**
 * Go to specific image index
 * @param {number} index - Image index
 */
export function goToImage(index) {
    state.currentIndex = index;
}

/**
 * Start auto-play
 */
export function startAutoPlay() {
    state.isAutoPlaying = true;
    state.autoPlayInterval = setInterval(() => {
        nextImage();
    }, AUTO_PLAY_DELAY);
}

/**
 * Stop auto-play
 */
export function stopAutoPlay() {
    state.isAutoPlaying = false;
    if (state.autoPlayInterval) {
        clearInterval(state.autoPlayInterval);
        state.autoPlayInterval = null;
    }
}

/**
 * Toggle auto-play on/off
 */
export function toggleAutoPlay() {
    if (state.isAutoPlaying) {
        stopAutoPlay();
    } else {
        startAutoPlay();
    }
}
