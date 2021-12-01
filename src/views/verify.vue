<template>
  <div class="verify">
<!--    <Verify @success="alert('success')" @error="alert('error')" :type="1"></Verify>-->
  </div>
</template>

<script>
import Verify from 'vue2-verify'
export default {
  name: "verify",
  methods: {
    alert(text) {
      console.log(text)
    }
  },
  components: {
    Verify
  }
}
</script>

<style scoped lang="scss">

</style>