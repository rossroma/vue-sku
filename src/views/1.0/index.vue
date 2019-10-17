<template>
  <sku-wrap></sku-wrap>
</template>

<script>
  export default {
    name: 'sku1.1',
    components: {
      SkuWrap: resolve => {
        return require(['@/components/sku.v1.0.vue'], resolve)
      }
    }
  }
</script>

<style lang="scss" scoped=""></style>
