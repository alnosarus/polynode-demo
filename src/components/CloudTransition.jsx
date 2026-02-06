import { useRef, useEffect } from 'react'
import * as THREE from 'three'
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js'

const CLOUD_COUNT = 8000
const FOG_COLOR = 0x07070D

const cloudShader = {
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D map;
    uniform vec3 fogColor;
    uniform float fogNear;
    uniform float fogFar;
    varying vec2 vUv;

    void main() {
      float depth = gl_FragCoord.z / gl_FragCoord.w;
      float fogFactor = smoothstep(fogNear, fogFar, depth);

      gl_FragColor = texture2D(map, vUv);
      gl_FragColor.w *= pow(gl_FragCoord.z, 20.0);
      gl_FragColor = mix(gl_FragColor, vec4(fogColor, gl_FragColor.w), fogFactor);
    }
  `
}

function CloudTransition() {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      30,
      container.clientWidth / container.clientHeight,
      1,
      3000
    )
    camera.position.z = 6000

    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true })
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)

    const fog = new THREE.Fog(FOG_COLOR, -100, 3000)
    scene.fog = fog

    let animationId
    let scrollProgress = 0
    let startTime = Date.now()
    let material
    let mergedGeo

    const loader = new THREE.TextureLoader()
    loader.load(
      'https://mrdoob.com/lab/javascript/webgl/clouds/cloud10.png',
      (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace
        texture.magFilter = THREE.LinearMipMapLinearFilter
        texture.minFilter = THREE.LinearMipMapLinearFilter

        material = new THREE.ShaderMaterial({
          uniforms: {
            map: { value: texture },
            fogColor: { value: fog.color },
            fogNear: { value: fog.near },
            fogFar: { value: fog.far }
          },
          vertexShader: cloudShader.vertexShader,
          fragmentShader: cloudShader.fragmentShader,
          depthWrite: false,
          depthTest: false,
          transparent: true
        })

        const planeGeo = new THREE.PlaneGeometry(64, 64)
        const planeObj = new THREE.Object3D()
        const geometries = []

        for (let i = 0; i < CLOUD_COUNT; i++) {
          planeObj.position.x = Math.random() * 1000 - 500
          planeObj.position.y = -Math.random() * Math.random() * 200 - 15
          planeObj.position.z = i
          planeObj.rotation.z = Math.random() * Math.PI
          planeObj.scale.x = planeObj.scale.y =
            Math.random() * Math.random() * 1.5 + 0.5
          planeObj.updateMatrix()

          const clonedGeo = planeGeo.clone()
          clonedGeo.applyMatrix4(planeObj.matrix)
          geometries.push(clonedGeo)
        }

        planeGeo.dispose()
        mergedGeo = mergeGeometries(geometries)
        geometries.forEach((g) => g.dispose())

        const cloudMesh = new THREE.Mesh(mergedGeo, material)
        cloudMesh.renderOrder = 2

        const cloudMeshClone = cloudMesh.clone()
        cloudMeshClone.position.z = -8000
        cloudMeshClone.renderOrder = 1

        scene.add(cloudMesh)
        scene.add(cloudMeshClone)

        function animate() {
          animationId = requestAnimationFrame(animate)

          // Clouds flow continuously based on time
          const flow = ((Date.now() - startTime) * 0.03) % 8000
          cloudMesh.position.z = flow
          cloudMeshClone.position.z = flow - 8000

          // Camera descends through clouds as user scrolls
          camera.position.y = 100 - scrollProgress * 400

          renderer.render(scene, camera)
        }

        animate()
      }
    )

    function onScroll() {
      const rect = container.getBoundingClientRect()
      const vh = window.innerHeight
      const raw = (vh - rect.top) / (vh + rect.height)
      scrollProgress = Math.max(0, Math.min(1, raw))
    }

    function onResize() {
      const w = container.clientWidth
      const h = container.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    onScroll()

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      cancelAnimationFrame(animationId)
      if (material) material.dispose()
      if (mergedGeo) mergedGeo.dispose()
      renderer.dispose()
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [])

  return <div ref={containerRef} className="cloud-transition" />
}

export default CloudTransition
