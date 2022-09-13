import { createStore } from 'vuex'

const modules: { [key: string]: any } = {}

const files = require.context('./modules', true, /\.ts/)

files.keys().forEach((key) => {
    // eslint-disable-next-line import/no-dynamic-require, global-require
    const module = require(`./modules${key.replace('.', '')}`)
    const matchResult = key.match(/\.\/(\S*)\.ts/)
    const moduleName = (matchResult && matchResult[1]) || ''
    modules[moduleName] = module
})

export default createStore({
    state: {},
    mutations: {},
    actions: {},
    modules,
})
