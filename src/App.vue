<template>
    <div id="app">
        <div class="left-wrap">
            <div class="btn-item" @click="test_function1">透明度切换</div>
            <div class="btn-item" @click="test_function2">飞行动画测试</div>
            <div class="btn-item" @click="test_function3">闪烁效果/取消</div>
            <div class="btn-item" @click="test_function4">涟漪效果/取消</div>
            <!-- <div class="btn-item" @click="test_function5">蚂蚁线效果</div>
            <div class="btn-item" @click="test_function6">蚂蚁线取消</div> -->
            <div class="btn-item" @click="test_function8">设置物体损坏状态</div>
            <div class="btn-item" @click="test_function9">取消物体损坏状态</div>
            <div class="btn-item" @click="test_function7">添加选中事件</div>
            <div class="btn-item" @click="test_function10">切换场景</div>
            <!-- <div class="btn-item" @click="test_function11">根据传感器类型过滤</div> -->
        </div>
        <Viewer3d ref="viewer3d" @object-select="handleSelectObject"></Viewer3d>
    </div>
</template>

<script>
import Viewer3d from '@/views/viewer3d';
export default {
    name: 'App',
    components: {
        Viewer3d
    },
    methods: {
        handleSelectObject(name) {
            console.log('select object:', name);
        },
        test_function1() {
            const object = this.$refs.viewer3d.getObjectByName('变压器');
            console.log('test1:', object);
            this.$refs.viewer3d.set_object_opacity(object, 0.1);
        },
        test_function2() {
            const object = this.$refs.viewer3d.getObjectByName('超声局放传感器2');
            console.log('test2:', object);
            this.$refs.viewer3d.fly_to_object(object);
        },
        test_function3() {
            const object = this.$refs.viewer3d.getObjectByName('振动IPT节点D');
            console.log('test3:', object);
            this.$refs.viewer3d.twinkle_object(object);
        },
        test_function4() {
            // const objectByq = this.$refs.viewer3d.getObjectByName('变压器Group');
            // this.$refs.viewer3d.set_object_visible(objectByq, false);
            const object = this.$refs.viewer3d.getObjectByName('温度IPT节点A');
            console.log('test4:', object);
            this.$refs.viewer3d.ripple_object(object);
        },
        test_function5() {
            const object = this.$refs.viewer3d.getObjectByName('变压器Group');
            this.$refs.viewer3d.set_object_opacity(object, 0.5);

            const object1 = this.$refs.viewer3d.getObjectByName('温度传感器001');
            const object2 = this.$refs.viewer3d.getObjectByName('盒子002');

            // console.log('test5- object1:', object1, ', object2:', object2);

            this.$refs.viewer3d.relation_object(object1, object2);

            const object3 = this.$refs.viewer3d.getObjectByName('温度传感器002');
            this.$refs.viewer3d.relation_object(object3, object2);

            const object4 = this.$refs.viewer3d.getObjectByName('超声局放001');
            const object5 = this.$refs.viewer3d.getObjectByName('盒子006');

            this.$refs.viewer3d.relation_object(object4, object5);

        },
        test_function6() {
            const object = this.$refs.viewer3d.getObjectByName('变压器Group');
            this.$refs.viewer3d.set_object_opacity(object, 1.0);

            const object1 = this.$refs.viewer3d.getObjectByName('温度传感器001');
            const object2 = this.$refs.viewer3d.getObjectByName('盒子002');

            // console.log('test5- object1:', object1, ', object2:', object2);

            this.$refs.viewer3d.remove_relation_object(object1, object2);

            const object3 = this.$refs.viewer3d.getObjectByName('温度传感器002');
            this.$refs.viewer3d.remove_relation_object(object3, object2);

            const object4 = this.$refs.viewer3d.getObjectByName('超声局放001');
            const object5 = this.$refs.viewer3d.getObjectByName('盒子006');

            this.$refs.viewer3d.remove_relation_object(object4, object5);
        },
        test_function7() {
            this.$refs.viewer3d.canSelected = true;
        },
        test_function8() {
            this.$refs.viewer3d.set_object_state_repair_by_name('振动IPT节点C', true);
        },
        test_function9() {
            this.$refs.viewer3d.set_object_state_repair_by_name('振动IPT节点C', false);
        },
        test_function10() {
            if (this.$refs.viewer3d.mode == 'byq') {
                this.$refs.viewer3d.changeMode('gis');
            } else if (this.$refs.viewer3d.mode == 'gis') {
                this.$refs.viewer3d.changeMode('byq');
            }
        },
        test_function11() {
            
        }
    }
}
</script>

<style lang="scss">
html, body {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    text-align: center;
    /* overflow: hidden; */
}
#app {
    position: relative;
    width: 100%;
    height: 100%;
}
.left-wrap {
    position: absolute;
    top: 100px;
    left: 10px;
    z-index: 10;

    .btn-item {
        position: relative;
        padding: 3px 5px;
        background-color: #fff;
        border: 1px solid #c0c0c0;
        color: #1d221d;
        font-size: 14px;
        font-weight: 600;
        text-align: center;
        margin-top: 5px;
        cursor: pointer;
        &:first-child {
            margin-top: 0;
        }
    }
}
</style>
