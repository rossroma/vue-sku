<template>
  <div>
    <template v-for="(item, index) in constantRoutes">
      <el-link type="danger" v-if="item.path !== '/'" :href="item.path" :key="index">{{ item.name }}</el-link>
      <el-divider v-if="item.path !== '/'" :key="index"></el-divider>
    </template>
  </div>
</template>

<script>
  import { constantRoutes } from '@/router'
  export default {
    name: 'sku-index',
    data() {
      return {
        constantRoutes
      }
    }
  }
</script>
