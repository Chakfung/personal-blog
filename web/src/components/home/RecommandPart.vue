<template>
  <div class="recommandpart">
    <div class="chil intro">
      <div class="text">
        <div class="intro-title">序言</div>
        <div class="head-content">
          <p>大家好，我的名字是吴泽锋，今年22岁。</p>
          <p>
            我出生在广州并且在广州长大，广州别称羊城、花城，是广东省省会，中国四大一线城市之一，
            在这里不仅有发达的金融业、高新制造业，也有着浓厚的文化底蕴。
          </p>
          <p>我的职业发展方向是前端工程师，目前在多益网络实习。</p>
          <p>
            我的爱好是摄影，喜欢拿着相机独自穿梭于老城区里捕抓那一个个动人的瞬间。
          </p>
        </div>
      </div>
      <div class="pic">
        <img src="../../assets/images/home/23.png" alt="" />
      </div>
    </div>

    <div class="chil hit-blog content-box">
      <a class="head">
        <i class="iconfont icon-fire" style="color: rgba(201, 2, 2, 0.801)"></i>
        <div class="title">热门博客</div>
      </a>
      <div class="content">
        <div class="item">
          <img src="../../assets/images/home/1.png" alt="" />
          <div class="shad"></div>
        </div>
        <div class="item"></div>
        <div class="item"></div>
        <div class="item"></div>
      </div>
    </div>

    <div class="chil video content-box">
      <a class="head">
        <i
          class="iconfont icon-shui"
          style="color: rgb(0, 74, 158); font-weight: 700"
        ></i>
        <div class="title">精选图片</div>
      </a>
      <div class="content">
        <div class="item"></div>
        <div class="item"></div>
        <div class="item"></div>
        <div class="item"></div>
      </div>
    </div>
    <div class="chil gallery content-box">
      <a class="head">
        <i
          class="iconfont icon-leidian"
          style="color: rgba(190, 146, 0, 0.945); font-size: 35px"
        ></i>
        <div class="title">最新视频</div>
      </a>
      <div class="content">
        <div class="item"></div>
        <div class="item"></div>
        <div class="item"></div>
        <div class="item"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "recommandpart",
};
</script>
<style scoped lang="scss">
.recommandpart {
  position: relative;
  left: 50%;
  transform: translate(-50%, 0);
  width: 60%;
  min-height: 800px;
  min-width: 400px;
  display: flex;
  flex-direction: column;
  .chil {
    width: 100%;
  }
  .intro {
    margin-top: 50px;
    display: flex;
    flex-wrap: wrap;
    align-items: start;
    .text {
      margin-top: 35px;
      flex: 1;
      min-width: 300px;

      display: flex;
      flex-direction: column;
      .intro-title {
        height: 40px;
        width: 100%;
        font-family: Lato, "Helvetica Neue", Arial, Helvetica, sans-serif;
        font-weight: 700;
        line-height: 40px;
        padding: 0 10px;
        text-transform: none;
        color: black;
        font-size: 18px;
      }
      .head-content {
        p {
          margin-top: 0;
          font-style: italic;
          font-size: 1.2em;
          margin: 0 0 1em;
          line-height: 1.4285em;
          display: block;
          margin-block-start: 1em;
          margin-block-end: 1em;
          margin-inline-start: 0px;
          margin-inline-end: 0px;
          color: rgba(0, 0, 0, 0.67);
          font-size: 16.8px;
        }
      }
    }
    .pic {
      height: 400px;
      flex: 1;
      min-width: 300px;
      display: flex;
      align-items: center;
      justify-content: center;

      img {
        width: 90%;
        min-width: 280px;
        border-radius: 10px;
      }
    }
  }

  .content-box {
    min-height: 300px;
    border: 1px red solid;
    display: flex;
    flex-direction: column;
    .head {
      width: 100%;
      height: 50px;
      border: 1px red solid;
      display: flex;
      i {
        padding: 8px 8px;
        font-size: 30px;
        width: 50px;
        height: 50px;
        border: 1px red solid;
      }
      .title {
        border: 1px red solid;
        height: 50px;
        width: 100px;
        font-family: Lato, "Helvetica Neue", Arial, Helvetica, sans-serif;
        font-weight: 700;
        line-height: 50px;
        color: rgba(0, 0, 0, 0.67);
        padding: 0 0 0 10px;
        font-size: 18px;
      }
    }
    .content {
      width: 100%;
      border: 1px red solid;
      flex: 1;
      display: flex;
      justify-content: space-around;
      align-items: center;
      flex-wrap: wrap;
      .item {
        margin-top: 20px;
        margin-bottom: 20px;
        min-height: 150px;
        max-width: 300px;
        border: 1px red solid;
        min-width: 230px;
        position: relative;
        overflow: hidden;
        border-ra
        img {
          position: absolute;
          height: 100%;
        }
        .shad {
          position: absolute;
          top: 0;
          left: 0;
          height: 0px;
          width: 100%;
          background-color: rgba(0, 0, 0, 0.171);
        }
        &:hover .shad {
          height: 100%;
          transition: 0.2s ease-in-out;
        }
      }
    }
  }
  .hit-blog {
  }
  .video {
  }
  .gallery {
  }
}
</style>