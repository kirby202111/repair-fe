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

import { createRouter, createWebHistory  } from 'vue-router'

import RepairHandle from '@/views/RepairHandle.vue'
import Approve from '@/views/RepairApprove.vue'


const routes = [
    {
        name: "repairhandle",
        path: "/repairhandle",
        meta: {
            title: "返修处理"
        },
        component: RepairHandle
    },
    {
        name: "approve",
        path: "/approve",
        meta: {
            title: "返修确认"
        },
        component: Approve
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router;