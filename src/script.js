import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper.js';


/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Lights
 */
// uniform light everything, from every place
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)
const ambientGui = gui.addFolder('ambient').close()
ambientGui.add(ambientLight, 'intensity').min(0).max(1).step(0.01).name('intensity')
ambientGui.add(ambientLight, 'visible').name('enable')

const directionalLight = new THREE.DirectionalLight(0x00fffc, 0.3)
directionalLight.position.set(1, 0.5, 0)
scene.add(directionalLight)
const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight)
directionalLightHelper.visible = false
scene.add(directionalLightHelper)

const directionalGui = gui.addFolder('directional').close()
directionalGui.add(directionalLight, 'intensity').min(0).max(1).step(0.01).name('intensity')
directionalGui.add(directionalLight, 'visible').name('enable')
directionalGui.add(directionalLightHelper, 'visible').name('directionalLightHelper')

// red from the top, blue from the bottom, mix in middle
// usefull for bouncing light with multiple colors
const hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff, 0.3)
scene.add(hemisphereLight)
const hemisphereLightHelper = new THREE.HemisphereLightHelper(hemisphereLight)
hemisphereLightHelper.visible = false
scene.add(hemisphereLightHelper)

const hemisphereGui = gui.addFolder('hemisphere').close()
hemisphereGui.add(hemisphereLight, 'intensity').min(0).max(1).step(0.01).name('intensity')
hemisphereGui.add(hemisphereLight, 'visible').name('enable')
hemisphereGui.add(hemisphereLightHelper, 'visible').name('hemisphereLightHelper')

// this is like a light bulb
// lights everyplace from a position
const pointLight = new THREE.PointLight(0xff9000, 0.5)
pointLight.position.set(1, -0.5, 1)
const pointLightHelper = new THREE.PointLightHelper(pointLight)
pointLightHelper.visible = false
scene.add(pointLightHelper)
scene.add(pointLight)
// by default the light doesn't decay over distance
pointLight.distance = 3
pointLight.decay = 2

const pointGui = gui.addFolder('point').close()
pointGui.add(pointLight, 'intensity').min(0).max(1).step(0.01).name('intensity')
pointGui.add(pointLight, 'visible').name('enable')
pointGui.add(pointLight, 'distance').min(0).max(5).step(0.1).name('distance')
pointGui.add(pointLight, 'decay').min(0).max(10).step(0.1).name('decay')
pointGui.add(pointLightHelper, 'visible').name('pointLightHelper')

// rectangle source like photoshoot
// only works with meshStandard and meshPhysical materials
const rectAreaLight = new THREE.RectAreaLight(0x4e00ff, 2, 1, 1)
rectAreaLight.position.set(-1.5, 0.5, 1.5)
rectAreaLight.lookAt(new THREE.Vector3())
scene.add(rectAreaLight)
const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight)
rectAreaLightHelper.visible = false
scene.add(rectAreaLightHelper)

const rectAreaGui = gui.addFolder('rectArea').close()
rectAreaGui.add(rectAreaLight, 'intensity').min(0).max(5).step(0.01).name('intensity')
rectAreaGui.add(rectAreaLight, 'visible').name('enable')
rectAreaGui.add(rectAreaLightHelper, 'visible').name('rectAreaLightHelper')

// basically a flashlight
const spotLight = new THREE.SpotLight(
    0x78ff00,
    0.5,
    10, //distance
    Math.PI * 0.1, //angle
    0.25, //penumbra from edges
    1 // decay
)
spotLight.position.set(0, 2, 3)
spotLight.target.position.x = -0.75
scene.add(spotLight)
const spotLightHelper = new THREE.SpotLightHelper(spotLight)
spotLightHelper.visible = false
scene.add(spotLightHelper)

const spotGui = gui.addFolder('spotLight').close()
spotGui.add(spotLight, 'intensity').min(0).max(1).step(0.01).name('intensity')
spotGui.add(spotLight, 'distance').min(0).max(15).step(0.01).name('distance').onChange(() => spotLightHelper.update())
spotGui.add(spotLight, 'angle').min(0).max(Math.PI/2).step(0.1).name('angle').onChange(() => spotLightHelper.update())
spotGui.add(spotLight, 'penumbra').min(0).max(1).step(0.1).name('penumbra')
spotGui.add(spotLight, 'visible').name('enable')
spotGui.add(spotLightHelper, 'visible').name('spotLightHelper')

// try to use ambientLight and directional/point lights
// spotLight and rectArea cost a LOT

/**
 * Objects
 */
// Material
const material = new THREE.MeshStandardMaterial()
material.roughness = 0.4

// Objects
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    material
)
sphere.position.x = - 1.5

const cube = new THREE.Mesh(
    new THREE.BoxGeometry(0.75, 0.75, 0.75),
    material
)

const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.2, 32, 64),
    material
)
torus.position.x = 1.5

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 5),
    material
)
plane.rotation.x = - Math.PI * 0.5
plane.position.y = - 0.65

scene.add(sphere, cube, torus, plane)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update objects
    sphere.rotation.y = 0.1 * elapsedTime
    cube.rotation.y = 0.1 * elapsedTime
    torus.rotation.y = 0.1 * elapsedTime

    sphere.rotation.x = 0.15 * elapsedTime
    cube.rotation.x = 0.15 * elapsedTime
    torus.rotation.x = 0.15 * elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()