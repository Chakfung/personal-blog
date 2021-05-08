<template>
  <div class="home">
    <!-- 是撒大所多 -->
    <nav-bar></nav-bar>

    <head-part></head-part>
    <recommand-part></recommand-part>
    <artical-part></artical-part>
  </div>
</template>

<script>
import NavBar from "../components/NavBar";
import HeadPart from "../components/home/HeadPart";
import RecommandPart from "../components/home/RecommandPart";
import ArticalPart from "../components/home/ArticalPart";

export default {
  components: { NavBar, HeadPart, RecommandPart, ArticalPart },
  data() {
    return {
    };
  },
};
</script>

<style lang="scss">
.home {
  width: 100%;
  background-image: url(../assets/images/bg2.jpg);
}

</style>