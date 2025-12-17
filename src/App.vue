<script setup>
import Slideshow from './components/Slideshow.vue'
</script>

<template>
  <div class="app-container">
    <header class="app-header">
      <h1>S3 Image Gallery</h1>
      <p class="subtitle">Images from tabs.14strings.com</p>
    </header>
    <main>
      <Slideshow />
    </main>
    <footer class="app-footer">
      <p>Powered by Vue.js and AWS S3</p>
    </footer>
  </div>
</template>

<style scoped>
.app-container {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  text-align: center;
  padding: 30px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.app-header h1 {
  margin: 0 0 10px 0;
  font-size: 2.5em;
  font-weight: 700;
}

.subtitle {
  margin: 0;
  font-size: 1.1em;
  opacity: 0.9;
}

main {
  flex: 1;
  padding: 20px;
}

.app-footer {
  text-align: center;
  padding: 20px;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.9em;
}

@media (max-width: 768px) {
  .app-header h1 {
    font-size: 2em;
  }
  
  .subtitle {
    font-size: 1em;
  }
}

@media (prefers-color-scheme: light) {
  .app-footer {
    color: #666;
  }
}
</style>
