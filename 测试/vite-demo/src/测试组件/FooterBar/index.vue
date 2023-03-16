<template>
  <div class="footer">
    <div class="footer-content">{{ content }}</div>
  </div>
</template>
  
<script lang="ts">
export default {
  name: "FooterBar",
  props: {
    content: {
      type: String,
      default: "footer",
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