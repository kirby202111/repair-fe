import { createRouter, createWebHistory } from 'vue-router'

import RepairHandle from '@/views/RepairHandle.vue'
import ApproveHandle from '@/views/ApproveHandle.vue'
import HomePage from '@/views/HomePage.vue'


const routes = [
    {
        path: '/',
        name: 'homePage',
        component: HomePage,
        meta: {
            requireAuth: true
        },
    },
    {
        name: "repairHandle",
        path: "/repairhandle",
        meta: {
            title: "返修处理"
        },
        component: RepairHandle
    },
    {
        name: "approveHandle",
        path: "/approveHandle",
        meta: {
            title: "返修确认"
        },
        component: ApproveHandle
    },
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

// 路由守卫
// router.beforeEach((to, from, next) => {
//     if (to.meta.requireAuth) {
//         mgr.getUser().then(result => {
//             if (result && result.access_token) {
//                 next()
//             } else {
//                 next({
//                     path: '/login',
//                     query: {
//                         redirect: to.fullPath
//                     }
//                 })
//             }
//         })
//     } else {
//         next()
//     }
// })

export default router;