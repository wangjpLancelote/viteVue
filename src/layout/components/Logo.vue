<template>
  <div class="logo">
    <img src="~@/assets/images/logo.png" alt="" :class="{ 'mr-2': !collapsed }">
    <h2 v-show="!collapsed" class="title">Vite Vue</h2>
  </div>
</template>
<script lang="ts" setup>
export default {
  name: 'Logo',
  components: {},
  props: {
    collapsed: {
      type: Boolean,
      default: false,
    }
  }
}
</script>
<style lang="less" scoped>
  .logo {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 64px;
    line-height: 64px;
    overflow: hidden;
    white-space: nowrap;

    img {
      width: auto;
      height: 32px;
    }
    .title {
      margin-bottom: 0;
    }
  }
</style>