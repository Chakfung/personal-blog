<template>
  <div>
    <editor-panel ref="child"></editor-panel>
    <div ref="aaa"></div>
    <button @click="init()">导入</button>
  </div>
</template>

<script>
import EditorPanel from "./EditorPanel";
export default {
  components: {
    EditorPanel,
  },
  methods: {
    init() {
      console.log(this.$refs.child);
      this.$refs.child.initCanvas();
    },
  },
};
</script>

<style>
</style>