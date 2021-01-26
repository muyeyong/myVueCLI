import App from '../App.vue'
const eleCar = r => require.ensure([], () => r(require('../components/eleAnimationOne')), 'eleCar')
const autoScrollList = r => require.ensure([], () => r(require('../components/autoScrollList/index')), 'autoScrollList')
const home = r => require.ensure([], () => r(require('../components/index')), 'home')
export default [{
  path: '/',
  component: App,
  children: [
    // 饿了么动画s
    {
      path: '',
      redirect: '/home'
    },
    {
      path: '/home',
      component: home
    },
    {
      path: '/eleCar',
      component: eleCar
    },
    // 自动滚动列表
    {
      path: '/autoScrollList',
      component: autoScrollList
    }
  ]
}]
