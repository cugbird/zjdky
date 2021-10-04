<template>
    <div id="app">
        <View3D></View3D>
    </div>
</template>

<script>
import View3D from '@/views/view3d';
export default {
    name: 'App',
    components: {
        View3D
    }
}
</script>

<style>
html, body {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    text-align: center;
}
#app {
    position: relative;
    width: 100%;
    height: 100%;
}
</style>
