<template>
  <div class="hello-world">
    <div class="hello-world-content" v-if="visible">{{ content }}</div>
    <input type="text" :value="content" @input="onInput" />
  </div>
</template>

<script lang="ts">
export default {
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