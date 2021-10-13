<template>
    <div class="viewer-container">
        <div class="viewer-item" ref="viewerRef" @click="mouse_event_click"></div>
    </div>
</template>

<script>
import * as THREE from '@/three/build/three.module.js';
import Stats from '@/three/examples/jsm/libs/stats.module.js';
import { OrbitControls } from '@/three/examples/jsm/controls/OrbitControls.js';
import { FBXLoader } from '@/three/examples/jsm/loaders/FBXLoader.js';
// 动画需要
const TWEEN = require('@tweenjs/tween.js');
// 蚂蚁线shader
import RelationLineVert  from '@/shaders/relationLineVert.glsl.js';
import RelationLineFlag from '@/shaders/relationLineFlag.glsl.js';

// threejs全局变量，不放在data中，有利于渲染速度
let scene = undefined;
let camera = undefined;
let renderer = undefined;
let stats = undefined;
// 射线选择器
let raycaster = undefined;

export default {
    data() {
        return {
            byqModels: [],
            twinkle_tween: undefined, // 闪烁
            twinkle_index: 0,
            ripple_tween: undefined, // 涟漪
            rippleInner: undefined, // 涟漪
            rippleOuter: undefined, // 涟漪
            // 蚂蚁线
            relations: {
                time: {
                    value: 0.0
                }
            },
            need_relation: true,
            // 选中的物体
            selectedObject: undefined,
            canSelected: false, // 是否开启选中事件

            orbitCtrl: undefined, // scene操作控件
        }
    },
    mounted() {
        this.init3D();
        this.loadModel('/static/model/byq2014_007.FBX');
    },
    methods: {
        /**
         * 获得画布大小
         */
        getRenderRect() {
            let width = this.$refs.viewerRef.clientWidth;
            let height = this.$refs.viewerRef.clientHeight;
            width = Math.floor(width);
            height = Math.floor(height);
            console.log('width:', width, ', height:', height);
            return {
                width: width - 1,
                height: height - 1
            }
        },
        /**
         * 初始化三维场景
         */
        init3D() {
            const rect = this.getRenderRect();
            camera = new THREE.PerspectiveCamera( 50, rect.width / rect.height, 0.01, 1000000 );
            camera.position.set( 0, 600, 600 );
            camera.lookAt(new THREE.Vector3(0, 0, 0));

            scene = new THREE.Scene();
            // 天空盒子
            const path = "/static/img/cube/dark-s_";
            const format = '.jpg';
            const urls = [
                path + 'px' + format,path + 'nx' + format,
                path + 'py' + format,path + 'ny' + format,
                path + 'pz' + format,path + 'nz' + format,
            ];
            const textureCube = new THREE.CubeTextureLoader().load(urls);
            scene.background = textureCube;
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
            this.orbitCtrl.update();

            window.addEventListener('resize', this.on_window_resize, false);
            // stats
            stats = new Stats();
            this.$refs.viewerRef.appendChild( stats.dom );
            // 监听事件
            raycaster = new THREE.Raycaster();
            // 进入渲染循环
            this.animate();
        },
        loadModel(url) {
            const loader = new FBXLoader();
            loader.load(url, (object) => {
                console.log('load fbx data:', object);
                object.renderOrder = 10;
                scene.add(object);
            });
        },
        mouse_event_click(e) {
            if (!this.canSelected) {return;}
            // 之前有选中的物体，则回退物体的颜色
            if (this.selectedObject) {
                if (this.selectedObject.material.color_select) {
                    this.selectedObject.material.color = this.selectedObject.material.color_select.clone();
                    this.selectedObject.material.color_select = undefined;
                }
            }
            const {offsetX, offsetY} = e;
            const rect = this.getRenderRect();
            const pointer = {
                x: (offsetX / rect.width) * 2 - 1,
                y: -(offsetY / rect.height) * 2 + 1
            }
            raycaster.setFromCamera( pointer, camera );
            const intersects = raycaster.intersectObject( scene, true );
            if (intersects.length > 0) {
                console.log('intersects:', intersects);
                const res = intersects.filter( function (res) {
                    return res && res.object;
                })[0];
                if (res && res.object) {
                    this.selectedObject = res.object;
                    this.selectedObject.material.color_select = this.selectedObject.material.color.clone();
                    this.selectedObject.material.color.set('#f00');

                    // 释放选中事件
                    this.$emit('object-select', res.object.name);
                }
            } else {
                console.log('no intersects');
            }
        },
        on_window_resize() {
            const rect = this.getRenderRect();
            camera.aspect = rect.width / rect.height;
            camera.updateProjectionMatrix();

            renderer.setSize( rect.width, rect.height );
        },
        animate() {
            requestAnimationFrame( this.animate );
            renderer.render( scene, camera );
            stats.update();
            TWEEN.update();

            // uniform
            if (this.need_relation) {
                let newTime = this.relations.time.value + 0.5;
                if (newTime > 100) {newTime = 0;}
                this.relations.time.value = newTime;
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
        set_object_color(object, color) {
            if (object.type == 'Group') {
                for (let i = 0; i < object.children.length; ++i) {
                    const child = object.children[i];
                    if (child.type == 'Group') {
                        this.set_object_color(child, color);
                    } else if (child.type == 'Mesh') {
                        child.material.color.set(color);
                    }
                }
            } else if (object.type == 'Mesh') {
                object.material.color.set(color);
            }
        },
        set_object_visible(object, visible) {
            // if (object.type == 'Group') {
            //     for (let i = 0; i < object.children.length; ++i) {
            //         const child = object.children[i];
            //         if (child.type == 'Group') {
            //             this.set_object_visible(child, visible);
            //         } else if (child.type == 'Mesh') {
            //             child.visible = visible;
            //         }
            //     }
            // } else if (object.type == 'Mesh') {
            //     object.visible = visible;
            // }
            object.visible = visible;
        },
        set_object_emissive(object, color, intensity = 5.0) {
            if (object.type == 'Group') {
                for (let i = 0; i < object.children.length; ++i) {
                    const child = object.children[i];
                    if (child.type == 'Group') {
                        this.set_object_emissive(child, color);
                    } else if (child.type == 'Mesh') {
                        child.material.emissive.set(color);
                        child.material.emissiveIntensity = intensity;
                    }
                }
            } else if (object.type == 'Mesh') {
                object.material.emissive.set(color);
                object.material.emissiveIntensity = intensity;
            }
        },
        /**
         * 飞行动画
         */
        fly_to_object(object) {
            const posOld = camera.position.clone();
            const targetOld = this.orbitCtrl.target.clone();

            // const targetNew = object.position.clone().applyMatrix4(object.matrixWorld);
            const targetNew = new THREE.Vector3().setFromMatrixPosition(object.matrixWorld);
            const posNew = targetNew.clone().add(new THREE.Vector3(0, 0, 100));

            this.orbitCtrl.enable = false;
            const tween = new TWEEN.Tween({pos: posOld, target: targetOld})
                .to({pos: posNew, target: targetNew}, 2000)
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
         * 闪烁物体
         */
        set_object_twinkle(object, color) {
            if (object.type =='Group') {
                for (let i = 0; i < object.children.length; ++i) {
                    const child = object.children[i];
                    if (child.type == 'Group') {
                        this.set_object_twinkle(child, color);
                    } else {
                        if (color) {
                            if (child.material.color_origin == undefined) {
                                child.material.color_origin = child.material.color.clone();
                                child.material.color.set(color);
                            } else {
                                child.material.color.copy(child.material.color_origin);
                                child.material.color_origin = undefined;
                            }
                        } else {
                            if (child.material.color_origin) {
                                child.material.color.copy(child.material.color_origin);
                                child.material.color_origin = undefined;
                            }
                        }
                    }
                }
            } else if (object.type == 'Mesh') {
                if (color) {
                    if (object.material.color_origin == undefined) {
                        object.material.color_origin = object.material.color.clone();
                        object.material.color.set(color);
                    } else {
                        object.material.color.copy(object.material.color_origin);
                        object.material.color_origin = undefined;
                    }
                } else {
                    if (object.material.color_origin) {
                        object.material.color.copy(child.material.color_origin);
                        object.material.color_origin = undefined;
                    }
                }
            }
        },
        twinkle_object(object) {
            if (this.twinkle_tween == undefined) {
                this.twinkle_tween = setInterval(() => {
                    this.set_object_twinkle(object, 0xff0000);
                }, 500)
            } else {
                clearInterval(this.twinkle_tween);
                this.set_object_twinkle(object, undefined);
                this.twinkle_tween = undefined;
            }
        },
        /**
         * 涟漪效果
         */
        ripple_object(object) {
            if (this.ripple_tween == undefined) {
                // const worldPosition = object.position.clone().applyMatrix4(object.matrixWorld);
                const worldPosition = new THREE.Vector3().setFromMatrixPosition(object.matrixWorld);
                console.log('ripple_object position:', worldPosition);
                if (this.rippleInner == undefined) {
                    this.rippleInner = new THREE.Mesh(
                        new THREE.SphereGeometry(3, 32, 16),
                        new THREE.MeshPhongMaterial({color: new THREE.Color(255,0,0), opacity:1, transparent: true})
                    );
                    this.rippleInner.position.copy(worldPosition);
                    this.rippleInner.renderOrder = 1;
                    scene.add(this.rippleInner);
                } else {
                    scene.add(this.rippleInner);
                }
                if (this.rippleOuter == undefined) {
                    this.rippleOuter = new THREE.Mesh(
                        new THREE.SphereGeometry(0.1, 32, 16),
                        new THREE.MeshPhongMaterial({color: new THREE.Color(255,0,0),opacity:1, transparent: true})
                    );
                    this.rippleOuter.position.copy(worldPosition);
                    this.rippleOuter.renderOrder = 1;
                    scene.add(this.rippleOuter);
                } else {
                    scene.add(this.rippleOuter);
                }
                this.ripple_tween = new TWEEN.Tween({radius: 0, opacity: 0.8})
                    .to({radius: 100, opacity: 0}, 1000)
                    .easing(TWEEN.Easing.Linear.None)
                    .onUpdate((e) => {
                        const {radius, opacity} = e;
                        this.rippleOuter.material.opacity = opacity;
                        this.rippleOuter.geometry = new THREE.SphereGeometry(radius, 32, 16);
                    })
                    .repeat(Infinity)
                    .start();
            } else {
                scene.remove(this.rippleInner);
                scene.remove(this.rippleOuter);
                this.ripple_tween.stop();
                this.ripple_tween = undefined;
            }
        },
        /**
         * 蚂蚁线效果
         */
        relation_object(object1, object2) {
            const link_name = object1.name + '_' + object2.name;
            const link_object = this.getObjectByName(link_name); 
            if (link_object) {
                return;
            }
            const position1 = new THREE.Vector3().setFromMatrixPosition(object1.matrixWorld);
            const position2 = new THREE.Vector3().setFromMatrixPosition(object2.matrixWorld);
            console.log('relation_object position1:', position1, ', position2:', position2);
            const insert = new THREE.Vector3();
            const vertices = [];
            const orders = [];
            for (let i = 0; i < 100; ++i) {
                insert.lerpVectors(position1, position2, i / 100);
                vertices.push(insert.x, insert.y, insert.z);
                orders.push(i);
            }
            const geometry = new THREE.BufferGeometry();
            geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
            geometry.setAttribute( 'order', new THREE.Float32BufferAttribute( orders, 1 ) );

            const shaderMaterial = new THREE.ShaderMaterial({
                uniforms: this.relations,
                vertexShader: RelationLineVert,
                fragmentShader: RelationLineFlag
            })
            const mesh = new THREE.Points( geometry, shaderMaterial );
            mesh.name = object1.name + '_' + object2.name;
            scene.add( mesh );
        },
        remove_relation_object(object1, object2) {
            const link_name = object1.name + '_' + object2.name;
            const link_object = this.getObjectByName(link_name);
            if (link_object) {
                scene.remove(link_object);
            }
        },
        coordinateToScreen(position) {
            const positionCopy = position.clone();
            const screen = positionCopy.project(camera);
            const a = window.innerWidth / 2;
            const b = window.innerHeight / 2;
            let outPos = new THREE.Vector3(0,0,0);
            outPos.x = Math.round(screen.x * a + a);
            outPos.y = Math.round(screen.y * b + b);
            return outPos;
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