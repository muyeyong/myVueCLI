import { Button, Layout } from 'ant-design-vue'
// todo 是不是要对app的类型做限制
const loadUiComponent = (app: any) => {
    app.use(Button).use(Layout)
}
export default loadUiComponent
