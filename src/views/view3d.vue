<template>
    <div class="page-container">
        <div class="view-item" ref="mian3dRef"></div>

        <div class="left-wrap">
            <div class="btn-item" @click="test_function1">飞行动画测试</div>
            <div class="btn-item" @click="test_function2">透明度切换</div>
            <div class="btn-item" @click="test_function3">闪烁效果/取消</div>
            <div class="btn-item" @click="test_function4">涟漪效果/取消</div>
        </div>
    </div>
</template>

<script>
import * as THREE from '@/three/build/three.module.js';
import Stats from '@/three/examples/jsm/libs/stats.module.js';
import { OrbitControls } from '@/three/examples/jsm/controls/OrbitControls.js';
import { FBXLoader } from '@/three/examples/jsm/loaders/FBXLoader.js';

const TWEEN = require('@tweenjs/tween.js')
// threejs全局变量，不放在data中，有利于渲染速度
let scene = undefined;
let camera = undefined;
let renderer = undefined;
let stats = undefined;

let orbitCtrl = undefined;
// let defaultUp = new THREE.Vector3(0, 1, 0);

export default {
    data() {
        return {
            byqModels: [],
            fly_tween: undefined,
            twinkle_tween: undefined,
            ripple_tween: undefined,
            sphereList: [],
            sphereInner: undefined,
            sphereOuter: undefined
        }
    },
    mounted() {
        this.init3D();
        this.loadModel('/static/model/byq2014_02.FBX');
    },
    methods: {
        loadModel(url) {
            const loader = new FBXLoader();
            loader.load(url, ( object ) => {
                console.log('load fbx data:', object);
                // while (object.children.length > 0) {
                //     const item = object.children[0];
                //     scene.add(item);
                // }
                this.byqModels = object.children;
                scene.add( object );
            } );
        },
        getRenderRect() {
            const width = this.$refs.mian3dRef.clientWidth;
            const height = this.$refs.mian3dRef.clientHeight;
            console.log('width:', width, ', height:', height);
            return {
                width: width,
                height: height
            }
        },
        init3D() {
            camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.01, 1000000 );
            camera.position.set( 600, 600, 600 );
            camera.lookAt(new THREE.Vector3(0, 0, 0));

            scene = new THREE.Scene();
            // const texture = new THREE.TextureLoader().load('/static/img/bkg_02.jpeg');
            // texture.wrapS = THREE.RepeatWrapping;
            // texture.wrapT = THREE.RepeatWrapping;
            // texture.repeat.set(2, 2);
            // texture.offset.set(0, 0);
            // texture.anisotropy = 16;
            // scene.background = texture;

            const hemiLight = new THREE.HemisphereLight( 0xcccccc, 0x404040 );
            hemiLight.position.set( 0, 200, 0 );
            scene.add( hemiLight );

            // const dirLight = new THREE.DirectionalLight( 0xffffff );
            // dirLight.position.set( 0, 200, 100 );
            // dirLight.castShadow = true;
            // dirLight.shadow.camera.top = 180;
            // dirLight.shadow.camera.bottom = - 100;
            // dirLight.shadow.camera.left = - 120;
            // dirLight.shadow.camera.right = 120;
            // scene.add( dirLight );

            const ambientLight = new THREE.AmbientLight( 0x404040 );
            scene.add(ambientLight);

            renderer = new THREE.WebGLRenderer( { antialias: true } );
            renderer.setPixelRatio( window.devicePixelRatio );
            // const rectSize = this.getRenderRect();
            renderer.setSize( window.innerWidth, window.innerHeight );
            // renderer.shadowMap.enabled = true;
            this.$refs.mian3dRef.appendChild(renderer.domElement);

            this.orbitCtrl = new OrbitControls( camera, renderer.domElement );
            this.orbitCtrl.target.set( 0, 0, 0 );
            this.orbitCtrl.update();

            window.addEventListener( 'resize', this.on_window_resize );
            // stats
            stats = new Stats();
            this.$refs.mian3dRef.appendChild( stats.dom );

            this.animate();
        },
        on_window_resize() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();

            renderer.setSize( window.innerWidth, window.innerHeight );
        },
        animate() {
            requestAnimationFrame( this.animate );

            renderer.render( scene, camera );

            stats.update();

            TWEEN.update();
        },
        fly_to_object(targetNew) {
            const posOld = camera.position.clone();
            const targetOld = this.orbitCtrl.target.clone();
            console.log('old pos:', posOld, ', target:', targetOld);

            const posNew = targetNew.clone().add(new THREE.Vector3(100, 0, 100));
            
            console.log('new pos:', posNew, ', target:', targetNew);
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
        twinkle_object(object) {
            if (this.twinkle_tween == undefined) {
                this.twinkle_tween = setInterval(() => {
                    if (object.material.color_origin == undefined) {
                        object.material.color_origin = object.material.color.clone();
                        object.material.color.setRGB(255,0,0);
                    } else {
                        object.material.color = object.material.color_origin.clone();
                        delete object.material.color_origin;
                        object.material.color_origin = undefined;
                    }
                }, 500)
            } else {
                if (object.material.color_origin != undefined) {
                    object.material.color = object.material.color_origin.clone();
                    delete object.material.color_origin;
                    object.material.color_origin = undefined;
                }
                
                clearInterval(this.twinkle_tween);
                this.twinkle_tween = undefined;
            }
            
        },
        /**
         * 涟漪效果
         */
        ripple_object(object) {
            
            if (this.ripple_tween == undefined) {
                if (this.sphereInner == undefined) {
                    this.sphereInner = new THREE.Mesh(
                        new THREE.SphereGeometry(3, 32, 16),
                        new THREE.MeshBasicMaterial({color: new THREE.Color(255,0,0),opacity:1, transparent: true})
                    )
                    this.sphereInner.position.copy(object.position);
                    scene.add(this.sphereInner);
                } else {
                    scene.add(this.sphereInner);
                }
                if (this.sphereOuter == undefined) {
                    this.sphereOuter = new THREE.Mesh(
                        new THREE.SphereGeometry(0.1, 32, 16),
                        new THREE.MeshBasicMaterial({color: new THREE.Color(255,0,0),opacity:1, transparent: true})
                    );
                    this.sphereOuter.position.copy(object.position);
                    scene.add(this.sphereOuter);
                } else {
                    scene.add(this.sphereOuter);
                }
                this.ripple_tween = new TWEEN.Tween({radius: 0, opacity: 0.8})
                    .to({radius: 50, opacity: 0})
                    .easing(TWEEN.Easing.Linear.None)
                    .onUpdate((e) => {
                        const {radius, opacity} = e;
                        this.sphereOuter.material.opacity = opacity;
                        this.sphereOuter.geometry = new THREE.SphereGeometry(radius, 32, 16);
                    })
                    .repeat(Infinity)
                    .start();
            } else {
                scene.remove(this.sphereInner);
                this.sphereInner = undefined;
                scene.remove(this.sphereOuter);
                this.sphereOuter = undefined;
                this.ripple_tween.stop();
                this.ripple_tween = undefined;
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
        test_function1() {
            for (let i = 0; i < this.byqModels.length; ++i) {
                const children = this.byqModels[i];
                
                if (children.name == '特高频局放器') {
                    console.log('scene children:', children);
                    const position = children.position;
                    this.fly_to_object(position);
                    break;
                }
            }
        },
        test_function2() {
            for (let i = 0; i < this.byqModels.length; ++i) {
                const children = this.byqModels[i];
                
                if (children.name == 'Line002') {
                    children.material.transparent = true;
                    if (children.material.opacity == 1.0) {
                        children.material.opacity = 0.1;
                    } else {
                        children.material.opacity = 1.0;
                    }
                    
                    break;
                }
            }
        },
        test_function3() {
            for (let i = 0; i < this.byqModels.length; ++i) {
                const children = this.byqModels[i];
                
                if (children.name == '振动器') {
                    children.material.transparent = true;
                    
                    this.twinkle_object(children);
                    break;
                }
            }
        },
        test_function4() {
            for (let i = 0; i < this.byqModels.length; ++i) {
                const children = this.byqModels[i];
                
                if (children.name == '六个超声局放') {
                    children.material.transparent = true;
                    
                    this.ripple_object(children);
                    break;
                }
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.page-container {
    position: relative;
    width: 100%;
    height: 100%;
    .view-item {
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
}
</style>