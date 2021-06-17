<template>
  <div class="slide-gallery-wrapper" @mousedown="mouseDownAction" @mouseup="mouseUpAction">
    <div class="slide-gallery-container" :style="{transform: 'translateY('+top+'px)'}" ref="containerRef">
      <div class="slide-img"></div>
      <div class="slide-img"></div>
      <div class="slide-img"></div>
      <div class="slide-img"></div>
      <div class="slide-img"></div>
      <div class="slide-img"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "slideGallery",
  data() {
    return {
      galleryRect: null,
      top: 0,
      slideIndex: 0,
      startY: 0,
      moveWheel1: true,
      moveWheel2: false,
      wheelTimer: null,
      wheelAnimationReq: null,
      mouseDrag : false
    }
  },
  mounted() {
    this.$nextTick(() => {
      if(this.$el) {
        this.galleryRect = this.$el.getBoundingClientRect();
        var isFirefox = navigator.userAgent.indexOf("Firefox")>0;
        var mousewheel = isFirefox ? "DOMMouseScroll" : "mousewheel";
        this.$el.addEventListener(mousewheel, this.mouseWheelAction, false)
      }
    });
  },
  methods: {
    mouseWheelAction(e) {
      if((this.slideIndex === 0 && e.wheelDeltaY > 0) || (this.slideIndex === 5 && e.wheelDeltaY < 0)) return;
      this.$refs.containerRef.style.transition = 'unset'
      if(this.moveWheel1){
        console.log("滚动了");
        this.moveWheel1 = false;
        this.moveWheel2 = true;
        //这里写开始滚动时调用的方法
        this.wheelAnimation(e);
        this.wheelTimer = setTimeout(() => {this.stopWheel(e)},100);
      }
      else {
        clearTimeout(this.wheelTimer);
        this.wheelTimer = setTimeout(() => {this.stopWheel(e)},100);
      }
    },
    wheelAnimation(e) {
      if (e.wheelDeltaY > 0) {
        this.top += 10
        this.top = Math.min(-(this.slideIndex-1) * this.galleryRect.width, this.top)
      } else if (e.wheelDeltaY < 0) {
        this.top -= 10
        if(this.slideIndex+1 === 5) {
          this.top = Math.max(-((6*this.galleryRect.width)-this.galleryRect.height), this.top)
        } else {
          this.top = Math.max(-(this.slideIndex+1) * this.galleryRect.width, this.top)
        }
      }
      this.wheelAnimationReq = requestAnimationFrame(() => {
        this.wheelAnimation(e)
      })
    },
    stopWheel(e) {
      if(this.moveWheel2){
        cancelAnimationFrame(this.wheelAnimationReq)
        console.log("滚轮停止了");
        this.moveWheel2 = false;
        this.moveWheel1 = true;
        //这里写停止时调用的方法
        console.log(e.wheelDeltaY)
        if (e.wheelDeltaY > 0) {
          this.slideIndex --;
        } else if (e.wheelDeltaY < 0) {
          this.slideIndex ++;
        }
        this.endSlideAction();
      }
    },
    mouseDownAction(e) {
      this.mouseDrag = true;
      this.$refs.containerRef.style.transition = 'unset'
      console.log(e)
      var top = this.startY  = (e.clientY - this.galleryRect.top);
      console.log(top)
      this.$el.onmousemove = em => {
        console.log(em.clientY)
        // if((em.clientY > (this.galleryRect.height-10)) || (em.clientY < 10) || em.clientX > (this.galleryRect.width-10) || (em.clientX < 10)) {
        //   this.mouseUpAction(em)
        //   this.$el.onmousemove = null
        // }
        this.top += (em.clientY - top);
        top = em.clientY
      }
      document.onmouseup = e => {
        if(this.mouseDrag) {
          this.mouseUpAction(e)
          document.onmouseup = null;
        }
      }
    },
    mouseUpAction(e) {
      e.preventDefault();
      e.stopPropagation();
      this.mouseDrag = false;
      var upTop = e.clientY - this.galleryRect.top;
      console.log(this.startY - upTop)
      var direction = upTop - this.startY;
      if(direction > 0) {
        this.slideIndex --;
      } else if(direction < 0) {
        this.slideIndex ++;
      }
      this.slideIndex = Math.min(Math.max(0, this.slideIndex), 5)
      this.endSlideAction();
      this.$el.onmousemove = null
    },
    endSlideAction() {
      this.$refs.containerRef.style.transition = 'transform 1s'
      this.top = Math.min(0, Math.max(- this.slideIndex * this.galleryRect.width, -((6*this.galleryRect.width)-this.galleryRect.height)));
    }
  }
}
</script>

<style scoped lang="scss">

  .slide-gallery-wrapper {
    overflow: hidden;
    width: 640px;
    height: 760px;
    background-color: #ABABB8;

    .slide-img {
      width: 640px;
      height: 640px;
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
  }

</style>