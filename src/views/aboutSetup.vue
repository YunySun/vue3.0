<template>
  <div class="setup-wrapper">
    <setup :user="user" />
    <button @click="user = 'lee'">change user</button>
  </div>
</template>

<script>
import Setup from "@/components/setup";
export default {
  name: "aboutSetup",
  components: {Setup},
  data() {
    return {
      user: ''
    }
  },
}
</script>

<style scoped>

</style>