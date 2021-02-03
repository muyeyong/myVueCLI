import oneDatePicker from './index.vue'

oneDatePicker.install = (app: any) => {
    app.component(oneDatePicker.name, oneDatePicker)
}

export default oneDatePicker
