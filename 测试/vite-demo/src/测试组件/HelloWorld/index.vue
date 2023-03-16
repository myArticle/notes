<template>
  <div class="hello-world">
    <header-bar></header-bar>
    <div class="hello-world-content" v-if="visible">{{ content }}</div>
    <input type="text" :value="content" @input="onInput" />
    <footer-bar></footer-bar>
  </div>
</template>

<script lang="ts">
import HeaderBar from "../HeaderBar/index.vue";
import FooterBar from "../FooterBar/index.vue";
export default {
  name: "HelloWorld",
  components: {
    HeaderBar,
    FooterBar,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    content: {
      type: String,
      default: "hello world",
    },
  },
  emits: ["update:content"],
  setup(_props, { emit }) {
    const onInput = (e) => {
      const { value } = e.target;
      console.log(value);
      emit("update:content", value);
    };
    return {
      onInput,
    };
  },
};
</script>

<style scoped>
.hello-world-content {
  background-color: #333;
  color: #fff;
}
</style>