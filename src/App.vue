<template>
    <div id="app">
        <div class="left-wrap">
            <div class="btn-item" @click="test_function0">切换场景</div>
            <!-- <div class="btn-item" @click="test_function1">透明度切换</div> -->
            <div class="btn-item" @click="test_function2">飞行动画测试</div>
            <div class="btn-item" @click="test_function3">开启闪烁效果</div>
            <div class="btn-item" @click="test_function4">取消闪烁效果</div>
            <div class="btn-item" @click="test_function5">开启涟漪效果</div>
            <div class="btn-item" @click="test_function6">取消涟漪效果</div>
            <div class="btn-item" @click="test_function7">设置物体损坏状态</div>
            <div class="btn-item" @click="test_function8">取消物体损坏状态</div>
            <div class="btn-item" @click="test_function9">添加选中事件</div>
            <div class="btn-item" @click="test_function10">移除选中事件</div>
            <div class="btn-item" @click="test_function11('特高频局放')">只显示特高频局放</div>
            <!-- <div class="btn-item" @click="test_function11('高频局放')">只显示高频局放</div>
            <div class="btn-item" @click="test_function11('超声局放')">只显示超声局放</div>
            <div class="btn-item" @click="test_function11('接地电流')">只显示接地电流</div>
            <div class="btn-item" @click="test_function11('温度')">只显示温度</div>
            <div class="btn-item" @click="test_function11('振动')">只显示振动</div> -->
            <div class="btn-item" @click="test_function12">展示全部蚂蚁线</div>
            <div class="btn-item" @click="test_function13">获得当前相机的位置与焦点</div>
            <div class="btn-item" @click="test_function14">模拟选中桥接点1</div>
            <div class="btn-item" @click="test_function15">模拟选中桥接点2</div>
            <div class="btn-item" @click="test_function16">取消选中桥接点</div>
            <div class="btn-item" @click="test_function17">隐藏全部传感器盒子蚂蚁线</div>
            <div class="btn-item" @click="test_function18">展示全部传感器盒子蚂蚁线</div>
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
        test_function0() {
            if (this.$refs.viewer3d.mode == 'byq') {
                this.$refs.viewer3d.change_mode('gis');
            } else if (this.$refs.viewer3d.mode == 'gis') {
                this.$refs.viewer3d.change_mode('byq');
            }
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
            const object1 = this.$refs.viewer3d.getObjectByName('振动IPT节点C');
            this.$refs.viewer3d.twinkle_object(object1);

            const object2 = this.$refs.viewer3d.getObjectByName('振动IPT节点D');
            this.$refs.viewer3d.twinkle_object(object2);
        },
        test_function4() {
            const object1 = this.$refs.viewer3d.getObjectByName('振动IPT节点C');
            this.$refs.viewer3d.untwinkle_object(object1);

            const object2 = this.$refs.viewer3d.getObjectByName('振动IPT节点D');
            this.$refs.viewer3d.untwinkle_object(object2);
        },
        test_function5() {
            const object1 = this.$refs.viewer3d.getObjectByName('温度IPT节点A');
            this.$refs.viewer3d.ripple_object(object1);
            const object2 = this.$refs.viewer3d.getObjectByName('温度IPT节点B');
            this.$refs.viewer3d.ripple_object(object2);
        },
        test_function6() {
            const object1 = this.$refs.viewer3d.getObjectByName('温度IPT节点A');
            this.$refs.viewer3d.unripple_object(object1);
            const object2 = this.$refs.viewer3d.getObjectByName('温度IPT节点B');
            this.$refs.viewer3d.unripple_object(object2);
        },
        test_function7() {
            this.$refs.viewer3d.repair_object_by_name('超声局放IPT节点A');
            this.$refs.viewer3d.repair_object_by_name('超声局放IPT节点B');
        },
        test_function8() {
            this.$refs.viewer3d.unrepair_object_by_name('超声局放IPT节点A');
            this.$refs.viewer3d.unrepair_object_by_name('超声局放IPT节点B');
        },
        test_function9() {
            this.$refs.viewer3d.canSelected = true;
        },
        test_function10() {
            this.$refs.viewer3d.canSelected = false;
        },
        test_function11(type) {
            this.$refs.viewer3d.show_relation_link_by_type(type);
        },
        test_function12() {
            this.$refs.viewer3d.reset_relation_object();
        },
        test_function13() {
            const info = this.$refs.viewer3d.get_camera_info();
            console.log('camera info:', info);
        },
        test_function14() {
            this.$refs.viewer3d.reset_ipt_link();
            this.$refs.viewer3d.show_ipt_link('雾汇聚桥节点1');
        },
        test_function15() {
            this.$refs.viewer3d.reset_ipt_link();
            this.$refs.viewer3d.show_ipt_link('雾汇聚桥节点2');
        },
        test_function16() {
            this.$refs.viewer3d.reset_ipt_link();
        },
        test_function17() {
            this.$refs.viewer3d.hide_all_sensor_link();
        },
        test_function18() {
            this.$refs.viewer3d.show_all_sensor_link();
        },
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
    top: 20px;
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
