<template>
  <h1>{{ aboutMessage }}</h1>
</template>

<script>
import { defineComponent, ref } from "vue";
export default defineComponent({
  name: "about",
  setup() {
    const aboutMessage = ref("abourMesage");
    return {
      aboutMessage,
    };
  },
});
</script>

<style></style>
