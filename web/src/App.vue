<template>
  <div id="app" class="body">
    <header>
      <div class="logo">
        <i class=""></i>
        <span>个人博客</span>
      </div>
      <div class="search"></div>
      <div class="nav">
        <ul>
          <li class="active">Component</li>
          <li>Gallery</li>
          <li>Blog</li>
        </ul>
      </div>
    </header>
    <router-view></router-view>
  </div>
</template>

<script>

export default {
  name: 'app'
}
</script>

<style lang="scss">
  * {
    padding: 0;
    margin: 0;
  }
  .body {
    min-height: 800px;
    background-color: #f4f4f4;
  }
  header {
    background: #fff;
    width: 100%;
    height: 92px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    box-shadow: 0 3px 9px rgb(235, 235, 235);
    .logo {
      width: 200px;
      height: 100%;
      border: 1px red solid;
      text-align: center;
      display: flex;
      justify-content: center;
      align-items: center;
      i {
        width: 50px;
        height: 50px;
        border: 1px red solid;
      }
      span {
        font-weight: 600;
        font-size: 28px;
        font-family: 'Hind', sans-serif;
        color:#2d3748;
      }
    }
    .search {
      width: 200px;
      height: 100%;
      border: 1px red solid;
    }
    .nav{
      width: 400px;
      height: 100%;
      border: 1px red solid;
      display: flex;
      justify-content: center;
      align-items: center;
      ul {
        width: 100% ;
        display: flex;
        flex-direction: row;
        list-style: none;
        justify-content: space-around;

        li {
           border: 1px red solid;
           width: 100px;
           font-size: 18px;
           font-weight: 500;
           font-family: 'Hind', sans-serif;
           color:rgb(156, 156, 156);
           &.active{
              color:#5a67d8;
           }
        }
      }
    }
  }
</style>
