<template>
  <div class="gallery">
    <slide-gallery />
    <div class="gallery-horizontal">
      <slide-gallery direction="horizontal" />
    </div>
  </div>
</template>

<script>
import SlideGallery from "@/components/slideGallery";
export default {
  name: "gallery",
  components: {SlideGallery}
}
</script>

<style scoped lang="scss">
.gallery {
  display: flex;
  .gallery-horizontal {
    margin-left: 100px;
    & /deep/ .slide-gallery-wrapper {
      width: 640px;
      height: 180px;

      .slide-img {
        margin-right: 10px;
        &:last-child {
          margin-right: 0;
        }
        width: 180px;
        height: 180px;
      }
    }
  }
}
</style>