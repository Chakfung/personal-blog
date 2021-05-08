<template>
  <div class="view">
            <ul>
              
            </ul>
            <button @click="prev" class="prev">上一张</button>
            <button @click="next" class="next">下一张</button>
        </div>
</template>

<script>
  export default {
    name: "app",
    data() {
      return {
        data:['../../assets/images/home/1.png',
              '../../assets/images/home/2.png',
              '../../assets/images/home/3.png',
              '../../assets/images/home/4.png',]
      }
    }
  };
</script>

<style lang="scss">
  * {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
  }
</style>