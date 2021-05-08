<template>
  <div id="app">
<!--    <base-layout>-->
<!--      <router-view></router-view>-->
<!--    </base-layout>-->
    <router-view></router-view>
  </div>
</template>

<script>

import BaseLayout from "@/layouts/baseLayout";
export default {
  name: 'app',
  components: {BaseLayout}
}
</script>

<style>
#app {
  height: 100%;
}
</style>
