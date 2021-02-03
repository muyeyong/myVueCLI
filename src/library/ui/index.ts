import OneButton from './one-button'
import OneDatePicker from './one-datePicker'

const components = [OneButton, OneDatePicker]
const install = (app: any) => {
    // eslint-disable-next-line no-param-reassign
    components.forEach((component) => {
        app.component(component.name, component)
    })
}
export default {
    install,
}
