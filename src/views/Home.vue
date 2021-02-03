<template>
    <div class="home">
        <one-button type="primary"> Primary </one-button><br />
        <router-link to="/aaa"> 切换子应用Vue2.0</router-link><br />
        <router-link to="/bbb"> 切换子应用Vue3.0</router-link><br />
        <HelloWorld />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import HelloWorld from 'components/HelloWorld.vue'

export default defineComponent({
    name: 'Home',
    components: {
        HelloWorld,
    },
})
</script>
