import Vue from 'vue'
import SvgIcon from '@/components/svgIcon' // svg组件

// 注册到全局
Vue.component('SvgIcon', SvgIcon)

const requireAll = requireContext => requireContext.keys().map(requireContext)
const req = require.context('./svg', false, /\.svg$/)
requireAll(req)
