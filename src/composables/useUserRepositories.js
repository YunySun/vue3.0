import {onMounted, ref, watch} from "vue";

export default function useUserRepositories(user) {
    // ref创建一个响应式应用
    const repositories = ref([])
    // let repositories = []; //非响应式变量，仓库列表将始终为空
    // 假请求
    const getUserRepositories = async () => {
        repositories.value = await new Promise((resolve) => {
            console.log('请求后端数据.....')
            setTimeout(() => {
                console.log('更新数据.....')
                resolve([{
                    name: user
                }])
            }, 1000)
        })
    }

    onMounted(getUserRepositories); // 在mounted的时候调用getUserRepositories
    watch(user, getUserRepositories); // 在user prop 的响应式引用上设置一个监听器

    return {
        repositories,
        getUserRepositories
    }
}