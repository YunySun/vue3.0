<template>
  <div class="color-ctl-wpp" ref="colorWrapperRef">
    <div class="color-dft flex-b-c">
      <div class="color flex-1" :style="{backgroundColor: rightHex}"></div>
      <div class="color-btn flex-1">默认颜色</div>
    </div>
    <div class="color-picker">
      <p class="color-tt">拾色器</p>
      <div class="color-picker-con" :style="{backgroundColor: pickerHex || '#000'}" ref="colorPickerRef">
        <div class="color-pos" :style="{
          left: pickerPosition.x + 'px',
          top: pickerPosition.y + 'px'
        }"></div>
      </div>
      <div class="color-h-wpp">
        <div class="color-h-bg" ref="colorHRef">
          <div class="color-h-pos" :style="{
          left: hsbH.x + 'px',
        }"></div>
        </div>
      </div>
      <div class="color-val-wpp">
        <ul class="flex-b-c">
          <li class="color-hex">
            <div class="color-ipt flex-b-c">
              <span>#</span>
              <label class="flex-1">
                <input type="text" v-model="hex" maxlength="6">
              </label>
            </div>
            <p>HEX</p>
          </li>
          <li class="color-rgb">
            <div class="color-ipt">
              <label>
                <input type="text" v-model="rgb.r" maxlength="3">
              </label>
            </div>
            <p>R</p>
          </li>
          <li class="color-rgb">
            <div class="color-ipt">
              <label>
                <input type="text" v-model="rgb.g" maxlength="3">
              </label>
            </div>
            <p>G</p>
          </li>
          <li class="color-rgb">
            <div class="color-ipt">
              <label>
                <input type="text" v-model="rgb.b" maxlength="3">
              </label>
            </div>
            <p>B</p>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import color from "../views/color";

export default {
  name: "colorController",
  props: ['color'],
  data() {
    return {
      default: this.color,
      hex: this.formatHex(this.color),
      rgb: {r: 0, g: 0, b: 0},
      hsb: {h: 0, s: 0, b: 0},
      pickerHex: '',
      pickerPosition: {x: 0, y: 0},
      colorPickerEl: null,
      colorHEl: null, // hsb h元素
      colorPickerData: {},
      colorHData: {},
      colorWrapperEl: null,
      hsbH: {x: 0}
    }
  },
  computed: {
    rightHex() {
      return '#' + this.hex
    }
  },
  created() {
    this.rgb = this.hexToRgb(this.hex);
    this.hsb = this.rgbToHsb(this.rgb);
    var pickerRgb = this.hsbToRgb({h: this.hsb.h, s: 100, b: 100});
    this.pickerHex = '#' + this.rgbToHex(pickerRgb)
  },
  mounted() {
    this.$nextTick(() => {
      this.colorWrapperEl = this.$refs.colorWrapperRef;
      this.colorPickerEl = this.$refs.colorPickerRef;
      this.colorHEl = this.$refs.colorHRef;
      console.log(this.colorPickerEl.offsetParent)
      if (this.colorPickerEl) {
        this.initColorPicker();
        this.bindMove(this.colorPickerEl, this.setColorPickerPosition)
      }
      if (this.colorHEl) {
        this.initColorH();
        this.bindMove(this.colorHEl, this.setColorHPosition)
      }
      this.resetHsbPos();
    })
  },
  methods: {
    // 根据HSB重置位置
    resetHsbPos() {
      this.hsbH.x = this.hsb.h / 360 * this.colorHData.width;
    },
    // 初始化HSB选择器的一些参数
    initColorH() {
      this.colorHData = this.colorHEl.getBoundingClientRect();
      this.pickerPosition.x = this.hsb.s / 100 * this.colorPickerData.width;
      this.pickerPosition.y = this.colorPickerData.height - this.hsb.b / 100 * this.colorPickerData.height;
    },
    // 初始化颜色选择器的一些参数
    initColorPicker() {
      this.colorPickerData = this.colorPickerEl.getBoundingClientRect();
    },
    // 设置HSB h的位置
    setColorHPosition(x) {
      var maxX = this.colorHData.width;
      var hX = x - this.colorHData.left;
      this.hsbH.x = Math.min(maxX, Math.max(0, hX));
      this.hsb.h = parseInt(360 * this.hsbH.x / maxX);
      console.log(this.hsb)
      var pickerRgb = this.hsbToRgb({h: this.hsb.h, s: 100, b: 100});
      this.pickerHex = '#' + this.rgbToHex(pickerRgb)
      this.rgb = this.hsbToRgb(this.hsb);
      this.hex = this.rgbToHex(this.rgb);
    },
    // 设置取色点位置
    setColorPickerPosition(x, y) {
      console.log(x, y)
      var maxX = this.colorPickerData.width;
      var maxY = this.colorPickerData.height;
      var pickerX = x - this.colorPickerData.left;
      var pickerY = y - this.colorPickerData.top;
      var pickerLimitedX = Math.min(maxX, Math.max(0, pickerX))
      var pickerLimitedY = Math.min(maxY, Math.max(0, pickerY))
      this.pickerPosition = {x: pickerLimitedX, y: pickerLimitedY};
      console.log(this.pickerPosition)

      this.hsb.s = parseInt(100 * pickerLimitedX / maxX);
      this.hsb.b = parseInt(100 * (maxY - pickerLimitedY) / maxY);
      this.rgb = this.hsbToRgb(this.hsb);
      this.hex = this.rgbToHex(this.rgb);

      console.log(this.hsb)
    },
    // 绑定事件
    bindMove(el, fn) {
      el.addEventListener('mousedown', e => {
        var pageX = e.pageX;
        var pageY = e.pageY;
        fn(pageX, pageY);

        document.addEventListener('mousemove', mousemove)

        function mousemove(e) {
          e.preventDefault();
          var moveX = e.pageX;
          var moveY = e.pageY
          fn(moveX, moveY);
        }

        document.addEventListener("mouseup", mouseup);

        function mouseup() {
          document.removeEventListener("mousemove", mousemove)
          document.removeEventListener("mouseup", mouseup)
        }
      })
    },
    rgbToHex(rgb) {
      var hex = [
        rgb.r.toString(16),
        rgb.g.toString(16),
        rgb.b.toString(16)
      ];
      hex.map(function (str, i) {
        if (str.length === 1) {
          hex[i] = '0' + str;
        }
      });

      return hex.join('').toUpperCase();
    },
    hexToRgb(hex) {
      var formatHex = this.formatHex(hex);
      console.log(formatHex)
      hex = parseInt(formatHex, 16);
      console.log(hex)
      return {r: hex >> 16, g: (hex & 0x00FF00) >> 8, b: (hex & 0x0000FF)};
    },
    rgbToHsb(rgb) {
      var hsb = {h: 0, s: 0, b: 0};
      var min = Math.min(rgb.r, rgb.g, rgb.b);
      var max = Math.max(rgb.r, rgb.g, rgb.b);
      var delta = max - min;
      hsb.b = max;
      hsb.s = max !== 0 ? 255 * delta / max : 0;
      if (hsb.s !== 0) {
        if (rgb.r === max) hsb.h = (rgb.g - rgb.b) / delta;
        else if (rgb.g === max) hsb.h = 2 + (rgb.b - rgb.r) / delta;
        else hsb.h = 4 + (rgb.r - rgb.g) / delta;
      } else hsb.h = -1;
      hsb.h *= 60;
      if (hsb.h < 0) hsb.h += 360;
      hsb.s *= 100 / 255;
      hsb.b *= 100 / 255;
      return hsb;
    },
    hsbToRgb(hsb) {
      var rgb = {};
      var h = Math.round(hsb.h);
      var s = Math.round(hsb.s * 255 / 100);
      var v = Math.round(hsb.b * 255 / 100);

      if (s === 0) {
        rgb.r = rgb.g = rgb.b = v;
      } else {
        var t1 = v;
        var t2 = (255 - s) * v / 255;
        var t3 = (t1 - t2) * (h % 60) / 60;

        if (h === 360) h = 0;

        if (h < 60) {
          rgb.r = t1;
          rgb.b = t2;
          rgb.g = t2 + t3
        } else if (h < 120) {
          rgb.g = t1;
          rgb.b = t2;
          rgb.r = t1 - t3
        } else if (h < 180) {
          rgb.g = t1;
          rgb.r = t2;
          rgb.b = t2 + t3
        } else if (h < 240) {
          rgb.b = t1;
          rgb.r = t2;
          rgb.g = t1 - t3
        } else if (h < 300) {
          rgb.b = t1;
          rgb.g = t2;
          rgb.r = t2 + t3
        } else if (h < 360) {
          rgb.r = t1;
          rgb.g = t2;
          rgb.b = t1 - t3
        } else {
          rgb.r = 0;
          rgb.g = 0;
          rgb.b = 0
        }
      }

      return {r: Math.round(rgb.r), g: Math.round(rgb.g), b: Math.round(rgb.b)};
    },
    formatHex(hex) {
      hex = hex.toUpperCase()
      return (hex.indexOf('#') > -1) ? hex.substring(1) : hex
    }
  }
}
</script>

<style scoped lang="scss">
.color-ctl-wpp {
  width: 290px;
  padding: 20px;
  background-color: #fff;
  box-shadow: 0 0 6px 0 #DBDCDC;
  box-sizing: border-box;
  font-size: 14px;

  .color-dft {
    height: 40px;
    line-height: 40px;

    .color, .color-btn {
      height: 40px;
      border-radius: 3px;
    }

    .color {
      margin-right: 10px;
    }

    .color-btn {
      border: 1px solid #DBDCDC;
      text-align: center;
      cursor: pointer;
    }
  }

  .color-picker {
    p {
      padding: 12px 0;
    }

    .color-picker-con {
      position: relative;
      width: 100%;
      height: 160px;
      border-radius: 3px;
      cursor: pointer;

      .color-pos {
        position: absolute;
        z-index: 2;
        width: 8px;
        height: 8px;
        border: 2px solid #FFFFFF;
        border-radius: 50%;
        transform: translate(-50%, -50%);
      }

      &:before, &:after {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
      }

      &:before {
        background: linear-gradient(to right, #fff, rgba(255, 255, 255, 0));
      }

      &:after {
        background: linear-gradient(to top, #000, rgba(0, 0, 0, 0));
      }
    }

    .color-h-wpp {
      padding: 13px 0;

      .color-h-bg {
        position: relative;
        width: 100%;
        height: 10px;
        cursor: pointer;
        background: linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%);
        border-radius: 5px;

        .color-h-pos {
          position: absolute;
          top: 0;
          bottom: 0;
          z-index: 2;
          width: 6px;
          height: 6px;
          margin: auto;
          border: 2px solid #FFFFFF;
          border-radius: 50%;
          transform: translate(-50%, 0);
          box-shadow: 0 0 0 1px #888;
        }
      }
    }

    .color-val-wpp {
      font-size: 12px;

      ul {
        li {
          text-align: center;
          color: #878787;

          .color-ipt {
            color: #dbdcdc;
            height: 28px;
            line-height: 28px;
            border-radius: 3px;
            border: 1px solid #DBDCDC;
          }
        }
      }

      .color-hex {
        .color-ipt {
          width: 82px;

          span {
            width: 26px;
          }

          input {
            width: 54px;
          }
        }
      }

      .color-rgb {
        .color-ipt {
          width: 48px;

          input {
            width: 100%;
            text-align: center;
          }
        }
      }

      input {
        font-size: 12px;
      }
    }
  }
}

.flex-b-c {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.flex-1 {
  flex: 1
}
</style>