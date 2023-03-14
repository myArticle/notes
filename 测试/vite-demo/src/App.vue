<script setup lang="ts">
import { ref } from "vue";
import HelloWorld from "./测试组件/HelloWorld/index.vue";
const content = ref("");
const visible = ref(false);
</script>

<template>
  <div>
    <HelloWorld :visible="visible" v-model:content="content" />
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
