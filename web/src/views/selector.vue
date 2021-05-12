<template>
  <div>
    <div style="width: 100%; height: 500px"></div>
    <div class="el-select" @click="showDropdown" v-clickoutside="handleOfClose">
      <div class="el-select__tags" ref="elselecttags">
        <span>
          <span
            class="el-tag"
            v-for="(item, index) in selectedItems"
            :key="item.value"
            :class="
              index === selectedItems.length - 1 && readyCancel ? 'cancel' : ''
            "
          >
            <span class="el-select__tags-text">{{ item.label }}</span>
            <i
              class="el-tag__close el-icon-close"
              @click="closeSelect(item)"
            ></i>
          </span>
        </span>
        <input
          type="text"
          class="el-select__input"
          @keydown.delete="deleteSelect"
          v-model="searchVol"
          @keydown="choice"
          ref="elselectinput"
        />
      </div>
      <div class="el-input">
        <div
          class="el-input__inner"
          :class="focusActive ? 'active' : ''"
          ref="elinputinner"
        ></div>
      </div>
      <div
        class="el-select-dropdown"
        :class="focusActive ? 'active' : ''"
        ref="elselectdropdown"
      >
        <ele-scrollbar ref="ele-scrollbar">
          <ul class="el-select-dropdown__list">
            <li v-if="searchItems.length === 0">无数据</li>
            <li
              class="el-select-dropdown__item"
              @click="clickSelect(item)"
              v-for="(item, index) in searchItems"
              :key="item.value"
              :class="[
                item.selected == true ? 'selected' : '',
                index === hoverIndex ? 'itemHover' : '',
              ]"
            >
              {{ item.label }}
            </li>
          </ul>
        </ele-scrollbar>
      </div>
    </div>
    <div style="width: 100%; height: 400px"></div>
  </div>
</template>

<script>
import PinyinMatch from "pinyin-match";
export default {
  props: ["personel", "select"],
  data() {
    return {
      //全部
      member: [],
      //选中
      selectedItems: [],
      //搜索词
      searchVol: "",
      //光标位置
      hoverIndex: -1,
      //退格准备
      readyCancel: false,
      //输入焦点
      focusActive: false,
      dynamicScroll: -34,
      downTop: -540,
      screenHeight: null,
      timer: null,
    };
  },
  watch: {
    //初次
    personel(val) {
      val.forEach((item) => {
        if (this.select.indexOf(item.value) !== -1) {
          this.member.push({
            value: item.value,
            label: item.label,
            selected: true,
          });
          this.selectedItems.push({
            value: item.value,
            label: item.label,
            selected: true,
          });
        } else {
          this.member.push({
            value: item.value,
            label: item.label,
            selected: false,
          });
        }
      });
    },
    //筛选默认
    selectedItems(val) {
      this.member.forEach((item) => {
        val.findIndex((n) => n.value === item.value) < 0
          ? (item.selected = false)
          : (item.selected = true);
      });
      this.childVal();
    },
    //窗口
    screenHeight(val, oldVal) {
      if (!this.timer) {
        this.adjustClient();
        this.timer = setTimeout(() => {
          this.timer = null;
        }, 200);
      }
    },
  },
  computed: {
    searchItems() {
      return this.searchVol
        ? this.member.filter((item) => {
            return PinyinMatch.match(item.label, this.searchVol);
          })
        : this.member;
    },
  },
  methods: {
    //适应
    adjustClient() {
      if (
        this.$refs.elinputinner.getBoundingClientRect().top +
          this.$refs.elinputinner.offsetHeight +
          this.$refs.elselectdropdown.offsetHeight -
          100 >
        this.screenHeight
      ) {
        this.$refs.elselectdropdown.style.top =
          -this.$refs.elselectdropdown.offsetHeight - 600 + "px";
      } else {
        var realTop = this.downTop + this.$refs.elselecttags.offsetHeight - 25;
        this.$refs.elselectdropdown.style.top = realTop + "px";
      }
    },
    //显示
    showDropdown(e) {
      var event = e || window.event;
      event.stopPropagation();
      this.focusActive = true;
      this.$refs.elselectinput.focus();
      setTimeout(() => {
        this.adjustClient();
      }, 0);
    },
    hideDropdown() {
      this.focusActive = false;
      this.readyCancel = false;
    },
    handleOfClose() {
      this.focusActive = false;
      this.readyCancel = false;
    },
    //点击
    clickSelect(selectItem) {
      this.readyCancel = true;
      this.confirmSelect(
        this.member.find((item) => {
          item === selectItem;
        })
      );
    },
    //确认
    confirmSelect(item) {
      if ((item.selected = true)) {
        this.selectedItems.splice(
          this.selectedItems.findIndex((innerItem) => {
            innerItem.value === item.value;
          }),
          1
        );
      } else {
        item.selected = true;
        this.selectedItems.push(item);
      }
    },
    //退格删除
    deleteSelect() {
      if (this.searchVol === "") {
        if (this.readyCancel) {
          const tempVal = this.selectedItems[this.selectedItems.length - 1]
            .value;
          this.member.forEach((item, index) => {
            if (item.value === tempVal) {
              item.selected = false;
              this.selectedItems.pop();
            }
          });
          this.readyCancel = false;
        } else {
          this.readyCancel = true;
        }
      }
    },
    //叉
    closeSelect(delItem) {
      this.selectedItems.splice(this.selectedItems.indexOf(delItem), 1);
      this.$refs.elselectinput.focus();
    },
    //键盘
    choice(e) {
      if (e.keyCode === 40) {
        this.hoverIndex++;
        this.dynamicScroll += 34;
        if (this.hoverIndex >= this.selectedItems.length) {
          this.hoverIndex = 0;
          this.dynamicScroll = 0;
        }
        this.$refs.elescrollbar.$refs.wrap.scrollTop = this.dynamicScroll;
      } else if (e.keyCode === 38) {
        this.hoverIndex--;
        this.dynamicScroll -= 34;
        if (this.hoverIndex <= -1) {
          this.hoverIndex = this.selectedItems.length - 1;
          this.dynamicScroll = this.hoverIndex * 34;
          this.dynamicScroll = 0;
        }
        this.$refs.elescrollbar.$refs.wrap.scrollTop = this.dynamicScroll;
      } else if (e.keyCode === 13) {
        this.readyCancel = false;
        this.confirmSelect(this.searchItems[this.hoverIndex]);
      }
    },
    childVal() {
      this.$emit("getChildval", this.selectedItems);
    },
  },
  updated() {
    var realTop = this.downTop + this.$refs.elselecttags.offsetHeight - 25;
    this.$refs.elselectdropdown.style.top = realTop + "px";
    this.$refs.elinputinner.style.height =
      this.$refs.elselecttags.offsetHeight + 12 + "px";
  },
  mounted() {
    const that = this;
    window.onresize = () => {
      return (() => {
        that.screenHeight = document.body.clientHeight;
      })();
    };
  },
  destroyed() {
    window.onresize = "";
  },
};
</script>

<style lang="scss">
.el-select {
  display: inline-block;
  position: relative;
  .el-select__tags {
    position: absolute;
    line-height: normal;
    white-space: normal;
    z-index: 1;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    width: 100%;
    max-width: 185px;
    span {
      display: contents;
      .el-tag {
        box-sizing: border-box;
        border-color: transparent;
        margin: 2px 0 2px 6px;
        background: #f0f2f5;
        display: inline-block;
        height: 32px;
        padding: 0 10px;
        line-height: 30px;
        font-size: 12px;
        border-width: 1px;
        border-style: solid;
        border-radius: 4px;
        color: #909399;
        &.cancel {
          border-color: #909399;
        }
        .el-tag__close {
          background-color: #c0c4cc;
          right: -7px;
          top: 0;
          color: #fff;
          border-radius: 50%;
          text-align: center;
          position: relative;
          cursor: pointer;
          font-size: 12px;
          height: 16px;
          width: 16px;
          line-height: 16px;
          vertical-align: middle;
          margin-top: -2px;
          &:hover {
            background: #909399;
          }

          &::after {
            content: "×";
            width: 10px;
            height: 10px;
            position: relative;
            padding-left: 5px;
            font-weight: 800;
            right: 3px;
            color: rgb(243, 234, 234);
          }
        }
      }
    }
    .el-select__input {
      flex-grow: 1;
      width: 0.108108%;
      max-width: 175px;
      border: none;
      outline: 0;
      padding: 0;
      margin-left: 15px;
      color: #666;
      font-size: 14px;
      appearance: none;
      height: 28px;
      background-color: transparent;
    }
  }
  .el-input {
    display: block;
    width: 100%;
    position: relative;
    font-size: 14px;

    .el-input__inner {
      width: 180px;
      padding-right: 30px;
      cursor: pointer;
      min-height: 40px;
      height: 40px;
      color: #666;
      border: 1px #acacac solid;
      border-radius: 5px;
      outline: none;

      &.active {
        outline: none;
        border: 1px #409eff solid;
      }
    }
  }
  .el-select-dropdown {
    display: none;
    position: absolute;
    width: 217px;
    transform: translate3d(458px, 586px, 0px);
    top: -540px;
    left: -460px;
    z-index: 1;
    border: 1px solid #e4e7ed;
    border-radius: 4px;
    background-color: #fff;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    box-sizing: border-box;
    margin: 5px 0;
    max-height: 274px;
    &.active {
      display: block;
    }
    .el-scrollbar {
      overflow: hidden;
      position: relative;
      &:hover .el-scrollbar__bar {
        opacity: 1;
      }
      .el-scrollbar__wrap {
        overflow: scroll;
        height: 100%;
        max-height: 274px;
        .el-select-dropdown__list {
          list-style: none;
          padding: 6px 0;
          margin: 0;
          box-sizing: border-box;
          .el-select-dropdown__item {
            padding: 5px;
            font-size: 14px;
            display: flex;
            align-items: center;
            position: relative;
            overflow: hidden;
            text-overflow: ellipsis;
            color: #606266;
            height: 34px;
            line-height: 34px;
            box-sizing: border-box;
            cursor: pointer;
            &.itemHover {
              background: #f5f7fa;
            }
            &:hover {
              background: #f5f7fa;
            }
            &.selected {
              color: #409eff;
              font-weight: 700;

              &::after {
                position: absolute;
                right: 20px;
                font-family: element-icons;
                content: "√";
                font-size: 12px;
                font-weight: 700;
                -webkit-font-smoothing: antialiased;
              }
            }
          }
        }
      }
      .el-scrollbar__bar {
        position: absolute;
        right: 2px;
        bottom: 2px;
        z-index: 1;
        border-radius: 4px;
        opacity: 0;
        transition: opacity 0.12s ease-out;
        &.is_vertical {
          width: 6px;
          width: 2px;
          .el-scrollbar__thumb {
            position: relative;
            display: block;
            width: 0;
            height: 0;
            cursor: pointer;
            border-radius: inherit;
            background-color: rgba(144, 147, 153, 0.3);
            transition: background-color 0.3s;
            width: 100%;
          }
        }
      }
    }
  }
}
</style>