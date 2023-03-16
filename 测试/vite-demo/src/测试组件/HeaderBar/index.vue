<template>
  <div class="header">
    <div class="header-logo">{{ logo }}</div>
    <div class="header-title">{{ title }}</div>
    <footer-bar />
  </div>
</template>
  
<script lang="ts">
import FooterBar from "../FooterBar/index.vue";
export default {
  name: "HeaderBar",
  components: {
    FooterBar,
  },
  props: {
    logo: {
      type: String,
      default: "logo",
    },
    title: {
      type: String,
      default: "title",
    },
  },
  setup(_props, { emit }) {
    return {};
  },
};
</script>
  
  <style scoped>
.hello-world-content {
  background-color: #333;
  color: #fff;
}
</style>