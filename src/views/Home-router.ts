import { RouteRecordRaw } from 'vue-router'

const Home = () => import('./Home.vue')
const router: RouteRecordRaw = {
    path: '/home',
    name: 'home',
    component: Home,
    children: [],
}

export default router
