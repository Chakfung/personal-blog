<template>
  <div class="panel" :class="active ? 'active' : ''">
    <div class="control">
      <div class="title">照 片 管 理 器</div>
      <div class="save">
        <div id="clipImgDiv" class="preview"></div>
        <button @click="save()">保存图片</button>
        <button @click="initCanvas()">打开图片</button>
      </div>
      <div class="turn">
        <span>旋转</span>
        <ul>
          <li><i class="iconfont icon-undo" @click="rotateLeft()"></i></li>
          <li><i class="iconfont icon-redo" @click="rotateRight()"></i></li>
          <li><i class="iconfont icon-transfer" @click="rotateY()"></i></li>
          <li><i class="iconfont icon-transfer1" @click="rotateX()"></i></li>
        </ul>
      </div>
      <div class="cut">
        <div class="cut-title">裁剪</div>
        <div class="label"><span>高度</span><span>宽度</span></div>
        <div class="input">
          <input type="text" id="cuswidth" v-model="cropboxwid" />
          ×
          <input type="text" id="cusheight" v-model="cropboxhei" />
        </div>
        <div class="but">
          <button id="btn1" @click="loadCutBox()">裁剪</button>
          <button id="btn2" @click="confirmCut()">确定</button>
          <button id="btn4" @click="cancelCutBox()">取消</button>
        </div>
      </div>
      <div class="filter">
        <div class="label">滤镜</div>
        <ul>
          <li>
            <button
              @click="invert()"
              id="invert"
              style="
                background: url(/filter1.jpg) no-repeat;
                background-size: 50px;
              "
            >
              反色
            </button>
          </li>
          <li>
            <button
              @click="blur()"
              id="blur"
              style="
                background: url(/filter1.jpg) no-repeat;
                background-size: 50px;
              "
            >
              模糊
            </button>
          </li>
          <li>
            <button
              @click="gray()"
              id="gray"
              style="
                background: url(/filter1.jpg) no-repeat;
                background-size: 50px;
              "
            >
              灰度
            </button>
          </li>
          <li>
            <button
              @click="relief()"
              id="relief"
              style="
                background: url(/filter1.jpg) no-repeat;
                background-size: 50px;
              "
            >
              浮雕
            </button>
          </li>
        </ul>
      </div>
      <div class="undohistory">
        <button id="undo" @click="undo()">undo</button>
        <button id="redo" @click="redo()">redo</button>
      </div>
    </div>
    <div class="editarea" @keyup="keyMove()">
      <div class="close" @click="close()">
        <i class="iconfont icon-close"></i>
      </div>
      <div class="target" id="imgDiv"></div>
      <div class="scale">
        <div class="scale-title">
          图片缩放
          <div class="size">
            <span>{{ parseInt(scalewidth) }}</span
            >×<span>{{ parseInt(scaleheight) }}</span>
          </div>
        </div>
        <div class="change">
          <div class="percent">{{ scale }}%</div>
          <a @click="sub()">-</a>
          <input type="range" v-model="scale" max="150" min="50" value="100" />
          <a @click="add()">+</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from "jquery";
var myCanvas;
var img;
var ctx;
var multiple = 1;
var newCanvas;
var oRelDiv = document.createElement("div");
const calcu = function (num) {
  const unit = ["B", "KB", "MB", "GB"];
  let level = 0;
  while (num >= 1024) {
    level++;
    num /= 1024;
  }
  return num.toFixed(2) + unit[level];
};
export default {
  data() {
    return {
      active: false,
      scale: 100,
      oriWid: 960,
      oriHei: 600,
      scalewidth: 960,
      scaleheight: 600,
      history: {
        name: "",
        undohistory: [],
        redohistory: [],
      },
      sendHistory: {
        name: "",
        history: [],
      },
      tempHistory: [],
      delta: 0,
      cropboxwid: 80,
      cropboxhei: 80,
      posX: 0,
      posY: 0,
      scaleposX: 0,
      scaleposY: 0,
      params: {
        left: 0,
        top: 0,
        width: 0,
        height: 0,
        currentX: 0,
        currentY: 0,
        flag: false,
        kind: "drag",
      },
    };
  },
  methods: {
    initCanvas(e) {
      document.body.style.overflow = "hidden";
      this.active = true;
      myCanvas = document.createElement("canvas");
      myCanvas.setAttribute("id", "myCanvas");
      myCanvas.style.display = "block";
      myCanvas.width = this.oriWid;
      myCanvas.height = this.oriHei;
      myCanvas.style.zIndex = "auto";
      var imgDiv = document.getElementById("imgDiv");
      imgDiv.appendChild(myCanvas);
      ctx = myCanvas.getContext("2d");
      var fileInput = document.createElement("input");
      fileInput.setAttribute("type", "file");
      img = new Image();
      img.src = "";
      img.width = 960;
      img.height = 600;
      fileInput.click();
      const that = this;
      fileInput.addEventListener("change", function () {
        const getItem = JSON.parse(localStorage.getItem("key"));
        if (getItem != null && getItem.name === this.files[0].name) {
          that.history.undohistory = [];
          that.history.redohistory = [];
          that.sendHistory = getItem;
        } else {
          localStorage.removeItem("key");
          that.history.undohistory = [];
          that.history.redohistory = [];
          that.sendHistory.history = [];
          that.sendHistory.name = this.files[0].name;
        }
        img.src = window.webkitURL.createObjectURL(this.files[0]);
      });
      img.onload = function () {
        ctx.drawImage(img, 0, 0, 960, 600);
        that.history.undohistory.push(
          document.getElementById("myCanvas").toDataURL()
        );
        if (that.sendHistory.history.length !== 0) {
          const controls = that.sendHistory.history;
          that.sendHistory.history = [];
          controls.forEach((item) => {
            switch (item) {
              case "rotateLeft":
                that.rotateLeft();
                break;
              case "rotateRight":
                that.rotateRight();
                break;
              case "rotateX":
                that.rotateX();
                break;
              case "rotateY":
                that.rotateY();
                break;
              case "invert":
                that.invert();
                break;
              case "blur":
                that.blur();
                break;
              case "gray":
                that.gray();
                break;
              case "relief":
                that.relief();
                break;
            }
          });
        }
      };
    },
    rotateLeft() {
      const imageData = ctx.getImageData(0, 0, this.oriWid, this.oriHei);
      const imgdt1 = new ImageData(this.oriHei, this.oriWid);
      const imgdt2 = new ImageData(this.oriHei, this.oriWid);
      const dt0 = imageData.data;
      const dt1 = imgdt1.data;
      const dt2 = imgdt2.data;
      let r = 0;
      let r1 = 0;
      for (let y = 0, lenH = this.oriHei; y < lenH; y++) {
        for (let x = 0, lenW = this.oriWid; x < lenW; x++) {
          r = (x + lenW * y) * 4;
          r1 = (y + lenH * x) * 4;
          dt1[r1 + 0] = dt0[r + 0];
          dt1[r1 + 1] = dt0[r + 1];
          dt1[r1 + 2] = dt0[r + 2];
          dt1[r1 + 3] = dt0[r + 3];
        }
      }
      // 3. Reverse width / height
      for (let y = 0, lenH = this.oriWid; y < lenH; y++) {
        for (let x = 0, lenW = this.oriHei; x < lenW; x++) {
          r = (x + lenW * y) * 4;
          r1 = (x + lenW * (lenH - 1 - y)) * 4;
          dt2[r1 + 0] = dt1[r + 0];
          dt2[r1 + 1] = dt1[r + 1];
          dt2[r1 + 2] = dt1[r + 2];
          dt2[r1 + 3] = dt1[r + 3];
        }
      }
      myCanvas.width = this.oriHei;
      myCanvas.height = this.oriWid;
      ctx.putImageData(imgdt2, 0, 0, 0, 0, this.oriHei, this.oriWid);
      const temp1 = this.scalewidth;
      this.scalewidth = this.scaleheight;
      this.scaleheight = temp1;
      const temp2 = this.oriHei;
      this.oriHei = this.oriWid;
      this.oriWid = temp2;
      if ($("#cropContainer").length !== 0) {
        $("#cropContainer").remove();
        const temp3 = this.cropboxwid;
        this.cropboxwid = this.cropboxhei;
        this.cropboxhei = temp3;
        const temp4 = this.posX;
        this.posX = this.posY;
        this.posY = this.scaleheight - temp4 - this.cropboxhei;
        this.loadCutBox();
      }
      this.history.undohistory.push("rotateLeft");
      this.sendHistory.history.push("rotateLeft");
    },
    rotateRight() {
      const imageData = ctx.getImageData(0, 0, this.oriWid, this.oriHei);
      const imgdt1 = new ImageData(this.oriHei, this.oriWid);
      const imgdt2 = new ImageData(this.oriHei, this.oriWid);
      const dt0 = imageData.data;
      const dt1 = imgdt1.data;
      const dt2 = imgdt2.data;
      let r = 0;
      let r1 = 0;
      for (let y = 0, lenH = this.oriHei; y < lenH; y++) {
        for (let x = 0, lenW = this.oriWid; x < lenW; x++) {
          r = (x + lenW * y) * 4;
          r1 = (y + lenH * x) * 4;
          dt1[r1 + 0] = dt0[r + 0];
          dt1[r1 + 1] = dt0[r + 1];
          dt1[r1 + 2] = dt0[r + 2];
          dt1[r1 + 3] = dt0[r + 3];
        }
      }
      // 3. Reverse width / height
      for (let y = 0, lenH = this.oriWid; y < lenH; y++) {
        for (let x = 0, lenW = this.oriHei; x < lenW; x++) {
          r = (x + lenW * y) * 4;
          r1 = (lenW - 1 - x + lenW * y) * 4;
          dt2[r1 + 0] = dt1[r + 0];
          dt2[r1 + 1] = dt1[r + 1];
          dt2[r1 + 2] = dt1[r + 2];
          dt2[r1 + 3] = dt1[r + 3];
        }
      }
      myCanvas.width = this.oriHei;
      myCanvas.height = this.oriWid;
      ctx.putImageData(imgdt2, 0, 0, 0, 0, this.oriHei, this.oriWid);
      const temp1 = this.scalewidth;
      this.scalewidth = this.scaleheight;
      this.scaleheight = temp1;
      const temp2 = this.oriHei;
      this.oriHei = this.oriWid;
      this.oriWid = temp2;
      if ($("#cropContainer").length !== 0) {
        $("#cropContainer").remove();
        const temp3 = this.cropboxwid;
        this.cropboxwid = this.cropboxhei;
        this.cropboxhei = temp3;
        const temp4 = this.posX;
        this.posX = this.posY;
        this.posY = this.scalewidth - temp4 - this.cropboxwid;
        this.loadCutBox();
      }
      this.history.undohistory.push("rotateRight");
      this.sendHistory.history.push("rotateRight");
    },
    rotateY() {
      const canvasData = ctx.getImageData(
        0,
        0,
        myCanvas.width,
        myCanvas.height
      );
      const dst = ctx.createImageData(canvasData.width, canvasData.height);
      dst.data.set(canvasData.data);
      const tempCanvasData = dst;
      for (let x = 0; x < tempCanvasData.width; x++) {
        for (let y = 0; y < tempCanvasData.height; y++) {
          const idx = (x + y * tempCanvasData.width) * 4;
          const midx =
            (tempCanvasData.width - 1 - x + y * tempCanvasData.width) * 4;
          canvasData.data[midx + 0] = tempCanvasData.data[idx + 0]; // Red channel
          canvasData.data[midx + 1] = tempCanvasData.data[idx + 1]; // Green channel
          canvasData.data[midx + 2] = tempCanvasData.data[idx + 2]; // Blue channel
          canvasData.data[midx + 3] = 255; // Alpha channel
        }
      }
      ctx.putImageData(canvasData, 0, 0);
      if ($("#cropContainer").length !== 0) {
        $("#cropContainer").remove();
        this.posX = this.scalewidth - this.posX - this.cropboxwid;
        this.loadCutBox();
      }
      this.history.undohistory.push("rotateY");
      this.sendHistory.history.push("rotateY");
    },
    rotateX() {
      const canvasData = ctx.getImageData(
        0,
        0,
        myCanvas.width,
        myCanvas.height
      );
      const dst = ctx.createImageData(canvasData.width, canvasData.height);
      dst.data.set(canvasData.data);
      const tempCanvasData = dst;
      for (let y = 0; y < tempCanvasData.height; y++) {
        for (let x = 0; x < tempCanvasData.width; x++) {
          const idx = (x + y * tempCanvasData.width) * 4;
          const midx =
            (tempCanvasData.width * (tempCanvasData.height - (y + 1)) + x) * 4;
          canvasData.data[midx + 0] = tempCanvasData.data[idx + 0]; // Red channel
          canvasData.data[midx + 1] = tempCanvasData.data[idx + 1]; // Green channel
          canvasData.data[midx + 2] = tempCanvasData.data[idx + 2]; // Blue channel
          canvasData.data[midx + 3] = 255; // Alpha channel
        }
      }
      ctx.putImageData(canvasData, 0, 0);
      if ($("#cropContainer").length !== 0) {
        $("#cropContainer").remove();
        this.posY = this.scalehe - this.posX - this.cropboxhei;
        this.loadCutBox();
      }
      this.history.undohistory.push("rotateY");
      this.sendHistory.history.push("rotateY");
    },
    invert() {
      this.history.undohistory.push(
        document.getElementById("myCanvas").toDataURL()
      );
      const len = myCanvas.width * myCanvas.height * 4;
      const canvasData = ctx.getImageData(
        0,
        0,
        myCanvas.width,
        myCanvas.height
      );
      const binaryData = canvasData.data;
      for (var i = 0; i < len; i += 4) {
        var r = binaryData[i];
        var g = binaryData[i + 1];
        var b = binaryData[i + 2];
        binaryData[i] = 255 - r;
        binaryData[i + 1] = 255 - g;
        binaryData[i + 2] = 255 - b;
      }
      ctx.putImageData(canvasData, 0, 0);
      this.history.undohistory.push(
        document.getElementById("myCanvas").toDataURL()
      );
      this.sendHistory.history.push("invert");
    },
    blur() {
      this.history.undohistory.push(
        document.getElementById("myCanvas").toDataURL()
      );
      const canvasData = ctx.getImageData(
        0,
        0,
        myCanvas.width,
        myCanvas.height
      );
      const dst = ctx.createImageData(canvasData.width, canvasData.height);
      dst.data.set(canvasData.data);
      const tempCanvasData = dst;
      let sumred = 0.0;
      let sumgreen = 0.0;
      let sumblue = 0.0;

      for (let x = 0; x < tempCanvasData.width; x++) {
        for (let y = 0; y < tempCanvasData.height; y++) {
          // Index of the pixel in the array
          const idx = (x + y * tempCanvasData.width) * 4;
          for (let subCol = -2; subCol <= 2; subCol++) {
            let colOff = subCol + x;
            if (colOff < 0 || colOff >= tempCanvasData.width) {
              colOff = 0;
            }
            for (let subRow = -2; subRow <= 2; subRow++) {
              let rowOff = subRow + y;
              if (rowOff < 0 || rowOff >= tempCanvasData.height) {
                rowOff = 0;
              }
              const idx2 = (colOff + rowOff * tempCanvasData.width) * 4;
              const r = tempCanvasData.data[idx2 + 0];
              const g = tempCanvasData.data[idx2 + 1];
              const b = tempCanvasData.data[idx2 + 2];
              sumred += r;
              sumgreen += g;
              sumblue += b;
            }
          }
          // calculate new RGB value
          const nr = sumred / 25.0;
          const ng = sumgreen / 25.0;
          const nb = sumblue / 25.0;
          // clear previous for next pixel point
          sumred = 0.0;
          sumgreen = 0.0;
          sumblue = 0.0;
          // assign new pixel value
          canvasData.data[idx + 0] = nr; // Red channel
          canvasData.data[idx + 1] = ng; // Green channel
          canvasData.data[idx + 2] = nb; // Blue channel
          canvasData.data[idx + 3] = 255; // Alpha channel
        }
      }
      ctx.putImageData(canvasData, 0, 0);
      this.history.undohistory.push(
        document.getElementById("myCanvas").toDataURL()
      );
      this.sendHistory.history.push("blur");
    },
    gray() {
      this.history.undohistory.push(
        document.getElementById("myCanvas").toDataURL()
      );
      const len = myCanvas.width * myCanvas.height * 4;
      const canvasData = ctx.getImageData(
        0,
        0,
        myCanvas.width,
        myCanvas.height
      );
      const binaryData = canvasData.data;
      for (let i = 0; i < len; i += 4) {
        const r = binaryData[i];
        const g = binaryData[i + 1];
        const b = binaryData[i + 2];
        binaryData[i] = r * 0.272 + g * 0.534 + b * 0.131;
        binaryData[i + 1] = r * 0.349 + g * 0.686 + b * 0.168;
        binaryData[i + 2] = r * 0.393 + g * 0.769 + b * 0.189;
      }
      ctx.putImageData(canvasData, 0, 0);
      this.history.undohistory.push(
        document.getElementById("myCanvas").toDataURL()
      );
      this.sendHistory.history.push("gray");
    },
    relief() {
      this.history.undohistory.push(
        document.getElementById("myCanvas").toDataURL()
      );
      const canvasData = ctx.getImageData(
        0,
        0,
        myCanvas.width,
        myCanvas.height
      );
      const dst = ctx.createImageData(canvasData.width, canvasData.height);
      dst.data.set(canvasData.data);
      const tempCanvasData = dst;
      for (let x = 1; x < tempCanvasData.width - 1; x++) {
        for (let y = 1; y < tempCanvasData.height - 1; y++) {
          // Index of the pixel in the array
          const idx = (x + y * tempCanvasData.width) * 4;
          const bidx = (x - 1 + y * tempCanvasData.width) * 4;
          const aidx = (x + 1 + y * tempCanvasData.width) * 4;
          // calculate new RGB value
          let nr =
            tempCanvasData.data[aidx + 0] - tempCanvasData.data[bidx + 0] + 128;
          let ng =
            tempCanvasData.data[aidx + 1] - tempCanvasData.data[bidx + 1] + 128;
          let nb =
            tempCanvasData.data[aidx + 2] - tempCanvasData.data[bidx + 2] + 128;
          nr = nr < 0 ? 0 : nr > 255 ? 255 : nr;
          ng = ng < 0 ? 0 : ng > 255 ? 255 : ng;
          nb = nb < 0 ? 0 : nb > 255 ? 255 : nb;
          // assign new pixel value
          canvasData.data[idx + 0] = nr; // Red channel
          canvasData.data[idx + 1] = ng; // Green channel
          canvasData.data[idx + 2] = nb; // Blue channel
          canvasData.data[idx + 3] = 255; // Alpha channel
        }
      }
      ctx.putImageData(canvasData, 0, 0);
      this.history.undohistory.push(
        document.getElementById("myCanvas").toDataURL()
      );
      this.sendHistory.history.push("relief");
    },
    undo() {
      console.log("asd");
      this.tempHistory.push(this.sendHistory.history.pop());
      if (this.history.undohistory.length > 1) {
        this.history.redohistory.push(this.history.undohistory.pop());
        const control = this.history.redohistory[
          this.history.redohistory.length - 1
        ];
        if (control.length < 12) {
          switch (control) {
            case "rotateLeft":
              that.rotateLeft();
              break;
            case "rotateRight":
              that.rotateRight();
              break;
            case "rotateX":
              that.rotateX();
              break;
            case "rotateY":
              that.rotateY();
              break;
          }
          this.history.undohistory.pop();
        } else {
          const canvaspic = new Image();
          canvaspic.src = this.history.undohistory.pop();
          canvaspic.onload = function () {
            ctx.drawImage(canvaspic, 0, 0);
          };
        }
      }
    },
    redo() {
      this.sendHistory.history.push(this.tempHistory.pop());
      const control = this.history.redohistory[
        this.history.redohistory.length - 1
      ];
      if (control.length > 12) {
        this.history.undohistory.push(
          document.getElementById("myCanvas").toDataURL()
        );
        this.history.undohistory.push(this.history.redohistory.pop());
        const canvaspic = new Image();
        canvaspic.src = this.history.undohistory[
          this.history.undohistory.length - 1
        ];
        canvaspic.onload = function () {
          ctx.drawImage(canvaspic, 0, 0);
        };
      } else {
        switch (control) {
          case "rotateLeft":
            that.rotateLeft();
            break;
          case "rotateRight":
            that.rotateRight();
            break;
          case "rotateX":
            that.rotateX();
            break;
          case "rotateY":
            that.rotateY();
            break;
        }
        this.history.redohistory.pop();
      }
    },
    close() {
      document.body.style.overflow = "visble";
      this.active = false;
      $("#myCanvas").remove();
      myCanvas.width = 960;
      myCanvas.height = 600;
      this.scale = 100;
      localStorage.setItem("key", JSON.stringify(this.sendHistory));
      this.oriWid = 960;
      this.oriHei = 600;
      this.scalewidth = 960;
      this.scaleheight = 600;
    },
    loadCutBox() {
      var clickFlag = false;
      oRelDiv.innerHTML = "";
      oRelDiv.style.position = "absolute";
      oRelDiv.style.width = this.scalewidth + "px";
      oRelDiv.style.height = this.scaleheight + "px";
      oRelDiv.style.top = $("#myCanvas").offset().top + "px";
      oRelDiv.id = "cropContainer";
      myCanvas.parentNode.insertBefore(oRelDiv, myCanvas);
      if (this.posX || this.posY) {
      } else {
        this.posX = this.oriWid / 2 - this.cropboxwid / 2;
        this.posY = this.oriHei / 2 - this.cropboxhei / 2;
      }
      this.scaleposX = (this.posX * this.scale) / 100;
      this.scaleposY = (this.posY * this.scale) / 100;
      oRelDiv.innerHTML =
        '<div id="zxxCropBox" style="height:' +
        (this.cropboxhei * this.scale) / 100 +
        "px; width:" +
        (this.cropboxwid * this.scale) / 100 +
        "px; position:absolute; left:" +
        this.scaleposX +
        "px; top:" +
        this.scaleposY +
        'px; border:1px solid black;">' +
        '<div id="zxxDragBg" style="height:100%; background:white; opacity:0.3; filter:alpha(opacity=30); cursor:move"></div>' +
        '<div id="dragLeftTop" style="position:absolute; width:4px; height:4px; border:1px solid #000; background:white; overflow:hidden; left:-3px; top:-3px; cursor:nw-resize;"></div>' +
        '<div id="dragLeftBot" style="position:absolute; width:4px; height:4px; border:1px solid #000; background:white; overflow:hidden; left:-3px; bottom:-3px; cursor:sw-resize;"></div>' +
        '<div id="dragRightTop" style="position:absolute; width:4px; height:4px; border:1px solid #000; background:white; overflow:hidden; right:-3px; top:-3px; cursor:ne-resize;"></div>' +
        '<div id="dragRightBot" style="position:absolute; width:4px; height:4px; border:1px solid #000; background:white; overflow:hidden; right:-3px; bottom:-3px; cursor:se-resize;"></div>' +
        '<div id="dragTopCenter" style="position:absolute; width:4px; height:4px; border:1px solid #000; background:white; overflow:hidden; top:-3px; left:50%; margin-left:-3px; cursor:n-resize;"></div>' +
        '<div id="dragBotCenter" style="position:absolute; width:4px; height:4px; border:1px solid #000; background:white; overflow:hidden; bottom:-3px; left:50%; margin-left:-3px; cursor:s-resize;"></div>' +
        '<div id="dragRightCenter" style="position:absolute; width:4px; height:4px; border:1px solid #000; background:white; overflow:hidden; right:-3px; top:50%; margin-top:-3px; cursor:e-resize;"></div> ' +
        '<div id="dragLeftCenter" style="position:absolute; width:4px; height:4px; border:1px solid #000; background:white; overflow:hidden; left:-3px; top:50%; margin-top:-3px; cursor:w-resize;"></div>' +
        "</div>" +
        '<input type="text" id="cropPosX" value="' +
        this.scaleposX +
        '" style="position:relative; top: -26px; width: 30px"/>' +
        '<input type="text" id="cropPosY" value="' +
        this.scaleposY +
        '" style="position:relative; top: -26px; width: 30px"/>' +
        '<input type="text" id="cropImageWidth" value="' +
        (this.cropboxwid * this.scale) / 100 +
        '" style="position:relative; top: -26px; width: 30px"/>' +
        '<input type="text" id="cropImageHeight" value="' +
        (this.cropboxhei * this.scale) / 100 +
        '" style="position:relative; top: -26px; width: 30px"/>';
      const that = this;
      const startDrag = function (point, target, kind) {
        //point是拉伸点，target是被拉伸的目标，其高度及位置会发生改变
        //此处的target与上面拖拽的target是同一目标，故其params.left,params.top可以共用，也必须共用
        //初始化宽高
        that.params.width = that.getCss(target, "width");
        that.params.height = that.getCss(target, "height");
        //初始化坐标
        if (that.getCss(target, "left") !== "auto") {
          that.params.left = that.getCss(target, "left");
        }
        if (that.getCss(target, "top") !== "auto") {
          that.params.top = that.getCss(target, "top");
        }
        point.onmousedown = function (event) {
          that.params.kind = kind;
          that.params.flag = true;
          clickFlag = true;
          if (!event) {
            event = window.event;
          }
          var e = event;
          that.params.currentX = e.clientX; //鼠标按下时坐标x轴
          that.params.currentY = e.clientY; //鼠标按下时坐标y轴
          /*console.log('params.currentX=', params.currentX);
          console.log('params.currentY=', params.currentY);*/
          const cdisX =
            e.clientX - parseInt(that.getCss(that.ID("zxxCropBox"), "left"));
          const cdisY =
            e.clientY - parseInt(that.getCss(that.ID("zxxCropBox"), "top"));
          //防止IE文字选中，有助于拖拽平滑
          point.onselectstart = function () {
            return false;
          };

          document.onmousemove = function (event) {
            const e = event || window.event;
            clickFlag = false;
            if (that.params.flag) {
              const nowX = e.clientX; // 鼠标移动时x坐标
              const nowY = e.clientY; // 鼠标移动时y坐标
              const disX = nowX - that.params.currentX; // 鼠标x方向移动距离
              const disY = nowY - that.params.currentY; // 鼠标y方向移动距离
              if (that.params.kind === "n") {
                //上拉伸
                //高度增加或减小，位置上下移动
                target.style.top = parseInt(that.params.top) + disY + "px";
                target.style.height =
                  parseInt(that.params.height) - disY + "px";
              } else if (that.params.kind === "w") {
                //左拉伸
                target.style.left = parseInt(that.params.left) + disX + "px";
                target.style.width = parseInt(that.params.width) - disX + "px";
              } else if (that.params.kind === "e") {
                //右拉伸
                target.style.width = parseInt(that.params.width) + disX + "px";
              } else if (that.params.kind === "s") {
                //下拉伸
                target.style.height =
                  parseInt(that.params.height) + disY + "px";
              } else if (that.params.kind === "nw") {
                //左上拉伸
                target.style.left = parseInt(that.params.left) + disX + "px";
                target.style.width = parseInt(that.params.width) - disX + "px";
                target.style.top = parseInt(that.params.top) + disY + "px";
                target.style.height =
                  parseInt(that.params.height) - disY + "px";
              } else if (that.params.kind === "ne") {
                //右上拉伸
                target.style.top = parseInt(that.params.top) + disY + "px";
                target.style.height =
                  parseInt(that.params.height) - disY + "px";
                target.style.width = parseInt(that.params.width) + disX + "px";
              } else if (that.params.kind === "sw") {
                //左下拉伸
                target.style.left = parseInt(that.params.left) + disX + "px";
                target.style.width = parseInt(that.params.width) - disX + "px";
                target.style.height =
                  parseInt(that.params.height) + disY + "px";
              } else if (that.params.kind === "se") {
                //右下拉伸
                target.style.width = parseInt(that.params.width) + disX + "px";
                target.style.height =
                  parseInt(that.params.height) + disY + "px";
              } else {
                //移动
                let l = e.clientX - cdisX;
                let t = e.clientY - cdisY;
                if (l < 0) {
                  l = 0;
                } else if (
                  l >
                  myCanvas.width -
                    parseInt(that.getCss(that.ID("zxxCropBox"), "width"))
                ) {
                  l =
                    myCanvas.width -
                    parseInt(that.getCss(that.ID("zxxCropBox"), "width"));
                }
                if (t < 0) {
                  t = 0;
                } else if (
                  t >
                  myCanvas.height -
                    parseInt(that.getCss(that.ID("zxxCropBox"), "width"))
                ) {
                  t =
                    myCanvas.width -
                    parseInt(that.getCss(that.ID("zxxCropBox"), "width"));
                }
                target.style.left = l + "px";
                target.style.top = t + "px";
              }
            }

            document.onmouseup = function () {
              this.scaleposX = (this.posX * this.scale) / 100;
              this.scaleposY = (this.posY * this.scale) / 100;
              document.onmousemove = null;
              that.params.flag = false;
              if (that.getCss(target, "left") !== "auto") {
                that.params.left = that.getCss(target, "left");
              }
              if (that.getCss(target, "top") !== "auto") {
                that.params.top = that.getCss(target, "top");
              }
              that.params.width = that.getCss(target, "width");
              that.params.height = that.getCss(target, "height");
              /*console.log('params.width=', params.width);
              console.log('params.height', params.width);*/
              that.posX = parseInt(target.style.left);
              that.posY = parseInt(target.style.top);
              //给隐藏文本框赋值
              that.cropboxwid = parseInt(target.style.width);
              that.cropboxhei = parseInt(target.style.height);
              if (that.posX < 0) {
                that.posX = 0;
              }
              if (that.posY < 0) {
                that.posY = 0;
              }
              if (that.posX + that.cropboxwid > that.oriWid) {
                that.cropboxwid = that.oriWid - that.posX;
              }
              if (that.posY + that.cropboxhei > that.oriHei) {
                that.cropboxhei = that.oriHei - posY;
              }
              //赋值
              that.ID("cropPosX").value = that.posX;
              that.ID("cropPosY").value = that.posY;
              that.ID("cropImageWidth").value = parseInt(
                that.ID("zxxCropBox").style.width
              );
              that.ID("cropImageHeight").value = parseInt(
                that.ID("zxxCropBox").style.height
              );

              /*console.log('posX=',posX);
              console.log('posY=',posY);*/
            };
          };
        };
      };
      startDrag(this.ID("zxxDragBg"), this.ID("zxxCropBox"), "drag");
      //绑定拉伸this.
      startDrag(this.ID("dragLeftTop"), this.ID("zxxCropBox"), "nw");
      startDrag(this.ID("dragLeftBot"), this.ID("zxxCropBox"), "sw");
      startDrag(this.ID("dragRightTop"), this.ID("zxxCropBox"), "ne");
      startDrag(this.ID("dragRightBot"), this.ID("zxxCropBox"), "se");
      startDrag(this.ID("dragTopCenter"), this.ID("zxxCropBox"), "n");
      startDrag(this.ID("dragBotCenter"), this.ID("zxxCropBox"), "s");
      startDrag(this.ID("dragRightCenter"), this.ID("zxxCropBox"), "e");
      startDrag(this.ID("dragLeftCenter"), this.ID("zxxCropBox"), "w");
      this.ID("myCanvas").onselectstart = function () {
        return false;
      };
      img.onselectstart = function () {
        return false;
      };
    },
    confirmCut() {
      newCanvas = document.createElement("canvas");
      newCanvas.setAttribute("id", "newCanvas");
      newCanvas.width = this.cropboxwid;
      newCanvas.height = this.cropboxhei;
      newCanvas.style.border = "1px solid #d3d3d3";
      const newCtx = newCanvas.getContext("2d");
      $("#newCanvas").remove();
      const clipImgDiv = document.getElementById("clipImgDiv");
      clipImgDiv.appendChild(newCanvas);
      newCtx.drawImage(
        myCanvas,
        this.posX,
        this.posY,
        this.cropboxwid,
        this.cropboxhei,
        0,
        0,
        this.cropboxwid,
        this.cropboxhei
      );
    },
    cancelCutBox() {
      this.cropboxwid = 80;
      this.cropboxhei = 80;
      this.posX = 0;
      this.posY = 0;
      $("#cropContainer").remove();
    },
    save() {
      const newImage = new Image();
      if (newImage.src) newImage.src = null;
      const choice = prompt("输入格式质量");
      const format = choice.split(",")[0];
      const quyal = parseInt(choice.split(",")[1]);
      if (format === "jpeg") {
        newImage.src = newCanvas.toDataURL("image/jpeg", qual);
      } else if (format === "png") {
        newImage.src = newCanvas.toDataURL("image/png", qual);
      } else if (format === "webp") {
        newImage.src = newCanvas.toDataURL("image/webp", qual);
      }
      const alink = document.createElement("a");
      alink.href = newImage.src;
      alink.download = "test." + format;
      alink.click();
    },
    keyMove(event) {
      const e = event || window.event;
      const keytop = this.getCss(this.ID("zxxCropBox"), "top");
      const keyleft = this.getCss(this.ID("zxxCropBox"), "left");
      let keyX;
      let keyY;
      if (e.keyCode === 38) {
        $("#zxxCropBox").css("top", parseInt(keytop) - 1);
        keyX = parseInt(this.ID("zxxCropBox").style.left);
        keyY = parseInt(this.ID("zxxCropBox").style.top);
        if (keyY < 0) {
          keyY = 0;
          $("#zxxCropBox").css("top", 0);
        }
        this.posX = keyX;
        this.posY = keyY;
      } else if (e.keyCode === 37) {
        $("#zxxCropBox").css("left", parseInt(keyleft) - 1);
        keyX = parseInt(this.ID("zxxCropBox").style.left);
        keyY = parseInt(this.ID("zxxCropBox").style.top);
        if (keyX < 0) {
          keyX = 0;
          $("#zxxCropBox").css("left", 0);
        }
        this.posX = keyX;
        this.posY = keyY;
      } else if (e.keyCode === 40) {
        $("#zxxCropBox").css("top", parseInt(keytop) + 1);
        keyX = parseInt(this.ID("zxxCropBox").style.left);
        keyY = parseInt(this.ID("zxxCropBox").style.top);
        if (
          keyY >
          myCanvas.height -
            parseInt(this.getCss(this.ID("zxxCropBox"), "height"))
        ) {
          keyY =
            myCanvas.height -
            parseInt(this.getCss(this.ID("zxxCropBox"), "height"));
          $("#zxxCropBox").css(
            "top",
            myCanvas.height -
              parseInt(this.getCss(this.ID("zxxCropBox"), "height"))
          );
        }
        this.posX = keyX;
        this.posY = keyY;
      } else if (e.keyCode === 39) {
        $("#zxxCropBox").css("left", parseInt(keyleft) + 1);
        keyX = parseInt(this.ID("zxxCropBox").style.left);
        keyY = parseInt(this.ID("zxxCropBox").style.top);
        if (
          keyX <
          myCanvas.width - parseInt(this.getCss(this.ID("zxxCropBox"), "width"))
        ) {
          keyX =
            myCanvas.width -
            parseInt(this.getCss(this.ID("zxxCropBox"), "width"));
          $("#zxxCropBox").css("left", 0);
        }
        this.posX = keyX;
        this.posY = keyY;
      } else if (e.keycode === 13) {
        this.confirmCut();
      }
      this.ID("cropPosX").value = keyX;
      this.ID("cropPosY").value = keyY;
    },
    ID(id) {
      return document.getElementById(id);
    },
    getCss(o, key) {
      return o.currentStyle
        ? o.currentStyle[key]
        : document.defaultView.getComputedStyle(o, false)[key];
    },
    add() {
      if (this.scale < 150) this.scale++;
    },
    sub() {
      if (this.scale > 50) this.scale--;
    },
  },
  watch: {
    scale(newValue) {
      multiple = newValue / 100;
      this.scalewidth = this.oriWid * multiple;
      this.scaleheight = this.oriWid * multiple;
      if ($("#zxxCropBox").length > 0) this.loadCutBox();
      $("imgDiv").css({ width: this.scalewidth, height: this.scaleheight });
      myCanvas.width = this.scalewidth;
      myCanvas.height = this.scaleheight;
      ctx.drawImage(img, 0, 0, this, scalewidth, this.scaleheight);
    },
  },
  created() {
    document.onkeydown = (e) => {
      this.keyMove(e);
    };
  },
  mouted() {
    this.oriWid = 960;
    THIS.oriHei = 600;
    this.initCanvas();
  },
};
</script>

<style scoped lang="scss">
.panel {
  transform: translate(-100%);
  transition: ease-in-out 1s;
  display: block;
  font-family: "Microsoft YaHei";
  position: absolute;
  width: 100%;
  top: 0;
  left: 0;
  height: 100%;
  &.active {
    transform: translate(0);
  }
  .control {
    position: fixed;
    width: 300px;
    height: 1000px;
    background: #2b4064;
    display: flex;
    flex-direction: column;
    align-items: center;

    .title {
      background: #2c3049;
      color: #fff;
      height: 60px;
      width: 100%;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .save {
      display: flex;
      height: 300px;
      width: 100%;
      justify-content: center;
      align-items: center;
      flex-direction: column;

      .preview {
        min-height: 200px;
        width: 80%;
        padding: 10px;
        overflow: hidden;

        #newCanvas {
          width: 270px imp !important;
        }
      }

      button {
        margin-top: 10px;
        background: #f78755;
        cursor: pointer;
        width: 180px;
        height: 40px;
        border: none;
        color: #fff;
      }
    }
    .turn {
      margin-top: 10px;
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;

      span {
        display: flex;
        align-items: center;
        padding-left: 5px;
        height: 30px;
        width: 260px;
        color: rgb(206, 206, 206);
      }

      ul {
        margin-top: 0;
        height: 60px;
        background: #2c4a75;
        list-style: none;
        margin-left: -20px;
        display: flex;
        width: 280px;
        align-items: center;
        justify-content: space-around;

        li {
          cursor: pointer;
          width: 35px;
          height: 35px;
          color: #fff;
          display: flex;
          justify-content: center;
          align-items: center;
          i {
            font-size: 20px;
          }
        }
      }
    }
    .cut {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;

      .cut-title {
        display: flex;
        padding-left: 50px;
        height: 30px;
        width: 260px;
        color: rgb(206, 206, 206);
      }
      .label {
        padding-top: 20px;
        display: flex;
        justify-content: space-around;
        width: 100%;
        background: #2c4a75;
        color: rgb(206, 206, 206);
      }
      .input {
        padding-top: 20px;
        margin-top: 0;
        background: #2c4a75;
        color: rgb(206, 206, 206);
        width: 100%;
        display: flex;
        justify-content: space-around;

        input {
          width: 50px;
          background: #2b4064;
          outline: none;
          color: #fff;
          border: none;
        }
      }
      .but {
        padding-top: 20px;
        background: #2c4a75;
        width: 100%;
        padding-bottom: 10px;
        display: flex;
        justify-content: flex-end;

        button {
          background: none;
          border: none;
          color: #fff;
          cursor: pointer;
          width: 50px;
          margin-right: 10px;
          &:hover {
            color: #f78755;
          }
          &:focus {
            outline: none;
          }
        }
      }
    }
    .filter {
      margin-top: 10px;
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      .label {
        display: flex;
        padding-left: 50px;
        height: 30px;
        width: 260px;
        color: rgb(206, 206, 206);
      }
      ul {
        margin-top: 0;
        background: #2c4a75;
        list-style: none;
        margin-left: -20px;
        display: flex;
        flex-wrap: wrap;
        width: 280px;
        align-content: center;
        justify-content: space-around;
        li {
          padding-top: 20px;
          padding-bottom: 20px;
          cursor: pointer;
          width: 45px;
          height: 45px;
          color: #fff;
          display: flex;
          justify-content: space-around;
          align-items: center;
          button {
            width: 45px;
            height: 45px;
            color: #fff;
            background: #f78755;
            border: none;
            outline: none;
            cursor: pointer;
            &:hover {
              background: #fd9666;
            }
          }
        }
      }
    }
    .undohistory {
      margin-top: 10px;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-around;
      background: #2c4a75;
      padding-top: 10px;
      padding-bottom: 10px;

      button {
        width: 45px;
        height: 45px;
        color: #fff;
        background: #f78755;
        border: none;
        outline: none;
        cursor: pointer;
        &:hover {
          background: #fd9666;
        }
      }
    }
  }
  .editarea {
    width: calc(100% -300px);
    height: 100%;
    margin-left: 300px;
    background: rgba(0, 3, 17, 0.562);
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 0;
    left: 0;

    .close {
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 40px;
      height: 40px;
      position: absolute;
      top: 30px;
      right: 30px;
      color: #fff;
      z-index: 99;
      i {
        font-size: 35px;
      }
    }
    .scale {
      width: 300px;
      height: 80px;
      position: absolute;
      bottom: 0;
      right: 50px;
      background: #fff;
      border-radius: 5px 5px 0 0;
      display: flex;
      flex-direction: column;
      .scale-title {
        padding-left: 5px;
        padding-right: 5px;
        align-items: center;
        border-radius: 5px 5px 0 0;
        width: 96.5%;
        height: 25px;
        background: #ededed;
        color: rgb(102, 102, 102);
        display: flex;
        justify-content: space-between;
        font-size: 12px;
      }
      .change {
        height: 100%;
        display: flex;
        align-items: center;
        color: rgb(102, 102, 102);
        justify-content: space-around;
        .percent {
          width: 50px;
        }
        a {
          cursor: pointer;
          text-decoration: none;
          user-select: none;
        }
      }
    }
  }
}
</style>