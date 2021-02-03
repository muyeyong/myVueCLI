import OneButton from './index.vue'

OneButton.install = (app: any) => {
    app.component(OneButton.name, OneButton)
}

export default OneButton
