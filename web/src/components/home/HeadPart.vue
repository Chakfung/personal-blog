<template>
  <div>
    <div class="headContainer">
      <img src="../../assets/images/bg1.jpg" class="ui image backgroundImg" />
      <div class="backgroundLayout">
        <div align="center" class="myInfoDiv">
          <img
            src="../../assets/images/protrait.png"
            class="ui tiny circular image"
          />
          <div class="word">
            <span> 平凡 </span>
          </div>
          <div class="myLink">
            <a id="wechat" class="ui wechat circular icon button">
              <i class="iconfont icon-wechat"></i>
              <div
                id="wechatPic"
                class="ui flowing popup bottom center transition hidden wechat"
                style="inset: 408.188px auto auto 320.844px"
              >
                <img
                  src="../../assets/images/wechat.png"
                  class="ui small rounded image"
                />
              </div>
            </a>
            <a id="QQ" class="ui qq circular icon button"
              ><i class="iconfont icon-qq"></i>
              <div
                id="QQPic"
                class="ui flowing popup bottom center transition hidden qq"
                style="inset: 408.188px auto auto 363.047px"
              >
                <img
                  src="../../assets/images/wechat.png"
                  class="ui small rounded image"
                />
              </div>
            </a>
            <a
              href="https://github.com/Chakfung"
              target="_blank"
              class="ui circular icon button"
              ><i class="iconfont icon-github"></i
            ></a>
          </div>
          <div id="indexNavMenu" class="nav">
            <a
              href="/category"
              class="ui teal button"
              style="background-color: #00b5ad"
              ><i class="iconfont icon-article"></i>博客</a
            >
            <a
              href="/category"
              class="ui teal button"
              style="background-color: #ff1783"
              ><i class="iconfont icon-Gallery"></i>图库</a
            >
            <a
              href="/video"
              class="ui twitter button"
              style="background-color: #0f87d8"
              ><i class="iconfont icon-video"></i>视频</a
            >
            <a
              href="/commentWall"
              class="ui linkedin button"
              style="background-color: #9161ff"
              ><i class="iconfont icon-liuyan"></i>留言</a
            >
          </div>
          <div class="guidance"><i class="ui chevron down icon"></i></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  name: "headpart",
};
</script>

<style lang="scss">
.colortem {
  background-color: #ff1783;
}
.headContainer {
  position: relative;
  width: 100%;
  height: 720px;
  overflow: hidden;
  .backgroundImg {
    width: 100%;
    height: 710px;
    object-fit: cover;
  }
  img.ui.image {
    position: relative;
    vertical-align: middle;
    max-width: 100%;
    background-color: transparent;
    display: block;
  }
  .backgroundLayout {
    position: absolute;
    top: 0em;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    .myInfoDiv {
      min-width: 650px;
      margin-bottom: 50px;
      .circular.image {
        width: 100px;
        height: auto;
        font-size: 28px;
        border-radius: 60px;
      }

      .word span {
        display: block;
        font-size: 1.5em;
        font-style: italic;
        color: #c9ba9b;
        margin: 18px 0;
      }
      .myLink {
        margin-bottom: 50px;
        width: 120px;
        display: flex;
        align-items: center;
        justify-content: space-around;

        .ui.circular.button {
          width: 30px;
          height: 30px;
          border-radius: 15px;
          cursor: pointer;
          display: inline-block;
          min-height: 1em;
          outline: 0;
          border: none;
          vertical-align: baseline;
          background: #e0e1e2 none;
          color: rgba(0, 0, 0, 0.6);
          font-family: Lato, "Helvetica Neue", Arial, Helvetica, sans-serif;
          margin: 0 0.25em 0 0;
          text-transform: none;
          text-shadow: none;
          font-weight: 700;
          line-height: 1em;
          font-style: normal;
          text-align: center;
          text-decoration: none;
          display: flex;
          align-items: center;
          justify-content: center;

          .popup {
            position: absolute;
            width: 150px;
            height: 150px;
            background-color: #fff;
            border-radius: 10px;

            .image {
              margin: 5px 5px;
              width: 140px;
              height: 140px;
            }
            &.wechat {
              margin-left: 515px;
              display: none;
              &::before {
                content: "";
                position: absolute;
                top: -14px;
                right: 68px;
                width: 0px;
                height: 0px;
                border-bottom: 7px solid #fff;
                border-right: 7px solid transparent;
                border-left: 7px solid transparent;
                border-top: 7px solid transparent;
              }
            }
            &.qq {
              margin-left: 515px;
              display: none;
              &::before {
                content: "";
                position: absolute;
                top: -14px;
                right: 68px;
                width: 0px;
                height: 0px;
                border-bottom: 7px solid #fff;
                border-right: 7px solid transparent;
                border-left: 7px solid transparent;
                border-top: 7px solid transparent;
              }
            }
          }
          &:hover {
            background: #cacaca;
            .popup {
              display: block;
            }
          }

          i {
            margin-top: 1px;
            width: 1em;
            vertical-align: baseline;
          }
        }
      }
      .nav {
        left: 50%;
        width: 100%;
        height: 60px;
        display: flex;
        justify-content: space-around;
        align-items: center;
        a {
          display: block;
          opacity: 1;
          width: 120px;
          padding: 12px;
          margin-right: 15px;
          color: #fff;
          text-shadow: none;
          background-image: none;
          text-decoration: none;
          height: 40px;
          padding-bottom: 15px;
          border-radius: 5px;
          font-size: 14px;
          font-family: Lato, "Helvetica Neue", Arial, Helvetica, sans-serif;
          font-weight: 600;
          opacity: 80%;
          &:hover {
            opacity: 100%;
            box-shadow: 0px 5px 10px rgba(255, 255, 255, 0.233);
          }
          i {
            margin-right: 5px;
          }
        }
      }
    }
  }
}
</style>