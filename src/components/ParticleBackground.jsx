import { useRef, useEffect } from 'react'
import * as THREE from 'three'

const PARTICLE_COUNT = 150
const CONNECTION_DISTANCE = 3.5
const PARTICLE_SPEED = 0.3
const BOUNDS = 10

function ParticleBackground() {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Scene setup
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 100)
    camera.position.z = 12

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    container.appendChild(renderer.domElement)

    // Particle data
    const positions = new Float32Array(PARTICLE_COUNT * 3)
    const velocities = new Float32Array(PARTICLE_COUNT * 3)
    const colors = new Float32Array(PARTICLE_COUNT * 3)

    const colorA = new THREE.Color(0x593248)
    const colorB = new THREE.Color(0x6A7348)

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3
      positions[i3] = (Math.random() - 0.5) * BOUNDS * 2
      positions[i3 + 1] = (Math.random() - 0.5) * BOUNDS * 2
      positions[i3 + 2] = (Math.random() - 0.5) * BOUNDS

      velocities[i3] = (Math.random() - 0.5) * PARTICLE_SPEED
      velocities[i3 + 1] = (Math.random() - 0.5) * PARTICLE_SPEED
      velocities[i3 + 2] = (Math.random() - 0.5) * PARTICLE_SPEED * 0.3

      const t = Math.random()
      const c = new THREE.Color().lerpColors(colorA, colorB, t)
      colors[i3] = c.r
      colors[i3 + 1] = c.g
      colors[i3 + 2] = c.b
    }

    // Points
    const pointsGeometry = new THREE.BufferGeometry()
    pointsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    pointsGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    const pointsMaterial = new THREE.PointsMaterial({
      size: 0.18,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    })

    const points = new THREE.Points(pointsGeometry, pointsMaterial)
    scene.add(points)

    // Lines geometry (pre-allocate max possible connections)
    const maxLines = PARTICLE_COUNT * 4
    const linePositions = new Float32Array(maxLines * 6)
    const lineColors = new Float32Array(maxLines * 6)

    const lineGeometry = new THREE.BufferGeometry()
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3))
    lineGeometry.setAttribute('color', new THREE.BufferAttribute(lineColors, 3))
    lineGeometry.setDrawRange(0, 0)

    const lineMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      linewidth: 1,
    })

    const lines = new THREE.LineSegments(lineGeometry, lineMaterial)
    scene.add(lines)

    // Animation
    let animationId

    function animate() {
      animationId = requestAnimationFrame(animate)

      // Update particle positions
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const i3 = i * 3

        positions[i3] += velocities[i3]
        positions[i3 + 1] += velocities[i3 + 1]
        positions[i3 + 2] += velocities[i3 + 2]

        // Wrap at boundaries
        for (let axis = 0; axis < 3; axis++) {
          const bound = axis === 2 ? BOUNDS * 0.5 : BOUNDS
          if (positions[i3 + axis] > bound) positions[i3 + axis] = -bound
          if (positions[i3 + axis] < -bound) positions[i3 + axis] = bound
        }

        // Slight drift
        velocities[i3] += (Math.random() - 0.5) * 0.002
        velocities[i3 + 1] += (Math.random() - 0.5) * 0.002

        // Clamp velocity
        for (let axis = 0; axis < 3; axis++) {
          velocities[i3 + axis] *= 0.999
        }
      }

      pointsGeometry.attributes.position.needsUpdate = true

      // Update lines
      let lineIndex = 0

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const i3 = i * 3
        for (let j = i + 1; j < PARTICLE_COUNT; j++) {
          const j3 = j * 3
          const dx = positions[i3] - positions[j3]
          const dy = positions[i3 + 1] - positions[j3 + 1]
          const dz = positions[i3 + 2] - positions[j3 + 2]
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)

          if (dist < CONNECTION_DISTANCE && lineIndex < maxLines) {
            const alpha = 1 - dist / CONNECTION_DISTANCE
            const li = lineIndex * 6

            linePositions[li] = positions[i3]
            linePositions[li + 1] = positions[i3 + 1]
            linePositions[li + 2] = positions[i3 + 2]
            linePositions[li + 3] = positions[j3]
            linePositions[li + 4] = positions[j3 + 1]
            linePositions[li + 5] = positions[j3 + 2]

            const cA = alpha * colors[i3]
            const cB = alpha * colors[i3 + 1]
            const cC = alpha * colors[i3 + 2]
            const cD = alpha * colors[j3]
            const cE = alpha * colors[j3 + 1]
            const cF = alpha * colors[j3 + 2]

            lineColors[li] = cA
            lineColors[li + 1] = cB
            lineColors[li + 2] = cC
            lineColors[li + 3] = cD
            lineColors[li + 4] = cE
            lineColors[li + 5] = cF

            lineIndex++
          }
        }
      }

      lineGeometry.setDrawRange(0, lineIndex * 2)
      lineGeometry.attributes.position.needsUpdate = true
      lineGeometry.attributes.color.needsUpdate = true

      renderer.render(scene, camera)
    }

    animate()

    // Resize handler
    function onResize() {
      const w = container.clientWidth
      const h = container.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }

    window.addEventListener('resize', onResize)

    // Cleanup
    return () => {
      window.removeEventListener('resize', onResize)
      cancelAnimationFrame(animationId)
      renderer.dispose()
      pointsGeometry.dispose()
      pointsMaterial.dispose()
      lineGeometry.dispose()
      lineMaterial.dispose()
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [])

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  )
}

export default ParticleBackground
