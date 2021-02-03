import { Button, Layout, DatePicker } from 'ant-design-vue'

const components = [Button, Layout, DatePicker]

const loadBaseUiComponent = (app: { use: Function }) => {
    components.forEach((component) => {
        app.use(component)
    })
}

export default loadBaseUiComponent
