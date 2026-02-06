import { useRef, useEffect } from 'react'
import * as THREE from 'three'

const BG_COLOR = 0x07070d
const ACCENT_PRIMARY = 0x593248
const ACCENT_SECONDARY = 0x6a7348

function mathRandom(num = 8) {
  return -Math.random() * num + Math.random() * num
}

function CityScene() {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Scene
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(BG_COLOR)
    scene.fog = new THREE.Fog(BG_COLOR, 15, 30)

    // Camera
    const camera = new THREE.PerspectiveCamera(
      20,
      container.clientWidth / container.clientHeight,
      1,
      500
    )
    camera.position.set(0, 12, 18)

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    container.appendChild(renderer.domElement)

    // Groups
    const city = new THREE.Object3D()
    const town = new THREE.Object3D()
    const particles = new THREE.Object3D()

    // Buildings
    for (let i = 0; i < 100; i++) {
      const geometry = new THREE.BoxGeometry(1, 1, 1, 2, 2, 2)
      const material = new THREE.MeshStandardMaterial({
        color: 0x0a0a18,
        roughness: 0.8,
        metalness: 0.3,
      })
      const wireMaterial = new THREE.MeshLambertMaterial({
        color: 0xffffff,
        wireframe: true,
        transparent: true,
        opacity: 0.03,
      })

      const cube = new THREE.Mesh(geometry, material)
      const wire = new THREE.Mesh(geometry, wireMaterial)
      cube.add(wire)
      cube.castShadow = true
      cube.receiveShadow = true

      const cubeWidth = 0.9
      cube.scale.x = cube.scale.z = cubeWidth + mathRandom(1 - cubeWidth)
      cube.scale.y = 0.1 + Math.abs(mathRandom(8))
      cube.position.x = Math.round(mathRandom())
      cube.position.z = Math.round(mathRandom())
      cube.position.y = cube.scale.y / 2

      town.add(cube)
    }

    // Floating particles
    const particleGeo = new THREE.CircleGeometry(0.01, 3)
    const particleMat = new THREE.MeshToonMaterial({
      color: ACCENT_SECONDARY,
      side: THREE.DoubleSide,
    })
    for (let h = 0; h < 300; h++) {
      const p = new THREE.Mesh(particleGeo, particleMat)
      p.position.set(mathRandom(5), mathRandom(5), mathRandom(5))
      p.rotation.set(mathRandom(), mathRandom(), mathRandom())
      particles.add(p)
    }
    particles.position.y = 2

    // Ground plane
    const groundMat = new THREE.MeshPhongMaterial({
      color: BG_COLOR,
      side: THREE.DoubleSide,
      opacity: 0.9,
      transparent: true,
    })
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(60, 60), groundMat)
    ground.rotation.x = -Math.PI / 2
    ground.position.y = -0.001
    ground.receiveShadow = true
    city.add(ground)

    // Grid
    const grid = new THREE.GridHelper(60, 120, ACCENT_PRIMARY, 0x111118)
    city.add(grid)

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 4))

    const spotLight = new THREE.SpotLight(0xffffff, 20, 10)
    spotLight.position.set(5, 5, 5)
    spotLight.castShadow = true
    spotLight.shadow.mapSize.width = 2048
    spotLight.shadow.mapSize.height = 2048
    spotLight.penumbra = 0.1
    city.add(spotLight)

    const backLight = new THREE.PointLight(0xffffff, 0.5)
    backLight.position.set(0, 6, 0)
    scene.add(backLight)

    // Moving lines (traffic)
    const cars = []
    let flipSide = true
    const carMat = new THREE.MeshToonMaterial({
      color: ACCENT_SECONDARY,
      side: THREE.DoubleSide,
    })

    for (let i = 0; i < 60; i++) {
      const cGeo = new THREE.BoxGeometry(1, 0.05, 0.05)
      const car = new THREE.Mesh(cGeo, carMat)
      const amp = 3
      const range = 20

      if (flipSide) {
        car.position.x = -range + Math.random() * range * 2
        car.position.z = mathRandom(amp)
        cars.push({
          mesh: car,
          axis: 'x',
          speed: 0.02 + Math.random() * 0.03,
          range,
        })
      } else {
        car.position.x = mathRandom(amp)
        car.position.z = -range + Math.random() * range * 2
        car.rotation.y = Math.PI / 2
        cars.push({
          mesh: car,
          axis: 'z',
          speed: 0.015 + Math.random() * 0.02,
          range,
        })
      }
      flipSide = !flipSide
      car.position.y = Math.abs(mathRandom(5))
      car.castShadow = true
      car.receiveShadow = true
      city.add(car)
    }

    // Assemble
    city.add(particles)
    city.add(town)
    scene.add(city)

    // Animate
    let animationId
    camera.lookAt(city.position)

    function animate() {
      animationId = requestAnimationFrame(animate)

      // Particle drift
      particles.rotation.y += 0.01
      particles.rotation.x += 0.01

      // Animate traffic lines
      for (const car of cars) {
        car.mesh.position[car.axis] += car.speed
        if (car.mesh.position[car.axis] > car.range) {
          car.speed = -Math.abs(car.speed)
        } else if (car.mesh.position[car.axis] < -car.range) {
          car.speed = Math.abs(car.speed)
        }
      }

      renderer.render(scene, camera)
    }

    animate()

    // Resize
    function onResize() {
      const w = container.clientWidth
      const h = container.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }

    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('resize', onResize)
      cancelAnimationFrame(animationId)
      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose()
        if (obj.material) {
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose())
          } else {
            obj.material.dispose()
          }
        }
      })
      renderer.dispose()
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [])

  return <div ref={containerRef} className="city-scene" />
}

export default CityScene
