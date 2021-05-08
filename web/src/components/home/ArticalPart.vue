<template>
  <div class="articalpart">
    <div class="themebox">
      <img src="" alt="" />
      <div class="content">
        <div class="title">日系小清新</div>
        <div class="des">系小清新日系小小清新</div>
        <div class="control">
          <ul>
            <li><i class="iconfont icon-touxiang"></i>摄影师:小明</li>
            <li><i class="iconfont icon-time"></i>发布时间:2021-3-12</li>
            <li>
              <i class="iconfont icon-tag"></i>标签:<span>单人小清新</span>
            </li>
            <li><i class="iconfont icon-eye"></i>123</li>
          </ul>
        </div>
      </div>
    </div>
    <div class="themebox">
      <img src="" alt="" />
      <div class="content">
        <div class="title">日系小清新</div>
        <div class="des">系小清新日系小小清新</div>
        <div class="control">
          <ul>
            <li><i class="iconfont icon-touxiang"></i>摄影师:小明</li>
            <li><i class="iconfont icon-time"></i>发布时间:2021-3-12</li>
            <li>
              <i class="iconfont icon-tag"></i>标签:<span>单人小清新</span>
            </li>
            <li><i class="iconfont icon-eye"></i>123</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss">
.articalpart {
  position: relative;
  left: 50%;
  transform: translate(-50%, 0);
  width: 60%;
  min-height: 800px;
  min-width: 400px;
  display: flex;
  flex-direction: column;
  .themebox {
    margin-top: 20px;
    width: 960px;
    height: 220px;
    box-shadow: 0 0 0 1px #d4d4d5, 0 2px 4px 0 rgba(34, 36, 38, 0.12),
      0 2px 10px 0 rgba(34, 36, 38, 0.15);
    background: #fff;
    font-family: Lato, "Helvetica Neue", Arial, Helvetica, sans-serif;
    display: flex;
    align-items: center;
    border-radius: 5px;
    cursor: pointer;
    &:hover {
      transform: translateY(-3px);
      transition: all 0.1s ease;
      box-shadow: 0 0 0 1px #d4d4d5, 0 2px 4px 0 rgba(34, 36, 38, 0.15),
        0 2px 10px 0 rgba(34, 36, 38, 0.25);
    }
    img {
      width: 270px;
      height: 190px;
      margin-left: 15px;
      border-radius: 5px;
    }
    .content {
      flex: 1;
      display: flex;
      flex-direction: column;
      margin-left: 30px;
      height: 100%;
      .title {
        margin-top: 20px;
        height: 20px;
        width: 100%;
        font-size: 20px;
        font-weight: 500;
        &:hover {
          color: #00b5ad;
        }
      }
      .des {
        margin-top: 20px;
        width: 100%;
        padding-right: 30px;
        color: #4c4f52;
        height: 120px;
      }
      .control {
        margin-top: 5px;
        height: 30px;
        ul {
          list-style: none;
          display: flex;
          align-items: center;
          li {
            margin-right: 20px;
            color: #999999;
            font-size: 14px;
            span {
              margin-left: 5px;
              border: 1px rgb(1, 196, 98) solid;
              padding: 2px;
              border-radius: 3px;
            }
          }
        }
      }
    }
  }
}
</style>