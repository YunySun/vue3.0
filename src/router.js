// 1 引入 vueRouter
import {createRouter, createWebHashHistory} from 'vue-router';

// 2 定义路由
const routes = [
    {
        path: '/',
        name: 'home',
        component: () => import('./views/home')
    },
    {
        path: '/ref',
        name: 'ref',
        component: () => import('./views/ref')
    },
    {
        path: '/book',
        name: 'book',
        component: () => import('./views/book')
    },
    {
        path: '/book/canvas',
        name: 'canvasBook',
        component: () => import('./views/canvasBook')
    },
    {
        path: '/setup',
        name: 'aboutSetup',
        component: () => import('./views/aboutSetup')
    },
    {
        path: '/gallery',
        name: 'gallery',
        component: () => import('./views/gallery')
    },
    {
        path: '/verify',
        name: 'verify',
        component: () => import('./views/verify')
    },
    {
        path: '/color',
        name: 'color',
        component: () => import('./views/color')
    }
]

// 3 创建路由实例并传递`routes`配置 可以在这里输入更多的配置
const router = createRouter({
    // 4 提供了history模式的实现 hash模式
    history: createWebHashHistory(),
    routes
})

export default router