<template>
  <RouterView>
    <template #default="{ Component, route }">
      <transition :name="getTransitionName">
        <keep-alive v-if="keepAliveComponents" :include="keepAliveComponents">
          <component :is="Component" :key="route.fullPath" />
        </keep-alive>
      </transition>
    </template>
  </RouterView>
</template>

<script setup lang="ts">
import { computed, defineComponent, unref, defineProps, defineEmits, defineExpose } from 'vue';
  import { useAsyncRouteStore } from '@/store/modules/asyncRoute';
  import { useProjectSetting } from '@/hooks/setting/useProjectSetting';
  defineProps({
    notNeedKey: {
      type: Boolean,
      default: false,
    },
    animate: {
      type: Boolean,
      default: true,
    },
  })
  const { getIsPageAnimate, getPageAnimateType } = useProjectSetting();
  const asyncRouteStore = useAsyncRouteStore();
  const keepAliveComponents = computed(() => asyncRouteStore.keepAliveComponents);
  const getTransitionName = computed(() => {
    return unref(getIsPageAnimate) ? unref(getIsPageAnimate) : '';
  })
</script>

<style lang="less" scoped>

</style>