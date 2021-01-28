<template>
    <div class="home">
        <a-button type="primary"> Primary </a-button>
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
