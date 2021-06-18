<template>
  <div class="slide-gallery-wrapper">
    <div class="slide-gallery-container" :class="{'slide-horizontal': (direction === 'horizontal')}"
         :style="{transform: 'translate('+left+'px, '+top+'px)'}" ref="containerRef">
      <div class="slide-img"></div>
      <div class="slide-img"></div>
      <div class="slide-img"></div>
      <div class="slide-img"></div>
      <div class="slide-img"></div>
      <div class="slide-img"></div>
    </div>
    <div class="slide-left" v-if="(direction === 'horizontal') && (left < 0)" @click="slideAction(-1)">{{ '\<' }}</div>
    <div class="slide-right" v-if="(direction === 'horizontal') && (slideIndex < maxSlideIndex)" @click="slideAction(1)">{{ '\>' }}</div>
  </div>
</template>

<script>
export default {
  name: "slideGallery",
  data() {
    return {
      galleryRect: null,
      slideIndex: 0, // 滑动下标
      maxSlideIndex: 5, // 最大滑动下标
      startY: 0, // 开始拖拽的位置
      offsetY: 0, // 偏移量
      moveWheel1: true,
      moveWheel2: false,
      wheelTimer: null,
      wheelAnimationReq: null,
      mouseDrag: false, //鼠标拖拽状态
      // 垂直状态
      top: 0,
      // 水平状态
      left: 0,
      minLeft: 0, //最小左侧位移
      minTop: 0, // 最小顶部位移
    }
  },
  props: {
    direction: {
      type: String,
      default: 'vertical'
    }
  },
  mounted() {
    this.init();
    this.$nextTick(() => {
      if (this.$el) {
        this.galleryRect = this.$el.getBoundingClientRect();
      }
    });
  },
  methods: {
    slideAction(step) {
      this.slideIndex+=step;
      this.horizontalSlideAction();
    },
    horizontalSlideAction() {
      this.$refs.containerRef.style.transition = 'transform 1s';
      var minLeft = -(this.$refs.containerRef.scrollWidth - this.galleryRect.width);
      if(-this.slideIndex * (this.galleryRect.height+10) < minLeft) {
        this.maxSlideIndex = this.slideIndex;
        console.log(this.maxSlideIndex)
      }
      this.left = Math.min(0, Math.max(-this.slideIndex * (this.galleryRect.height+10), minLeft));
    },
    // 初始化
    init() {
      switch (this.direction) {
        case 'vertical':
          this.bindMouseAction();
          break;
        default:
          break;
      }

    },
    // 垂直绑定鼠标事件
    bindMouseAction() {
      this.$el.addEventListener('mousedown', this.mouseDownAction)
      this.$el.addEventListener('mouseup', this.mouseUpAction)
      var isFirefox = navigator.userAgent.indexOf("Firefox") > 0;
      var mousewheel = isFirefox ? "DOMMouseScroll" : "mousewheel";
      this.$el.addEventListener(mousewheel, this.mouseWheelAction, false)
    },
    mouseWheelAction(e) {
      e.preventDefault();
      e.stopPropagation();
      if ((this.slideIndex === 0 && e.wheelDeltaY > 0) || (this.slideIndex === 5 && e.wheelDeltaY < 0)) return;
      this.$refs.containerRef.style.transition = 'unset'
      if (this.moveWheel1) {
        console.log("滚动了");
        this.moveWheel1 = false;
        this.moveWheel2 = true;
        //这里写开始滚动时调用的方法
        this.wheelAnimation(e);
        this.wheelTimer = setTimeout(() => {
          this.stopWheel(e)
        }, 100);
      } else {
        clearTimeout(this.wheelTimer);
        this.wheelTimer = setTimeout(() => {
          this.stopWheel(e)
        }, 100);
      }
    },
    wheelAnimation(e) {
      if (e.wheelDeltaY > 0) {
        this.top += 10
        this.top = Math.min(-(this.slideIndex - 1) * this.galleryRect.width, this.top)
      } else if (e.wheelDeltaY < 0) {
        this.top -= 10
        if (this.slideIndex + 1 === 5) {
          this.top = Math.max(-((6 * this.galleryRect.width) - this.galleryRect.height), this.top)
        } else {
          this.top = Math.max(-(this.slideIndex + 1) * this.galleryRect.width, this.top)
        }
      }
      this.wheelAnimationReq = requestAnimationFrame(() => {
        this.wheelAnimation(e)
      })
    },
    stopWheel(e) {
      if (this.moveWheel2) {
        cancelAnimationFrame(this.wheelAnimationReq)
        console.log("滚轮停止了");
        this.moveWheel2 = false;
        this.moveWheel1 = true;
        //这里写停止时调用的方法
        console.log(e.wheelDeltaY)
        if (e.wheelDeltaY > 0) {
          this.slideIndex--;
        } else if (e.wheelDeltaY < 0) {
          this.slideIndex++;
        }
        this.endSlideAction();
      }
    },
    mouseDownAction(e) {
      this.mouseDrag = true;
      this.$refs.containerRef.style.transition = 'unset'
      console.log(e)
      this.offsetY = this.startY = (e.clientY - this.galleryRect.top);
      console.log(top)
      this.$el.addEventListener('mousemove', this.mouseMoveAction)
      // 鼠标移出响应元素松开事件
      document.addEventListener('mouseup', this.documentMouseUp)
    },
    // 全局documents事件
    documentMouseUp(e) {
      if (this.mouseDrag) {
        this.mouseUpAction(e)
        document.removeEventListener('mouseup', this.documentMouseUp)
      }
    },
    mouseUpAction(e) {
      e.preventDefault();
      e.stopPropagation();
      this.mouseDrag = false;
      var upTop = e.clientY - this.galleryRect.top;
      console.log(this.startY - upTop)
      var direction = upTop - this.startY;

      if (direction > 0) {
        this.slideIndex--;
      } else if (direction < 0) {
        this.slideIndex++;
      }
      this.slideIndex = Math.min(Math.max(0, this.slideIndex), this.maxSlideIndex)
      this.endSlideAction();
      this.$el.removeEventListener('mousemove', this.mouseMoveAction)
    },
    // 鼠标移动事件
    mouseMoveAction(e) {
      this.top += (e.clientY - this.offsetY);
      this.offsetY = e.clientY
    },
    endSlideAction() {
      this.$refs.containerRef.style.transition = 'transform 1s';
      var minTop = -(this.$refs.containerRef.scrollHeight - this.galleryRect.height);
      if(-this.slideIndex * this.galleryRect.width < minTop) {
        this.maxSlideIndex = this.slideIndex;
      }
      this.top = Math.min(0, Math.max(-this.slideIndex * this.galleryRect.width, minTop));
    }
  }
}
</script>

<style scoped lang="scss">

.slide-gallery-wrapper {
  position: relative;
  overflow: hidden;
  width: 640px;
  height: 760px;
  background-color: #ABABB8;

  .slide-img {
    width: 640px;
    height: 640px;
  }

  .slide-horizontal {
    display: flex;

    .slide-img {
      flex-shrink: 0;
    }
  }

  .slide-img:nth-child(1) {
    background-color: lightblue;
  }

  .slide-img:nth-child(2) {
    background-color: lightcoral;
  }

  .slide-img:nth-child(3) {
    background-color: lightcyan;
  }

  .slide-img:nth-child(4) {
    background-color: lightgoldenrodyellow;
  }

  .slide-img:nth-child(5) {
    background-color: lightgreen;
  }

  .slide-img:nth-child(6) {
    background-color: lightpink;
  }

  .slide-left, .slide-right {
    font-size: 30px;
    position: absolute;
    top: 0;
    width: 20px;
    height: 100%;
    background-color: rgba(255, 255, 255, .5);
    color: #000;
    line-height: 180px;
  }

  .slide-right {
    right: 0;
  }
}

</style>