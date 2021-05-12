<template>
  <div :class="['nav-bar', navFix ? 'nav__fixed' : '']">
    <header>
      <div class="logo">
        <i class=""></i>
        <span>个人博客</span>
      </div>
      <div class="search">
        <div class="search-bar">
          <i></i>
          <form action="">
            <input type="text" />
          </form>
        </div>
      </div>
      <div class="nav">
        <ul>
          <li style="margin-right: 35px">Component</li>
          <li @click="goGallery()">Gallery</li>
          <li @click="cc()">Blog</li>
          <li @click="goCommunity()">Community</li>
          <li @click="goLoad()">Load</li>
          <li @click="goRegister()">Register</li>
        </ul>
      </div>
    </header>
  </div>
</template>

<script>
export default {
  name: "NavBar",
  data() {
    return {
      navFix: false,
      scrTop: "",
    };
  },
  methods: {
    goCommunity() {
      this.$router.push("/community");
    },
    goGallery() {
      this.$router.push("/gallery");
    },
    goRegister() {
      this.$router.push("/register");
    },
    goLoad() {
      this.$router.push("/load");
    },
    handleScroll() {
      if (document.documentElement.scrollTop > 250) {
        this.navFix = true;
      } else {
        this.navFix = false;
      }
    },
  },
  watch: {},
  mounted() {
    window.addEventListener("scroll", this.handleScroll, true);
  },
};
</script>

<style lang="scss">
.nav-bar {
  min-width: 1000px;
  width: 100%;
  z-index: 100;
  display: none;
  transition: all ease-in-out 3s;
  opacity: 0;
  height: 0;
  &.nav__fixed {
    display: block;
    transition: all 3s ease-in-out;
    opacity: 0.8;
    position: fixed;
    top: 0;
    height: 70px;
  }
  header {
    background: #fff;
    width: 100%;
    height: 72px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    box-shadow: 0 3px 9px rgb(235, 235, 235);

    .logo {
      width: 200px;
      height: 100%;
      text-align: center;
      display: flex;
      justify-content: center;
      align-items: center;
      min-width: 200px;

      i {
        width: 50px;
        height: 50px;
      }

      span {
        font-weight: 600;
        font-size: 28px;
        font-family: "Hind", sans-serif;
        color: #2d3748;
      }
    }

    .search {
      width: 300px;
      height: 50%;

      display: flex;
      justify-content: center;
      align-items: center;

      .search-bar {
        display: flex;
        max-width: 800px;
        width: 400px;
        height: 100%;
        margin: 0 auto;
        background-color: #f4f4f4;
        border-radius: 5px;
        align-items: center;

        i {
          margin: 15px;
          width: 30px;
          height: 30px;
        }

        form {
          height: 100%;
          display: flex;
          align-items: center;
          flex: 1;
          position: relative;

          input {
            display: flex;
            flex: 1;
            padding: 10px 20px 10px 10px;
            height: 48px;
            font-size: 17px;
            color: var(--font-color);
            border: none;
            font-weight: 400;
            border-radius: var(--border-radius);
            position: relative;
            right: 0;
            background: var(--bg-grey);
            outline: 0;
            border: 1px solid var(--border-color);
          }
        }
      }
    }

    .nav {
      width: 400px;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;

      ul {
        width: 100%;
        display: flex;
        flex-direction: row;
        list-style: none;
        justify-content: space-around;

        li {
          width: 100px;
          font-size: 18px;
          font-weight: 500;
          font-family: "Hind", sans-serif;
          color: rgb(156, 156, 156);

          &.active {
            color: #5a67d8;
          }

          &:hover {
            color: #5a67d8;
            cursor: pointer;
          }
        }
      }
    }
  }
}
</style>