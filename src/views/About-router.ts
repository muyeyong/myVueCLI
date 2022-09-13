import { RouteRecordRaw } from 'vue-router'

const About = () => import('./About.vue')
const router: RouteRecordRaw = {
    path: '/about',
    name: 'about',
    component: About,
    children: [],
}

export default router
