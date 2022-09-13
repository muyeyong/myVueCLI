import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const files = require.context('@/views', true, /.*-router\.ts/)

const routes: RouteRecordRaw[] = files.keys().map((key) => {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    const page = require(`@/views${key.replace('.', '')}`)
    return page.default
})

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
})
export default router
