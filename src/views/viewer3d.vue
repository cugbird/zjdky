<template>
    <div class="viewer-container">
        <div class="viewer-item" ref="viewerRef" @click="mouse_event_click"></div>
    </div>
</template>

<script>
import * as THREE from '@/three/build/three.module.js';
// import Stats from '@/three/examples/jsm/libs/stats.module.js';
import { OrbitControls } from '@/three/examples/jsm/controls/OrbitControls.js';
import { FBXLoader } from '@/three/examples/jsm/loaders/FBXLoader.js';
// 动画需要
const TWEEN = require('@tweenjs/tween.js');
// 蚂蚁线shader
// import RelationLineVert  from '@/shaders/relationLineVert.glsl.js';
// import RelationLineFlag from '@/shaders/relationLineFlag.glsl.js';
import RelationLineVert2  from '@/shaders/relationLineVert2.glsl.js';
import RelationLineFlag2 from '@/shaders/relationLineFlag2.glsl.js';

import {byq_relation_trees,byq_select_items,gis_relation_trees,gis_select_items,byq_name_code_list,gis_name_code_list} from './viewer_data';
import {settings3D} from './viewer_setting';

// threejs全局变量，不放在data中，有利于渲染速度
let scene = undefined;
let camera = undefined;
let renderer = undefined;
// let stats = undefined;
// 射线选择器
let raycaster = undefined;

export default {
    data() {
        return {
            mode: '',  // byq or gis
            scene_datas: {
                'byq': {
                    model: undefined, // 模型
                    relation_trees: [], // 蚂蚁线元数据
                    can_select_items: [], // 可选择的对象
                    select_objects: [], // 当前选中的对象
                    twinkles: [], // 闪烁效果
                    ripples: [], // 涟漪效果
                    repairs: [], // 维修效果
                    link_items: [], // 传感器到ipt盒子的蚂蚁线
                    link_items_ipt: [], // ipt盒子到桥接点的蚂蚁线
                    select_links: [], // 当前选中的蚂蚁线
                },
                'gis': {
                    model: undefined, // 模型
                    relation_trees: [], // 蚂蚁线元数据
                    can_select_items: [], // 可选择的对象
                    select_objects: [], // 当前选中的对象
                    twinkles: [], // 闪烁效果
                    ripples: [], // 涟漪效果
                    repairs: [], // 维修效果
                    link_items: [], // 传感器到ipt盒子的蚂蚁线
                    link_items_ipt: [], // ipt盒子到桥接点的蚂蚁线
                    select_links: [], // 当前选中的蚂蚁线
                }
            },
            scene_data: undefined,

            scene_types: ['特高频局放', '高频局放', '超声局放', '接地电流', '温度', '振动'],

            // 蚂蚁线
            relation_uniforms: {
                time: {
                    value: 0.0
                }
            },
            need_relation: true, // 蚂蚁线流动效果控制开关

            canSelected: false, // 是否开启选中事件

            orbitCtrl: undefined, // scene操作控件
        }
    },
    mounted() {
        this.init3D();
        this.load_business();
        this.load_model('/static/model/byq_001.FBX', 'byq');
        this.load_model('/static/model/gis_001.FBX', 'gis');
    },
    methods: {
        /**
         * 获得画布大小
         */
        get_render_rect() {
            let width = this.$refs.viewerRef.clientWidth;
            let height = this.$refs.viewerRef.clientHeight;
            width = Math.floor(width);
            height = Math.floor(height);
            // console.log('width:', width, ', height:', height);
            return {
                width: width - 1,
                height: height - 1
            }
        },
        /**
         * 初始化三维场景
         */
        init3D() {
            const rect = this.get_render_rect();
            camera = new THREE.PerspectiveCamera( 50, rect.width / rect.height, 0.01, 1000000 );
            camera.position.set(0, 600, settings3D.camera_distance);
            camera.lookAt(new THREE.Vector3(0, 0, 0));

            scene = new THREE.Scene();
            // 天空盒子
            // const path = "/static/img/cube3/dark-s_";
            // const format = '.png';
            // const urls = [
            //     path + 'px' + format,path + 'nx' + format,
            //     path + 'py' + format,path + 'ny' + format,
            //     path + 'pz' + format,path + 'nz' + format,
            // ];
            // const textureCube = new THREE.CubeTextureLoader().load(urls);
            // scene.background = textureCube;
            // 普通图片背景
            scene.background = new THREE.TextureLoader().load('/static/img/bkg.png');
            // 半球光
            const hemiLight = new THREE.HemisphereLight(0xf0f0f0, 0x404040);
            hemiLight.position.set( 500, 500, 0 );
            scene.add( hemiLight );
            // 方向光
            const directionalLight1 = new THREE.DirectionalLight(0xf0f0f0, 0.5);
            directionalLight1.position.set(1,1,0);
            scene.add( directionalLight1 );
            const directionalLight2 = new THREE.DirectionalLight(0xf0f0f0, 0.5);
            directionalLight2.position.set(-1,1,0);
            scene.add( directionalLight2 );
            // 环境光
            const ambientLight = new THREE.AmbientLight( 0x404040 );
            scene.add(ambientLight);

            renderer = new THREE.WebGLRenderer({ antialias: true, failIfMajorPerformanceCaveat: true });
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.setSize(rect.width, rect.height);
            this.$refs.viewerRef.appendChild(renderer.domElement);
            // 控制器
            this.orbitCtrl = new OrbitControls(camera, renderer.domElement);
            this.orbitCtrl.target.set(0, 0, 0);
            this.orbitCtrl.maxDistance = 2000;
            this.orbitCtrl.maxPolarAngle = Math.PI * 3/ 7;
            // this.orbitCtrl.enablePan = false;
            this.orbitCtrl.update();

            window.addEventListener('resize', this.on_window_resize, false);
            // stats
            // stats = new Stats();
            // this.$refs.viewerRef.appendChild( stats.dom );
            // 监听事件
            raycaster = new THREE.Raycaster();
            // 开启选择
            this.canSelected = true;
            // 进入渲染循环
            this.animate();
        },
        load_business() {
            this.scene_datas.byq.relation_trees = byq_relation_trees;
            this.scene_datas.byq.can_select_items = byq_select_items;

            this.scene_datas.gis.relation_trees = gis_relation_trees;
            this.scene_datas.gis.can_select_items = gis_select_items;
        },
        load_model(url, name) {
            const loader = new FBXLoader();
            loader.load(url, (object) => {
                console.log('load fbx data name:', name, ', object:', object);
                object.renderOrder = 10;
                object.name = name;
                if (name == 'byq') {
                    const body = object.getObjectByName('变压器');
                    if (body) {
                        this.set_object_opacity(body, settings3D.body_opacity);
                    }
                } else if (name == 'gis') {
                    const body = object.getObjectByName('GIS设备');
                    if (body) {
                        this.set_object_opacity(body, settings3D.body_opacity);
                    }
                }
                this.scene_datas[name].model = object;
                if (name == 'byq') {
                    this.change_mode(name);
                }
            });
        },
        change_mode(new_mode) {
            if (this.mode == new_mode) {
                return;
            }
            this.mode = new_mode;
            // remove old scene
            if (this.scene_data) {
                this.unselect_object_list(this.scene_data.select_objects);
                this.scene_data.select_objects = [];
                this.remove_relation_links(this.scene_data.link_items);
                // this.scene_data.link_items = [];
                this.hide_ripple_sphere_list(this.scene_data.ripples);
                this.hide_repair_sprite_list(this.scene_data.repairs);
                this.reset_ipt_link();

                scene.remove(this.scene_data.model);
            }
            // add new scene
            this.scene_data = this.scene_datas[new_mode];
            scene.add(this.scene_data.model);
            this.load_relation_links();
            this.show_ripple_sphere_list(this.scene_data.ripples);
            this.show_repair_sprite_list(this.scene_data.repairs);
            if (new_mode == 'byq') {
                this.fly_to_position(new THREE.Vector3(0, 600, settings3D.camera_distance), new THREE.Vector3(0,0,0), 1000);
            } else if (new_mode == 'gis') {
                this.fly_to_position(new THREE.Vector3(-100, 600, -settings3D.camera_distance), new THREE.Vector3(0,0,0), 1000);
            }
        },
        load_relation_links() {
            if (this.scene_data.link_items.length == 0) {
                for (let i = 0; i < this.scene_data.relation_trees.length; ++i) {
                    const item_level_1 = this.scene_data.relation_trees[i];
                    for (let j = 0; j < item_level_1.children.length; ++j) {
                        const item_level_2 = item_level_1.children[j];
                        // this.relation_object_by_name(item_level_2.name, item_level_1.name, item_level_2.type, true);
                        for (let k = 0; k < item_level_2.children.length; ++k) {
                            const item_level_3 = item_level_2.children[k];
                            this.relation_object_by_name(item_level_3.name, item_level_2.name, item_level_2.type, false);
                        }
                    }
                }
            } else {
                for (let i = 0; i < this.scene_data.link_items.length; ++i) {
                    const link_item = this.scene_data.link_items[i];
                    scene.add(link_item.inner);
                    // scene.add(link_item.outer);
                    link_item.outer.forEach((item) => {
                        scene.add(item);
                    })
                }
            }
            // 新增ipt盒子到桥接点的蚂蚁线
            if (this.scene_data.link_items_ipt.length == 0) {
                for (let i = 0; i < this.scene_data.relation_trees.length; ++i) {
                    const item_level_1 = this.scene_data.relation_trees[i];
                    for (let j = 0; j < item_level_1.children_ipt.length; ++j) {
                        const item_level_2 = item_level_1.children_ipt[j];
                        this.relation_ipt_by_name(item_level_1.name, item_level_2.name, item_level_2.children);
                    }
                }
            }
        },
        remove_relation_links(list) {
            for (let i = 0; i < list.length; ++i) {
                const link_item = list[i];
                scene.remove(link_item.inner);
                // scene.remove(link_item.outer);
                link_item.outer.forEach((item) => {
                    scene.remove(item);
                })
            }
        },
        mouse_event_click(e) {
            if (!this.canSelected) {return;}
            // 之前有选中的物体，则回退物体的颜色
            if (this.scene_data.select_objects.length > 0) {
                this.unselect_object_list(this.scene_data.select_objects);
                this.scene_data.select_objects = [];
            }
            if (this.scene_data.select_links.length > 0) {
                this.unselect_link_list(this.scene_data.select_links);
                this.scene_data.select_links = [];
            }
            // 重置ipt盒子与桥接点的蚂蚁线
            // this.reset_ipt_link();
            const {offsetX, offsetY} = e;
            const rect = this.get_render_rect();
            const pointer = {
                x: (offsetX / rect.width) * 2 - 1,
                y: -(offsetY / rect.height) * 2 + 1
            }
            raycaster.setFromCamera( pointer, camera );
            const intersects = raycaster.intersectObject(scene, true);
            if (intersects.length > 0) {
                let target = undefined;
                for (let i = 0; i < intersects.length; ++i) {
                    const item = intersects[i].object;
                    if (this.scene_data.can_select_items.includes(item.name)) {
                        target = item;
                        break;
                    } else {
                        const parent = item.parent;
                        if (this.scene_data.can_select_items.includes(parent.name)) {
                            target = parent;
                            break;
                        }
                    }
                }
                console.log('intersects:', target);
                if (target) {
                    // 释放选中事件
                    const target_code = this.get_model_code_by_name(target.name);
                    this.$emit('object-select', {name: target.name, code: target_code});
                    // 高亮蚂蚁线
                    this.scene_data.select_links = this.get_relation_link_by_name(target.name);
                    // console.log('highlight_links:', this.scene_data.select_links);
                    this.select_link_list(this.scene_data.select_links, undefined);
                    // 选中了物体
                    // this.select_object(target, settings3D.select_color);
                    this.scene_data.select_objects.push(target);
                    // 如果选中的是ipt节点，高亮对应的传感器
                    const sensor_items = this.get_relation_object_by_name(target.name);
                    this.scene_data.select_objects.push(...sensor_items);
                    this.select_object_list(this.scene_data.select_objects, settings3D.select_color);
                    // 如果选中的是桥接点，现实桥接点蚂蚁线
                    // if (target.name.includes('桥节点')) {
                    //     this.show_ipt_link(target.name);
                    // }
                } else {
                    this.$emit('object-select', undefined);
                }
            } else {
                console.log('no intersects');
                this.$emit('object-select', undefined);
                // 之前有选中的物体，则回退物体的颜色
                if (this.scene_data.select_objects.length > 0) {
                    this.unselect_object_list(this.scene_data.select_objects);
                    this.scene_data.select_objects = [];
                }
                if (this.scene_data.select_links.length > 0) {
                    this.unselect_link_list(this.scene_data.select_links);
                    this.scene_data.select_links = [];
                }
            }
        },
        get_model_code_by_name(name) {
            if (this.mode == 'byq') {
                for (let i = 0; i < byq_name_code_list.length; ++i) {
                    const name_code_item = byq_name_code_list[i];
                    if (name_code_item.name == name) {
                        return name_code_item.code;
                    }
                }
            } else if (this.mode == 'gis') {
                for (let i = 0; i < gis_name_code_list.length; ++i) {
                    const name_code_item = gis_name_code_list[i];
                    if (name_code_item.name == name) {
                        return name_code_item.code;
                    }
                }
            }
            return '';
        },
        on_window_resize() {
            const rect = this.get_render_rect();
            camera.aspect = rect.width / rect.height;
            camera.updateProjectionMatrix();

            renderer.setSize( rect.width, rect.height );
        },
        animate() {
            requestAnimationFrame( this.animate );
            renderer.render( scene, camera );
            // stats.update();
            TWEEN.update();

            // uniform
            if (this.need_relation) {
                let newTime = this.relation_uniforms.time.value + settings3D.link_speed;
                if (newTime > 4.0) {newTime = 0;}
                this.relation_uniforms.time.value = newTime;
            }
        },
        ///////////////////////////////////////////////////
        // 开放接口
        ///////////////////////////////////////////////////
        /**
         * 通过物体的名称获取对象
         */
        getObjectByName(name) {
            return scene.getObjectByName(name);
        },
        set_object_opacity_by_name(name, opacity) {
            const object = scene.getObjectByName(name);
            if (object == undefined) return;
            this.set_object_opacity(object, opacity);
        },
        set_object_opacity(object, opacity) {
            if (object.type == 'Group') {
                for (let i = 0; i < object.children.length; ++i) {
                    const child = object.children[i];
                    if (child.type == 'Group') {
                        this.set_object_opacity(child, opacity);
                    } else if (child.type == 'Mesh') {
                        child.material.opacity = opacity;
                        child.material.transparent = true;
                    }
                }
            } else if (object.type == 'Mesh') {
                object.material.opacity = opacity;
                object.material.transparent = true;
            }
        },
        select_object_list(objects, color) {
            for (let i = 0; i < objects.length; ++i) {
                const object = objects[i];
                this.select_object(object, color);
            }
        },
        select_object(object, color) {
            if (object.type == 'Mesh') {
                if (object.material_origin == undefined)  {
                    object.material_origin = object.material;
                    object.material = new THREE.MeshBasicMaterial({color:color});
                }
            } else if (object.type == 'Group') {
                for (let i = 0; i < object.children.length; ++i) {
                    const child = object.children[i];
                    if (child.material_origin == undefined) {
                        child.material_origin = child.material;
                        child.material = new THREE.MeshBasicMaterial({color:color});
                    }
                }
            } else if (object.type == 'Points') {
                if (object.material_origin == undefined) {
                    object.material_origin = object.material;
                    object.material = new THREE.PointsMaterial({color: color, size: 4.0});
                }
            }
        },
        unselect_object_list(objects) {
            for (let i = 0; i < objects.length; ++i) {
                const object = objects[i];
                this.unselect_object(object);
            }
        },
        unselect_object(object) {
            if (object.type == 'Mesh') {
                if (object.material_origin) {
                    object.material.dispose();
                    object.material = object.material_origin;
                    object.material_origin = undefined;
                }
            } else if (object.type == 'Group') {
                for (let i = 0; i < object.children.length; ++i) {
                    const child = object.children[i];
                    if (child.material_origin) {
                        child.material.dispose();
                        child.material = child.material_origin;
                        child.material_origin = undefined;
                    }
                }
            } else if (object.type == 'Points') {
                if (object.material_origin) {
                    object.material.dispose();
                    object.material = object.material_origin;
                    object.material_origin = undefined;
                }
            }
        },
        /**
         * 飞行动画
         */
        fly_to_object(object) {
            const targetNew = new THREE.Vector3().setFromMatrixPosition(object.matrixWorld);
            const posNew = targetNew.clone().add(new THREE.Vector3(0, 0, 100));

            this.fly_to_position(posNew, targetNew);
        },
        fly_to_position(posNew, targetNew, mini_seconds = 2000) {
            const posOld = camera.position.clone();
            const targetOld = this.orbitCtrl.target.clone();

            this.orbitCtrl.enable = false;
            const tween = new TWEEN.Tween({pos: posOld, target: targetOld})
                .to({pos: posNew, target: targetNew}, mini_seconds)
                .easing(TWEEN.Easing.Linear.None)
                .onUpdate((e) => {
                    camera.position.copy(e.pos);
                    camera.lookAt(e.target);
                })
                .onComplete(() => {
                    this.orbitCtrl.enable = true;
                    this.orbitCtrl.target.copy(targetNew);
                })
                .start()
        },
        /**
         * 闪烁/取消闪烁物体
         */
        set_object_twinkle(object, color) {
            if (object.type =='Group') {
                for (let i = 0; i < object.children.length; ++i) {
                    const child = object.children[i];
                    if (child.type == 'Group') {
                        this.set_object_twinkle(child, color);
                    } else {
                        if (color) {
                            if (child.material_origin == undefined) {
                                child.material_origin = child.material;
                                child.material = new THREE.MeshBasicMaterial({color: color});
                            } else {
                                child.material.dispose();
                                child.material = child.material_origin;
                                child.material_origin = undefined;
                            }
                        } else {
                            if (child.material_origin) {
                                child.material.dispose();
                                child.material = child.material_origin;
                                child.material_origin = undefined;
                            }
                        }
                    }
                }
            } else if (object.type == 'Mesh') {
                if (color) {
                    if (object.material_origin == undefined) {
                        object.material_origin = object.material;
                        object.material = new THREE.MeshBasicMaterial({color: color});
                    } else {
                        object.material.dispose();
                        object.material = object.material_origin;
                        object.material_origin = undefined;
                    }
                } else {
                    if (object.material_origin) {
                        object.material.dispose();
                        object.material = object.material_origin;
                        object.material_origin = undefined;
                    }
                }
            }
        },
        /**
         * 闪烁物体
         */
        twinkle_object(object) {
            const name = object.name;
            let index = this.scene_data.twinkles.findIndex((item) => {
                return item.name == name;
            });
            if (index != -1) {
                return; // 已经存在闪烁
            }
            // 添加新的闪烁
            const twinkle = setInterval(() => {
                this.set_object_twinkle(object, 0xff0000);
            }, 500);
            this.scene_data.twinkles.push({
                name: name,
                tween: twinkle
            });
        },
        /**
         * 取消闪烁物体
         */
        untwinkle_object(object) {
            const name = object.name;
            let index = this.scene_data.twinkles.findIndex((item) => {
                return item.name == name;
            });
            if (index == -1) {
                return; // 不存在闪烁
            }
            const twinkle_item = this.scene_data.twinkles.splice(index, 1)[0];
            clearInterval(twinkle_item.tween);
            this.set_object_twinkle(object, undefined);
        },
        /**
         * 涟漪效果
         */
        ripple_object(object) {
            const name = object.name;
            const index = this.scene_data.ripples.findIndex((item) => {
                return item.name == name;
            });
            if (index != -1) {
                return;
            }
            const worldPosition = new THREE.Vector3().setFromMatrixPosition(object.matrixWorld);
            const rippleInner = new THREE.Mesh(
                new THREE.SphereGeometry(3, 32, 16),
                new THREE.MeshPhongMaterial({color: new THREE.Color(255,0,0), opacity:1, transparent: true})
            );
            rippleInner.position.copy(worldPosition);
            rippleInner.renderOrder = 1;
            scene.add(rippleInner);
            const rippleOuter = new THREE.Mesh(
                new THREE.SphereGeometry(0.1, 32, 16),
                new THREE.MeshPhongMaterial({color: new THREE.Color(255,0,0),opacity:1, transparent: true})
            );
            rippleOuter.position.copy(worldPosition);
            rippleOuter.renderOrder = 1;
            scene.add(rippleOuter);

            const ripple_tween = new TWEEN.Tween({radius: 0, opacity: 0.8})
                .to({radius: 100, opacity: 0}, 1000)
                .easing(TWEEN.Easing.Linear.None)
                .onUpdate((e) => {
                    const {radius, opacity} = e;
                    rippleOuter.material.opacity = opacity;
                    rippleOuter.geometry = new THREE.SphereGeometry(radius, 32, 16);
                })
                .repeat(Infinity)
                .start();
            this.scene_data.ripples.push({
                name: name,
                inner: rippleInner,
                outer: rippleOuter,
                tween: ripple_tween
            });
        },
        /**
         * 取消涟漪效果
         */
        unripple_object(object) {
            const name = object.name;
            const index = this.scene_data.ripples.findIndex((item) => {
                return item.name == name;
            });
            if (index == -1) {
                return;
            }
            const ripple_item = this.scene_data.ripples.splice(index, 1)[0];
            ripple_item.tween.stop();
            ripple_item.tween = undefined;
            scene.remove(ripple_item.inner);
            scene.remove(ripple_item.outer);
        },
        show_ripple_sphere_list(list) {
            for (let i = 0; i < list.length; ++i) {
                const ripple_item = list[i];
                ripple_item.inner.visible = true;
                ripple_item.outer.visible = true;
            }
        },
        hide_ripple_sphere_list(list) {
            for (let i = 0; i < list.length; ++i) {
                const ripple_item = list[i];
                ripple_item.inner.visible = false;
                ripple_item.outer.visible = false;
            }
        },
        /**
         * 蚂蚁线效果
         */
        get_relation_link_by_name(name) {
            let links = [];
            for (let i = 0; i < this.scene_data.link_items.length; ++i) {
                const link_item = this.scene_data.link_items[i];
                const link_name = link_item.name;
                const names = link_name.split('_');
                if (names.includes(name)) {
                    links.push(link_item);
                }
            }
            return links;
        },
        get_relation_object_by_name(name) {
            let objects = [];
            for (let i = 0; i < this.scene_data.link_items.length; ++i) {
                const link_item = this.scene_data.link_items[i];
                const link_name = link_item.name;
                const names = link_name.split('_');
                if (names.includes(name)) {
                    for (let j = 0; j < names.length; ++j) {
                        const temp_name = names[j];
                        if (temp_name == name) {
                            continue;
                        }
                        if (temp_name.indexOf('报警节点') != -1) {
                            // 过滤掉报警节点
                            continue;
                        }
                        const object = scene.getObjectByName(temp_name);
                        if (object) {
                            objects.push(object);
                        }
                    }
                }
            }
            return objects;
        },
        relation_object_by_name(name1, name2, type, is_ipt) {
            const object1 = scene.getObjectByName(name1);
            if (object1 == undefined) {
                console.log('relation_object_by_name: name1 not find');
                return;
            }
            const object2 = scene.getObjectByName(name2);
            if (object2 == undefined) {
                console.log('relation_object_by_name: name2 not find');
                return;
            }
            this.relation_object(object1, object2, type, is_ipt);
        },
        relation_ipt_by_name(name1, name2, list) {
            const link_name = name1 + '_' + name2;
            const insert = new THREE.Vector3();
            const vertices = [];
            const orders = [];
            const outers = [];

            for (let i = 0; i < list.length - 1; ++i) {
                const name1 = list[i].name;
                const name2 = list[i + 1].name;
                const object1 = scene.getObjectByName(name1);
                if (object1 == undefined) {
                    console.log('do not find object1:', name1);
                    continue;
                }
                const object2 = scene.getObjectByName(name2);
                if (object2 == undefined) {
                    console.log('do not find object2:', name2);
                    continue;
                }
                const position1 = new THREE.Vector3().setFromMatrixPosition(object1.matrixWorld);
                const position2 = new THREE.Vector3().setFromMatrixPosition(object2.matrixWorld);
                const length = position1.distanceTo(position2);
                const orderIndex = orders.length;
                for (let i = 0; i < length; ++i) {
                    insert.lerpVectors(position1, position2, i / length);
                    vertices.push(insert.x, insert.y, insert.z);
                    orders.push(i + orderIndex);
                }
                const outer = this.get_link_object(position1, position2, true);
                outers.push(outer);
            }
            const geometryInner = new THREE.BufferGeometry();
            geometryInner.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3 ));
            geometryInner.setAttribute('order', new THREE.Float32BufferAttribute(orders, 1));

            const materialInner = new THREE.ShaderMaterial({
                uniforms: this.relation_uniforms,
                vertexShader: RelationLineVert2,
                fragmentShader: RelationLineFlag2
            })
            const inner = new THREE.Line(geometryInner, materialInner);
            // scene.add(inner);
            // scene.add(outer1, outer2, outer3);

            this.scene_data.link_items_ipt.push({
                name: link_name,
                type: 'qj',
                is_ipt: true,
                inner: inner,
                outer: outers
            });
        },
        show_ipt_link(name) {
            for (let i = 0; i < this.scene_data.link_items_ipt.length; ++i) {
                const link_item_ipt = this.scene_data.link_items_ipt[i];
                if (link_item_ipt.name.includes(name)) {
                    scene.add(link_item_ipt.inner);
                    link_item_ipt.outer.forEach((item) => {
                        scene.add(item);
                    })
                }
            }
        },
        reset_ipt_link() {
            for (let i = 0; i < this.scene_data.link_items_ipt.length; ++i) {
                const link_item_ipt = this.scene_data.link_items_ipt[i];
                scene.remove(link_item_ipt.inner);
                link_item_ipt.outer.forEach((item) => {
                    scene.remove(item);
                })
            }
        },
        show_all_sensor_link() {
            for (let i = 0; i < this.scene_data.link_items.length; ++i) {
                const link_item = this.scene_data.link_items[i];
                link_item.inner.visible = true;
                link_item.outer.forEach((item) => {
                    item.visible = true;
                });
            }
        },
        hide_all_sensor_link() {
            for (let i = 0; i < this.scene_data.link_items.length; ++i) {
                const link_item = this.scene_data.link_items[i];
                link_item.inner.visible = false;
                link_item.outer.forEach((item) => {
                    item.visible = false;
                });
            }
        },
        unrelation_object_by_name() {
            const object1 = scene.getObjectByName(name1);
            if (object1 == undefined) return;
            const object2 = scene.getObjectByName(name2);
            if (object2 == undefined) return;
            this.unrelation_object(object1, object2);
        },
        get_link_object(position1, position2, is_ipt) {
            const length = position1.distanceTo(position2);
            const geometryOuter = new THREE.CylinderGeometry( settings3D.link_width, settings3D.link_width, length, 24 );
            let color = settings3D.link_color;
            if (is_ipt) {
                color = settings3D.link_color_ipt;
            }
            const materialOuter = new THREE.MeshBasicMaterial({
                color: color,
                opacity: settings3D.link_opacity,
                transparent: true
            });
            const outer = new THREE.Mesh(geometryOuter, materialOuter);
            const center = new THREE.Vector3().addVectors(position1, position2).multiplyScalar(0.5);
            const matrix = new THREE.Matrix4().lookAt(position2, position1, THREE.Object3D.DefaultUp);
            outer.position.copy(center);
            outer.quaternion.setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI / 2);
            const quaternion_new = new THREE.Quaternion().setFromRotationMatrix(matrix);
            outer.quaternion.premultiply(quaternion_new);
            outer.updateMatrix();
            return outer;
        },
        relation_object(object1, object2, type, is_ipt) {
            const height = 20;
            // if (is_ipt) {
            //     this.relation_object_ipt(object1, object2, type);
            //     return;
            // }
            const link_name = object1.name + '_' + object2.name;
            const index = this.scene_data.link_items.findIndex((item) => {
                return item.name == link_name;
            });
            if (index != -1) {
                return;
            }
            const position1 = new THREE.Vector3().setFromMatrixPosition(object1.matrixWorld);
            const position2 = new THREE.Vector3(position1.x, height, position1.z);
            const position4 = new THREE.Vector3().setFromMatrixPosition(object2.matrixWorld);
            const position3 = new THREE.Vector3(position4.x, height, position4.z);

            const length1 = position1.distanceTo(position2);
            const length2 = position2.distanceTo(position3);
            const length3 = position3.distanceTo(position4);

            const insert = new THREE.Vector3();
            const vertices = [];
            const orders = [];
            
            for (let i = 0; i < length1; ++i) {
                insert.lerpVectors(position1, position2, i / length1);
                vertices.push(insert.x, insert.y, insert.z);
                orders.push(i);
            }
            const count1 = orders.length;
            for (let i = 0; i < length2; ++i) {
                insert.lerpVectors(position2, position3, i / length2);
                vertices.push(insert.x, insert.y, insert.z);
                orders.push(count1 + i);
            }
            const count2 = orders.length;
            for (let i = 0; i < length3; ++i) {
                insert.lerpVectors(position3, position4, i / length3);
                vertices.push(insert.x, insert.y, insert.z);
                orders.push(count2 + i);
            }
            const geometryInner = new THREE.BufferGeometry();
            geometryInner.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3 ));
            geometryInner.setAttribute('order', new THREE.Float32BufferAttribute(orders, 1));

            const materialInner = new THREE.ShaderMaterial({
                uniforms: this.relation_uniforms,
                vertexShader: RelationLineVert2,
                fragmentShader: RelationLineFlag2
            })
            const inner = new THREE.Line(geometryInner, materialInner);
            scene.add(inner);

            const outer1 = this.get_link_object(position1, position2, is_ipt);
            const outer2 = this.get_link_object(position2, position3, is_ipt);
            const outer3 = this.get_link_object(position3, position4, is_ipt);
            scene.add(outer1, outer2, outer3);

            this.scene_data.link_items.push({
                name: link_name,
                type: type,
                is_ipt: is_ipt,
                inner: inner,
                outer: [outer1, outer2, outer3]
            });
        },
        relation_object_ipt(object1, object2, type) {
            const link_name = object1.name + '_' + object2.name;
            const index = this.scene_data.link_items.findIndex((item) => {
                return item.name == link_name;
            });
            if (index != -1) {
                return;
            }
            const position1 = new THREE.Vector3().setFromMatrixPosition(object1.matrixWorld);
            const position2 = new THREE.Vector3().setFromMatrixPosition(object2.matrixWorld);

            const length = position1.distanceTo(position2);

            const insert = new THREE.Vector3();
            const vertices = [];
            const orders = [];

            for (let i = 0; i < length; ++i) {
                insert.lerpVectors(position1, position2, i / length);
                vertices.push(insert.x, insert.y, insert.z);
                orders.push(i);
            }
            const geometryInner = new THREE.BufferGeometry();
            geometryInner.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3 ));
            geometryInner.setAttribute('order', new THREE.Float32BufferAttribute(orders, 1));

            const materialInner = new THREE.ShaderMaterial({
                uniforms: this.relation_uniforms,
                vertexShader: RelationLineVert2,
                fragmentShader: RelationLineFlag2
            })
            const inner = new THREE.Line(geometryInner, materialInner);
            scene.add(inner);

            const outer = this.get_link_object(position1, position2, true);
            scene.add(outer);

            this.scene_data.link_items.push({
                name: link_name,
                type: type,
                is_ipt: true,
                inner: inner,
                outer: [outer]
            });
        },
        unrelation_object(object1, object2) {
            const link_name = object1.name + '_' + object2.name;
            const index = this.scene_data.link_items.findIndex((item) => {
                return item.name == link_name;
            });
            if (index != -1) {
                return;
            }
            const link_item = this.scene_data.link_items.splice(index, 1)[0];
            scene.remove(link_item.inner);
            link_item.outer.forEach((item) => {
                scene.remove(item);
            });
        },
        show_relation_link_by_type(type) {
            if (!this.scene_types.includes(type)) {
                console.error('type is not valid:', type);
                return;
            }
            if (this.mode == 'gis') {
                return;
            }
            // console.log('show_relation_link_by_type:', type);
            for (let i = 0; i < this.scene_data.link_items.length; ++i) {
                const link_item = this.scene_data.link_items[i];
                if (link_item.type == type) {
                    // console.log('show type:', link_item.type);
                    link_item.inner.visible = true;
                    // link_item.outer.visible = true;
                    link_item.outer.forEach((item) => {
                        item.visible = true;
                    });
                } else {
                    // console.log('hide type:', link_item.type);
                    link_item.inner.visible = false;
                    // link_item.outer.visible = false;
                    link_item.outer.forEach((item) => {
                        item.visible = false;
                    });
                }
            }
            // 新增盒子的隐藏
            // const ipt_names = ['雾汇聚桥节点1', '雾汇聚桥节点2', '直流电源节点1', '直流电源节点2'];
            // for (let i = 0; i < ipt_names.length; ++i) {
            //     const ipt_name = ipt_names[i];
            //     const object = scene.getObjectByName(ipt_name);
            //     if (object) {
            //         object.visible = false;
            //     }
            // }
            
            for (let i = 0; i < this.scene_data.link_items.length; ++i) {
                const link_item = this.scene_data.link_items[i];
                const link_name = link_item.name;
                const names = link_name.split('_');
                for (let j = 0; j < names.length; ++j) {
                    const object_name = names[j];
                    const object = scene.getObjectByName(object_name);
                    if (object) {
                        object.visible = false;
                    }
                }
            }
            for (let i = 0; i < this.scene_data.link_items.length; ++i) {
                const link_item = this.scene_data.link_items[i];
                if (link_item.type != type) {
                    continue;
                }
                const link_name = link_item.name;
                const names = link_name.split('_');
                for (let j = 0; j < names.length; ++j) {
                    const object_name = names[j];
                    const object = scene.getObjectByName(object_name);
                    if (object) {
                        object.visible = true;
                    }
                }
            }
            // '特高频局放', '高频局放', '超声局放', '接地电流', '温度', '振动'
            // const target_name = this.get_ipt_by_type(type);
            // if (target_name == undefined) {
            //     return;
            // }
            // const target = scene.getObjectByName(target_name);
            // if (target == undefined) {
            //     return;
            // }
            // const target_position = new THREE.Vector3().setFromMatrixPosition(target.matrixWorld);
            // const camera_position = new THREE.Vector3(0, 200, 0);
            // if (Math.abs(target_position.x) >= Math.abs(target_position.z)) {
            //     camera_position.z = target_position.z;
            //     if (target_position.x >= 0) {
            //         camera_position.x = target_position.x + 200;
            //     } else {
            //         camera_position.x = target_position.x - 200;
            //     }
            // } else {
            //     camera_position.x = target_position.x;
            //     if (target_position.z >= 0) {
            //         camera_position.z = target_position.z + 200;
            //     } else {
            //         camera_position.z = target_position.z - 200;
            //     }
            // }
            // console.log('new position:', camera_position, ', new target:', target_position);
            // this.fly_to_position(camera_position, target_position);
            
            // if (type == '特高频局放') {
            //     this.fly_to_position(new THREE.Vector3(settings3D.camera_distance, 600, 0), new THREE.Vector3(0, 0, 0));
            // } else if (type == '高频局放') {
            //     this.fly_to_position(new THREE.Vector3(settings3D.camera_distance * scale, 600, settings3D.camera_distance * scale), new THREE.Vector3(0, 0, 0));
            // } else if (type == '超声局放') {
            //     this.fly_to_position(new THREE.Vector3(0, 600, settings3D.camera_distance), new THREE.Vector3(0, 0, 0));
            // } else if ('接地电流' == type) {
            //     this.fly_to_position(new THREE.Vector3(settings3D.camera_distance * scale, 600, (-settings3D.camera_distance+100) * scale), new THREE.Vector3(0, 0, 0));
            // } else if ('温度' == type) {
            //     this.fly_to_position(new THREE.Vector3((-settings3D.camera_distance+100) * scale, 600, settings3D.camera_distance*scale), new THREE.Vector3(0, 0, 0));
            // } else if ('振动' == type) {
            //     this.fly_to_position(new THREE.Vector3(-settings3D.camera_distance, 600, 0), new THREE.Vector3(0, 0, 0));
            // }
        },
        get_ipt_by_type(type) {
            for (let i = 0; i < this.scene_data.relation_trees.length; ++i) {
                const item_level_1 = this.scene_data.relation_trees[i];
                for (let j = 0; j < item_level_1.children.length; ++j) {
                    const item_level_2 = item_level_1.children[j];
                    if (item_level_2.type == type) {
                        return item_level_2.name;
                    }
                }
            }
            return undefined;
        },
        reset_relation_object() {
            if (this.mode == 'gis') {
                return;
            }
            for (let i = 0; i < this.scene_data.link_items.length; ++i) {
                const link_item = this.scene_data.link_items[i];
                link_item.inner.visible = true;
                // link_item.outer.visible = true;
                link_item.outer.forEach((item) => {
                    item.visible = true;
                })
            }
            // 新增盒子的隐藏
            // const ipt_names = ['雾汇聚桥节点1', '雾汇聚桥节点2', '直流电源节点1', '直流电源节点2'];
            // for (let i = 0; i < ipt_names.length; ++i) {
            //     const ipt_name = ipt_names[i];
            //     const object = scene.getObjectByName(ipt_name);
            //     if (object) {
            //         object.visible = true;
            //     }
            // }
            for (let i = 0; i < this.scene_data.link_items.length; ++i) {
                const link_item = this.scene_data.link_items[i];
                const link_name = link_item.name;
                const names = link_name.split('_');
                for (let j = 0; j < names.length; ++j) {
                    const object_name = names[j];
                    const object = scene.getObjectByName(object_name);
                    if (object) {
                        object.visible = true;
                    }
                }
            }
            this.fly_to_position(new THREE.Vector3(0, 600, settings3D.camera_distance), new THREE.Vector3(0, 0, 0));
        },
        select_link_list(list, color) {
            for (let i = 0; i < list.length; ++i) {
                const link_item = list[i];
                let temp_color = undefined;
                if (color == undefined) {
                    if (link_item.is_ipt) {
                        temp_color = settings3D.link_select_ipt;
                    } else {
                        temp_color = settings3D.link_select;
                    }
                } else {
                    temp_color = color;
                }
                // link_item.outer.material.color.set(temp_color);
                link_item.outer.forEach((item) => {
                    item.material.color.set(temp_color);
                });
            }
        },
        unselect_link_list(list) {
            for (let i = 0; i < list.length; ++i) {
                const link_item = list[i];
                if (link_item.is_ipt) {
                    // link_item.outer.material.color.set(settings3D.link_color_ipt);
                    link_item.outer.forEach((item) => {
                        item.material.color.set(settings3D.link_color_ipt);
                    });
                } else {
                    // link_item.outer.material.color.set(settings3D.link_color);
                    link_item.outer.forEach((item) => {
                        item.material.color.set(settings3D.link_color);
                    });
                }
            }
        },
        // 设置物体的维修状态
        repair_object_by_name(name) {
            const object = scene.getObjectByName(name);
            if (object == undefined) {
                return;
            }
            this.repair_object(object);
        },
        repair_object(object) {
            const name = object.name;
            const index = this.scene_data.repairs.findIndex((item) => {
                return item.name == name;
            });
            if (index != -1) {
                return;
            }
            this.select_object(object, settings3D.repair_color);
            const sprite = this.add_object_sprite(object);
            const links = this.get_relation_link_by_name(name);
            console.log('links:', links);
            this.select_link_list(links, settings3D.repair_color);
            this.scene_data.repairs.push({
                name: name,
                sprite: sprite
            });
        },
        show_repair_sprite_list(list) {
            for (let i = 0; i < list.length; ++i) {
                const repair_item = list[i];
                repair_item.sprite.visible = true;
            }
        },
        hide_repair_sprite_list(list) {
            for (let i = 0; i < list.length; ++i) {
                const repair_item = list[i];
                repair_item.sprite.visible = false;
            }
        },
        unrepair_object_by_name(name) {
            const object = scene.getObjectByName(name);
            if (object == undefined) {
                return;
            }
            this.unrepair_object(object);
        },
        unrepair_object(object) {
            const name = object.name;
            const index = this.scene_data.repairs.findIndex((item) => {
                return item.name == name;
            });
            if (index == -1) {
                return;
            }
            this.unselect_object(object);
            const links = this.get_relation_link_by_name(name);
            this.unselect_link_list(links);
            const repair_item = this.scene_data.repairs.splice(index, 1)[0];
            scene.remove(repair_item.sprite);
        },
        /**
         * 添加sprite
         */
        add_object_sprite(object) {
            const position = new THREE.Vector3().setFromMatrixPosition(object.matrixWorld);
            // console.log('sprite position:', position);
            position.y += 25;
            const map = new THREE.TextureLoader().load('/static/icon/repair.png');
            const material = new THREE.SpriteMaterial({map: map});
            const sprite = new THREE.Sprite( material );
            sprite.position.copy(position);
            sprite.scale.setScalar(10);
            sprite.name = object.name + '_repair';
            scene.add(sprite);
            return sprite;
        },
        set_camera_position(x, y, z) {
            camera.position.set(x, y, z);
        },
        set_camera_target(x, y, z) {
            const target = new THREE.Vector3(x, y, z);
            camera.lookAt(target);
            this.orbitCtrl.target.copy(target);
        },
        get_camera_info() {
            if (this.orbitCtrl == undefined) {
                return;
            }
            if (camera == undefined) {
                return;
            }
            const target = this.orbitCtrl.target.clone();
            const position = camera.position.clone();
            return {
                target,
                position
            };
        },
    }
}
</script>

<style lang="scss" scoped>
.viewer-container {
    position: relative;
    width: 100%;
    height: 100%;
    margin: 0;
    .viewer-item {
        position: relative;
        width: 100%;
        height: 100%;
    }
}
</style>