import { createApp, h } from 'vue'
import { registerMicroApps, runAfterFirstMounted, setDefaultMountApp, start } from 'qiankun'
import loadUiComponent from './plugins/antDesign'
import App from './App.vue'
import router from './router'
import store from './store'

let app: any = null

function render({ appContent, loading }: { appContent?: any; loading?: any } = {}): void {
    if (!app) {
        app = createApp({
            data() {
                return {
                    content: appContent,
                    loading,
                }
            },
            render() {
                return h(App, {
                    props: {
                        content: this.content,
                        loading: this.loading,
                    },
                })
            },
        })
    } else {
        app.content = appContent
        app.loading = loading
    }
    app.use(router).use(store)
    loadUiComponent(app)
    app.mount('#contain')
}

render()
function getActiveRule(routerPrefix: string) {
    return (location: { pathname: string }) => location.pathname.startsWith(routerPrefix)
}
registerMicroApps(
    [
        {
            name: 'vue-one',
            entry: '//localhost:8989',
            container: '#sub-app-view-one',
            activeRule: getActiveRule('/aaa'),
        },
        {
            name: 'vue-two',
            entry: '//localhost:9189',
            container: '#sub-app-view-tow',
            activeRule: getActiveRule('/bbb'),
        },
    ],
    {
        beforeLoad: [
            (currentApp) => {
                console.log('before load', currentApp)
                return Promise.resolve()
            },
        ], // 挂载前回调
        beforeMount: [
            (currentApp) => {
                console.log('before mount', currentApp)
                return Promise.resolve()
            },
        ], // 挂载后回调
        afterUnmount: [
            (currentApp) => {
                console.log('after unload', currentApp)
                return Promise.resolve()
            },
        ],
    },
)
setDefaultMountApp('/aaa')
runAfterFirstMounted(() => {})
start()
