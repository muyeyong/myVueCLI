<template>
    <section>
        <div id="nav">
            <router-link to="/home">Home</router-link> |
            <router-link to="/about">About</router-link>
        </div>
        <div class="sub-app-view" id="sub-app-view"></div>
        <router-view />
    </section>
</template>

<style lang="less">
#contain {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
}

#nav {
    padding: 30px;

    a {
        font-weight: bold;
        color: #2c3e50;

        &.router-link-exact-active {
            color: #42b983;
        }
    }
}
</style>
