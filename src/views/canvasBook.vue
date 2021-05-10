<template>
  <div class="wrapper">
    <div class="left-box" v-if="page === 0" :style="{transform: 'translate3d(' + leftBox + 'px, 0, 0)'}"></div>
    <canvas class="canvas" width="360" height="640" v-for="(item, index) in pages" :ref="setCanvasItemRef"
            :style="{zIndex: (pagesLeft[index] === -scrollDistance ? 0-index : 999-index), transform: 'translate3d(' + (pagesLeft[index]||0) + 'px, 0, 0)'}"></canvas>
    <canvas id="canvas" width="360" height="640" v-show="false"></canvas>
  </div>
</template>

<script>

import Tween from "@/assets/js/tween";

export default {
  name: "canvasBook",
  data() {
    return {
      pages: [],
      pagesLeft: [],
      loadPagesLeft: [],
      canvasElArr: [],
      page: 0,
      total: 0,
      leftBox: 0
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initBookContainer();
    })
    this.init();

    window.onresize = () => {
      this.initBookContainer();
    }
    var result = this.breakLinesForCanvas(
        '使用很寻常的二分查找，如果某一个位置之前的文字宽度小于等于设定的宽度，并且它之后一个字之前的文字宽度大于设定的宽度，那么这个位置就是文本的换行点。上面只是找到一个换行点，对于输入的一段文本，需要循环查找，直到不存在这样的换行点为止, 完整的代码如下使用很寻常的二分查找，如果某一个位置之前的文字宽度小于等于设定的宽度，并且它之后一个字之前的文字宽度大于设定的宽度，那么这个位置就是文本的换行点。上面只是找到一个换行点，对于输入的一段文本，需要循环查找，直到不存在这样的换行点为止, 完整的代码如下使用很寻常的二分查找，如果某一个位置之前的文字宽度小于等于设定的宽度，并且它之后一个字之前的文字宽度大于设定的宽度，那么这个位置就是文本的换行点。上面只是找到一个换行点，对于输入的一段文本，需要循环查找，直到不存在这样的换行点为止, 完整的代码如下使用很寻常的二分查找，如果某一个位置之前的文字宽度小于等于设定的宽度，并且它之后一个字之前的文字宽度大于设定的宽度，那么这个位置就是文本的换行点。上面只是找到一个换行点，对于输入的一段文本，需要循环查找，直到不存在这样的换行点为止, 完整的代码如下使用很寻常的二分查找，如果某一个位置之前的文字宽度小于等于设定的宽度，并且它之后一个字之前的文字宽度大于设定的宽度，那么这个位置就是文本的换行点。上面只是找到一个换行点，对于输入的一段文本，需要循环查找，直到不存在这样的换行点为止, 完整的代码如下使用很寻常的二分查找，如果某一个位置之前的文字宽度小于等于设定的宽度，并且它之后一个字之前的文字宽度大于设定的宽度，那么这个位置就是文本的换行点。上面只是找到一个换行点，对于输入的一段文本，需要循环查找，直到不存在这样的换行点为止, 完整的代码如下使用很寻常的二分查找，如果某一个位置之前的文字宽度小于等于设定的宽度，并且它之后一个字之前的文字宽度大于设定的宽度，那么这个位置就是文本的换行点。上面只是找到一个换行点，对于输入的一段文本，需要循环查找，直到不存在这样的换行点为止, 完整的代码如下使用很寻常的二分查找，如果某一个位置之前的文字宽度小于等于设定的宽度，并且它之后一个字之前的文字宽度大于设定的宽度，那么这个位置就是文本的换行点。上面只是找到一个换行点，对于输入的一段文本，需要循环查找，直到不存在这样的换行点为止, 完整的代码如下使用很寻常的二分查找，如果某一个位置之前的文字宽度小于等于设定的宽度，并且它之后一个字之前的文字宽度大于设定的宽度，那么这个位置就是文本的换行点。上面只是找到一个换行点，对于输入的一段文本，需要循环查找，直到不存在这样的换行点为止, 完整的代码如下使用很寻常的二分查找，如果某一个位置之前的文字宽度小于等于设定的宽度，并且它之后一个字之前的文字宽度大于设定的宽度，那么这个位置就是文本的换行点。上面只是找到一个换行点，对于输入的一段文本，需要循环查找，直到不存在这样的换行点为止, 完整的代码如下使用很寻常的二分查找，如果某一个位置之前的文字宽度小于等于设定的宽度，并且它之后一个字之前的文字宽度大于设定的宽度，那么这个位置就是文本的换行点。上面只是找到一个换行点，对于输入的一段文本，需要循环查找，直到不存在这样的换行点为止, 完整的代码如下',
        360, '16px 微软雅黑');
    console.log(result);

    var lineHeight = 30;
    // var context = document.getElementById('canvas').getContext('2d');
    // context.font = "16px 微软雅黑";

    // result.forEach(function (line, index) {
    //   context.fillText(line, 0, lineHeight * index + 30);
    // });
    var bookArr = []
    var maxColumn = Math.ceil(640 / 30)
    result.forEach((item, index) => {
      var bookArrIndex = Math.floor(index / maxColumn);
      if (!bookArr[bookArrIndex]) {
        bookArr[bookArrIndex] = [];
      }
      bookArr[bookArrIndex].push(item)
    })
    this.pages = bookArr;
    this.total = this.pages.length
    this.$nextTick(() => {
      console.log(this.canvasElArr)
      this.canvasElArr.forEach((canvas, index) => {
        var context = canvas.getContext('2d');
        context.font = "16px 微软雅黑";
        this.pages[index].forEach((line, pIndex) => {
          context.fillText(line, 0, lineHeight * pIndex + 30);
        })
      });
    })
  },
  methods: {
    setCanvasItemRef(el) {
      this.canvasElArr.push(el)
    },
    //寻找切换断点
    findBreakPoint(text, width, context) {
      var min = 0;
      var max = text.length - 1;

      while (min <= max) {
        var middle = Math.floor((min + max) / 2);
        var middleWidth = context.measureText(text.substr(0, middle)).width;
        var oneCharWiderThanMiddleWidth = context.measureText(text.substr(0, middle + 1)).width;
        if (middleWidth <= width && oneCharWiderThanMiddleWidth > width) {
          return middle;
        }
        if (middleWidth < width) {
          min = middle + 1;
        } else {
          max = middle - 1;
        }
      }

      return -1;
    },
    breakLinesForCanvas(text, width, font) {
      var canvas = document.getElementById('canvas');
      var context = canvas.getContext('2d');
      var result = [];
      var breakPoint = 0;

      if (font) {
        context.font = font;
      }

      while ((breakPoint = this.findBreakPoint(text, width, context)) !== -1) {
        result.push(text.substr(0, breakPoint));
        text = text.substr(breakPoint);
      }

      if (text) {
        result.push(text);
      }

      return result;
    },
    // 初始化
    init() {
      this.bindTouchEvents();
    },
    // 获取书籍宽度 页宽度
    initBookContainer() {
      this.left = 0;
      this.scrollDistance = document.body.clientWidth || document.documentElement.clientWidth;
      this.leftBox = -this.scrollDistance;
      console.log(this.leftBox)
    },
    // 绑定手势
    bindTouchEvents() {
      this.$el.addEventListener("touchstart", this.touchStart);
      this.$el.addEventListener("touchmove", this.touchMove);
      this.$el.addEventListener("touchend", this.touchEnd);
    },
    // 开始点击
    touchStart(e) {
      console.log(e)
      this.touchX = e.touches[0].clientX;
      this.currentX = this.touchX
    },
    // 点击移动
    touchMove(e) {
      console.log(e)
      var diff = e.touches[0].clientX - this.currentX;
      var moveOffset = ((diff > 0) ? Math.pow(diff, 0.8) : (-Math.pow(Math.abs(diff), 0.8)))
      if (this.currentX < this.touchX) {
        this.pagesLeft[this.page] = (this.pagesLeft[this.page] || 0) + moveOffset;
      } else if (this.page === 0) {
        // this.pagesLeft[this.page] = (this.pagesLeft[this.page] || 0) + moveOffset;
        // this.leftBox = this.leftBox + moveOffset
      } else {
        console.log('当前页', this.page, this.pagesLeft)
        this.pagesLeft[this.page - 1] = (this.pagesLeft[this.page - 1] || 0) + moveOffset;
      }
      this.currentX = e.touches[0].clientX;
      this.distance = this.currentX - this.touchX
    },
    // 点击完成
    touchEnd() {
      // this.loadPagesLeft[this.page] = this.pagesLeft[this.page];
      // console.log(this.left, this.loadPagesLeft)
      if (this.distance !== 0) {
        this.correctPosition();
      }
    },
    // 纠正到正确的位置
    correctPosition() {
      console.log(this.page, this.total)
      // if (this.page <= -1) {
      //   this.page = 0;
      //   this.distance = -1;
      // } else if (this.total < this.page) {
      //   this.page = this.total;
      //   this.distance = 1;
      // }
      var correctPosition = this.scrollDistance;
      console.log(this.distance)
      // var offset = (this.distance < 0) ? -15 : 15;
      setTimeout(() => {
        var timer = null;
        var that = this;
        cancelAnimationFrame(timer);
        var oLeft
        timer = requestAnimationFrame(function fn() {
          console.log('当前页', that.page, that.pagesLeft)
          if (that.distance < 0) {
            oLeft = that.pagesLeft[that.page];
            if (oLeft > -that.scrollDistance) {
              that.pagesLeft[that.page] = Math.ceil(Tween.Quart.easeInOut(10, oLeft, -10, 10));
              timer = requestAnimationFrame(fn);
            } else {
              cancelAnimationFrame(timer);
              that.pagesLeft[that.page] = -that.scrollDistance;
              that.page++;
              // that.loadLeft = that.left;
            }
          } else if (that.distance > 0) {
            oLeft = that.pagesLeft[that.page-1];
            console.log(oLeft)
            if (oLeft < 0) {
              that.pagesLeft[that.page-1] = Math.ceil(Tween.Quart.easeInOut(10, oLeft, 10, 10));
              console.log(that.pagesLeft)
              timer = requestAnimationFrame(fn);
            } else {
              cancelAnimationFrame(timer);
              that.pagesLeft[that.page-1] = 0;
              that.page--;
            }
          }
          // var oLeft = that.left;
          // if (((that.left > correctPosition) && (that.distance < 0)) || ((that.left < correctPosition) && (that.distance > 0))) {
          //   that.isCorrect = true
          //   that.left = Math.ceil(Tween.Quart.easeInOut(10, oLeft, offset, 10));
          //   timer = requestAnimationFrame(fn);
          // } else {
          //   cancelAnimationFrame(timer);
          //   that.isCorrect = false
          //   that.left = correctPosition;
          //   that.loadLeft = that.left;
          // }
        });
      });
    }
  }
}
</script>

<style scoped lang="scss">
.wrapper {
  width: 100%;
  height: 100%;
}

.left-box {
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: #fff;
  z-index: 1000
}

.canvas {
  position: absolute;
  left: 0;
  top: 0;
  background-color: #fff;
  box-shadow: 0 0 20px 0 #000;
}
</style>