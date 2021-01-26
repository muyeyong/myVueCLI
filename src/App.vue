<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import './utils/lib-flexible-2.0/index'
export default {
  name: 'App',
  components: {

  }
}
</script>

<style lang='less' >
@import './css/normalize.css';
@import './css/base.css';
body {
  background: url('assets/imgs/main_bg.jpg') no-repeat;
  background-size: 100%;
}
#app {
  margin: 0 auto;
  max-width: 10rem;
  min-width: 4.266667rem;
}
</style>
