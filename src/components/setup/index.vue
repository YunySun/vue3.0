<template>
  <div>
    {{ repositories }}
  </div>
  <teleport to="body"><div>123</div></teleport>
</template>

<script>
import useUserRepositories from "@/composables/useUserRepositories";
import useRepositoryNameSearch from "@/composables/useRepositoryNameSearch";

import {toRefs} from "vue";

export default {
  name: "setup",
  props: {
    user: {
      type: String,
      required: true
    }
  },
  // setup 选项是一个接受props和context的函数 （避免使用this） 返回的所有内容都暴露给组件的其余部分（计算属性 方法 生命周期等）以及组件的模板
  setup(props) {
    console.log(props)

    // 使用toRef创建对prop的user 属性的响应式引用
    const { user } = toRefs(props);
    const { repositories, getUserRepositories } = useUserRepositories(user);
    const { searchQuery, repositoriesMatchingSearchQuery } = useRepositoryNameSearch(repositories)

    return {
      repositories,
      getUserRepositories, // 返回的函数与方法的行为相同
      searchQuery,
      repositoriesMatchingSearchQuery
    } // 返回的任何内容都可用于组件的其余部分
  },
  // mounted() {
  //   this.getUserRepositories();
  // }
}
</script>

<style scoped>

</style>