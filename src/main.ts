import { createApp, h } from 'vue'
import { registerMicroApps, runAfterFirstMounted, setDefaultMountApp, start } from 'qiankun'
import loadBaseUiComponent from './plugins/antd'
import loadOneUiComponent from './library/ui/install'
import OneUi from './library/ui'
import App from './App.vue'
import router from './router'
import store from './store'

let app: any = null
const msg = {
    data: [],
    uiComponent: OneUi,
}

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
    loadBaseUiComponent(app)
    loadOneUiComponent(app)
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
            container: '#sub-app-view',
            activeRule: getActiveRule('/aaa'),
            props: msg,
        },
        {
            name: 'vue-two',
            entry: '//localhost:8095',
            container: '#sub-app-view',
            activeRule: getActiveRule('/bbb'),
            props: msg,
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
