<template>
  <div id="app">
    <sku-wrap />
  </div>
</template>

<script>
import SkuWrap from './components/sku.vue'

export default {
  name: 'app',
  components: {
    SkuWrap
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
