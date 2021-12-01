<template>
  <div class="color-wpp">
    <div class="color-con">
      <div class="color"></div>
      <color-controller :color="color" />
    </div>
  </div>
</template>

<script>
import ColorController from "../components/colorController";
export default {
  name: "color",
  components: {ColorController},
  data() {
    return {
      color: '#ff0000'
    }
  }
}
</script>

<style scoped lang="scss">
.color-wpp {
  .color-con {
    .color {
      width: 50px;
      height: 50px;
      background-color: red;
    }
  }
}
</style>