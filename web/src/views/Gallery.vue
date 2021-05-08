<template>
  <div class="gallery">
    <div class="top"></div>
    <div class="waterFall-box" ref="box">
      <div
        class="img-box"
        v-for="(item, index) in images"
        :key="index"
        ref="img"
      >
        <img :src="item.src" alt="" />
      </div>
      <footer
        v-if="isLoad == false"
        :style="{
          position: 'absolute',
          top: Math.max(...heightArray) + 'px',
          color: 'red',
          left: '50%',
          transform: 'translateX(-50%)',
        }"
      >
        没有图片加载了...
      </footer>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      images: [],
      imgWidth: 220, //图片的宽度
      heightArray: [], //存储高度数组，用于判断最小高度的图片位置
      isLoad: true, //是否继续加载图片
      surplusW: 0, //是否存在剩余宽度
      offsetP: 0,
      count: 0,
    };
  },
  methods: {
    async fetchPics() {
      const res = await this.$http.get("/pictures");
      this.images = res.data;
      this.loadImgHeight();
    },
    /**
     * 预加载图片资源
     * */
    loadImgHeight() {
      let count = 0; //计数变量 判断是否预加载图片是否完成
      this.images.forEach((item) => {
        //使用image类预加载图片
        let image = new Image();
        image.src = item.img;
        image.onload = image.onerror = (event) => {
          count++;
          if (count == this.images.length) {
            this.$nextTick(() => {
              this.init();
              this.positionImg(0);
            });
          }
        };
      });
    },
    /**
     * @remarks 初始化
     * 初始化容器的宽度，计算出容器可容纳多少固定宽度图片的列，
     * 如果可排列固定宽度的图片宽度无法沾满容器的宽度，需要计算出空余的宽度，固定首图片的left
     * */
    init() {
      //得到页面的宽度
      const pageWidth_padding = this.$refs.box.clientWidth;
      //页面的padding像素
      this.offsetP = this.$refs.box.style.paddingLeft.replace(/[^0-9]/gi, "");
      //获得页面的真实宽度（除去padding、margin、border...）
      const pageWidth = pageWidth_padding - this.offsetP * 2;
      //计算出当前页面可展示多少列图片
      const column = Math.floor(pageWidth / this.imgWidth);
      //偏移像素值
      this.surplusW = pageWidth - column * this.imgWidth;
      //初始化存储高度数组
      for (let i = 0; i < column; i++) {
        this.heightArray.push(0);
      }
    },
    /**
     * @remark 定位图片
     * @param:
     *  start: 循环开始位置，开始为0，如果滚动条滑到底部，则start为容器存在图片资源的数量即this.images.length
     *  ----------宽高都计算img的父容器的宽高
     * */
    positionImg(start) {
      //获得img标签的父容器的DOM
      let parentDom = this.$refs.img;
      for (let i = start; i < this.images.length; i++) {
        //获得最小高度
        const minHeight = Math.min(...this.heightArray);
        //获得最小高度索引
        const index = this.heightArray.indexOf(minHeight);
        //获得当前图片的高度
        const currHeight = parentDom[i].clientHeight;
        //定位
        parentDom[i].style.transform = "50px";
        parentDom[i].style.position = "absolute";
        parentDom[i].style.top = minHeight + "px";
        parentDom[i].style.left =
          this.imgWidth * index + +(Math.floor(this.surplusW / 2) + 30) + "px";
        this.heightArray[index] += currHeight;
      }
      //对父容器赋值当前heightArray数组的最大高度
      this.$refs.box.style.height = Math.max(...this.heightArray) + 50 + "px";
    },
  },
  created() {
    this.fetchPics();
  },
};
</script>

<style lang="scss" scoped>
.top {
  width: 100%;
  height: 300px;
  border: 1px red solid;
}
.waterFall-box {
  border: 1px red solid;
  width: 950px;
  left: 50%;
  transform: translate(-50%);
  position: relative;
  text-align: center;
}

.waterFall-box .img-box {
  width: 210px;
  vertical-align: top;
  display: block;
  float: left;
}

.waterFall-box .img-box img {
  width: 100%;
  animation: imgBox 0.5s ease-in-out;
}

.waterFall-box .img-box img:hover {
  transform: translateY(-3px);
  transition: transform 0.5s ease-in-out;
  box-shadow: 0 20px 20px 2px #737373;
}

@keyframes imgBox {
  0% {
    opacity: 0;
    transform: translateY(-100px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>