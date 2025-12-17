<template>
  <div class="slideshow-container">
    <!-- Loading State -->
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>Loading images from S3...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error">
      <h2>⚠️ Error Loading Images</h2>
      <p>{{ error }}</p>
      <button @click="retryFetch" class="retry-button">Retry</button>
    </div>

    <!-- Empty State -->
    <div v-else-if="images.length === 0" class="empty">
      <h2>No Images Found</h2>
      <p>The S3 bucket does not contain any images.</p>
    </div>

    <!-- Slideshow -->
    <div v-else class="slideshow">
      <!-- Image Display -->
      <div class="image-wrapper">
        <img 
          :src="currentImage.url" 
          :alt="currentImage.caption"
          class="slideshow-image"
          @error="handleImageError"
        />
      </div>

      <!-- Caption -->
      <div class="caption-wrapper">
        <p class="caption">{{ currentImage.caption }}</p>
        <p class="image-info">
          Image {{ currentIndex + 1 }} of {{ images.length }}
        </p>
      </div>

      <!-- Navigation Controls -->
      <div class="controls">
        <button @click="previousImage" class="nav-button" :disabled="images.length <= 1">
          ← Previous
        </button>
        <button @click="toggleAutoPlay" class="nav-button">
          {{ isAutoPlaying ? '⏸ Pause' : '▶ Play' }}
        </button>
        <button @click="nextImage" class="nav-button" :disabled="images.length <= 1">
          Next →
        </button>
      </div>

      <!-- Thumbnail Navigation -->
      <div class="thumbnails" v-if="images.length > 1">
        <div 
          v-for="(image, index) in images" 
          :key="image.key"
          @click="goToImage(index)"
          :class="['thumbnail', { active: index === currentIndex }]"
          :style="{ backgroundImage: `url(${image.url})` }"
          :title="image.caption"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { fetchImagesFromS3 } from '../services/s3Service';

const images = ref([]);
const currentIndex = ref(0);
const loading = ref(true);
const error = ref(null);
const isAutoPlaying = ref(false);
const autoPlayInterval = ref(null);

const currentImage = computed(() => images.value[currentIndex.value] || {});

const AUTO_PLAY_DELAY = 3000; // 3 seconds

// Fetch images on component mount
onMounted(async () => {
  await loadImages();
});

// Cleanup on component unmount
onUnmounted(() => {
  stopAutoPlay();
});

async function loadImages() {
  try {
    loading.value = true;
    error.value = null;
    images.value = await fetchImagesFromS3();
    loading.value = false;
  } catch (err) {
    error.value = err.message || 'Failed to load images';
    loading.value = false;
  }
}

function retryFetch() {
  loadImages();
}

function nextImage() {
  if (images.value.length > 0) {
    currentIndex.value = (currentIndex.value + 1) % images.value.length;
  }
}

function previousImage() {
  if (images.value.length > 0) {
    currentIndex.value = (currentIndex.value - 1 + images.value.length) % images.value.length;
  }
}

function goToImage(index) {
  currentIndex.value = index;
}

function toggleAutoPlay() {
  if (isAutoPlaying.value) {
    stopAutoPlay();
  } else {
    startAutoPlay();
  }
}

function startAutoPlay() {
  isAutoPlaying.value = true;
  autoPlayInterval.value = setInterval(() => {
    nextImage();
  }, AUTO_PLAY_DELAY);
}

function stopAutoPlay() {
  isAutoPlaying.value = false;
  if (autoPlayInterval.value) {
    clearInterval(autoPlayInterval.value);
    autoPlayInterval.value = null;
  }
}

function handleImageError(event) {
  console.error('Failed to load image:', currentImage.value.url);
  event.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23ddd" width="400" height="300"/%3E%3Ctext fill="%23999" font-family="sans-serif" font-size="16" dy="10.5" font-weight="bold" x="50%25" y="50%25" text-anchor="middle"%3EImage Not Available%3C/text%3E%3C/svg%3E';
}
</script>

<style scoped>
.slideshow-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.loading, .error, .empty {
  text-align: center;
  padding: 60px 20px;
}

.spinner {
  border: 4px solid rgba(255, 255, 255, 0.1);
  border-left-color: #646cff;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error {
  color: #ff6b6b;
}

.retry-button {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #646cff;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
}

.retry-button:hover {
  background-color: #535bf2;
}

.slideshow {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.image-wrapper {
  width: 100%;
  height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #1a1a1a;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.slideshow-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  transition: opacity 0.3s ease-in-out;
}

.caption-wrapper {
  text-align: center;
  padding: 10px;
}

.caption {
  font-size: 18px;
  font-weight: 500;
  margin: 0 0 5px 0;
  color: rgba(255, 255, 255, 0.87);
}

.image-info {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
}

.controls {
  display: flex;
  justify-content: center;
  gap: 15px;
  flex-wrap: wrap;
}

.nav-button {
  padding: 10px 20px;
  background-color: #1a1a1a;
  color: white;
  border: 1px solid #646cff;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.3s ease;
}

.nav-button:hover:not(:disabled) {
  background-color: #646cff;
  transform: translateY(-2px);
}

.nav-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.thumbnails {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding: 10px 0;
  justify-content: center;
  flex-wrap: wrap;
}

.thumbnail {
  width: 80px;
  height: 60px;
  background-size: cover;
  background-position: center;
  border-radius: 6px;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.thumbnail:hover {
  border-color: #646cff;
  transform: scale(1.05);
}

.thumbnail.active {
  border-color: #646cff;
  box-shadow: 0 0 10px rgba(100, 108, 255, 0.5);
}

/* Responsive Design */
@media (max-width: 768px) {
  .image-wrapper {
    height: 300px;
  }

  .caption {
    font-size: 16px;
  }

  .nav-button {
    padding: 8px 16px;
    font-size: 14px;
  }

  .thumbnail {
    width: 60px;
    height: 45px;
  }
}

@media (prefers-color-scheme: light) {
  .caption {
    color: #213547;
  }

  .image-info {
    color: #666;
  }

  .image-wrapper {
    background-color: #f5f5f5;
  }

  .nav-button {
    background-color: #f9f9f9;
    color: #213547;
  }

  .nav-button:hover:not(:disabled) {
    background-color: #646cff;
    color: white;
  }
}
</style>
