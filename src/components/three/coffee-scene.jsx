'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export function CoffeeScene({ compact = false }) {
  const mountRef = useRef(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const scene = new THREE.Scene()
    scene.fog = new THREE.FogExp2(0x0b0b0b, 0.08)

    const camera = new THREE.PerspectiveCamera(
      compact ? 42 : 35,
      mount.clientWidth / mount.clientHeight,
      0.1,
      100,
    )
    camera.position.set(0, 1.15, compact ? 7 : 8)

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(mount.clientWidth, mount.clientHeight)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    mount.appendChild(renderer.domElement)

    const group = new THREE.Group()
    scene.add(group)

    scene.add(new THREE.AmbientLight(0xffdbc5, 1.6))
    const key = new THREE.PointLight(0xffb067, 80, 18)
    key.position.set(-3, 4, 4)
    key.castShadow = true
    scene.add(key)
    const rim = new THREE.PointLight(0xc67c4e, 35, 12)
    rim.position.set(4, 2, -3)
    scene.add(rim)

    const cupMat = new THREE.MeshPhysicalMaterial({
      color: 0xf5eadc,
      roughness: 0.24,
      metalness: 0.02,
      clearcoat: 0.8,
      clearcoatRoughness: 0.18,
    })
    const coffeeMat = new THREE.MeshStandardMaterial({
      color: 0x33180d,
      roughness: 0.18,
      metalness: 0.05,
    })
    const beanMat = new THREE.MeshStandardMaterial({
      color: 0x8f4420,
      roughness: 0.42,
      metalness: 0.08,
      emissive: 0x2b1008,
    })

    const cup = new THREE.Mesh(
      new THREE.CylinderGeometry(1.25, 0.82, 1.65, 96, 1, true),
      cupMat,
    )
    cup.castShadow = true
    cup.receiveShadow = true
    group.add(cup)

    const liquid = new THREE.Mesh(
      new THREE.CircleGeometry(1.08, 96),
      coffeeMat,
    )
    liquid.rotation.x = -Math.PI / 2
    liquid.position.y = 0.84
    group.add(liquid)

    const saucer = new THREE.Mesh(
      new THREE.TorusGeometry(1.4, 0.08, 16, 96),
      cupMat,
    )
    saucer.rotation.x = Math.PI / 2
    saucer.position.y = -0.88
    group.add(saucer)

    const handle = new THREE.Mesh(
      new THREE.TorusGeometry(0.52, 0.08, 16, 48, Math.PI * 1.55),
      cupMat,
    )
    handle.position.set(1.13, 0.1, 0)
    handle.rotation.y = Math.PI / 2
    group.add(handle)

    const beans = []
    for (let i = 0; i < 22; i += 1) {
      const bean = new THREE.Mesh(new THREE.SphereGeometry(0.12, 24, 16), beanMat)
      bean.scale.set(0.72, 1.15, 0.48)
      bean.position.set(
        Math.sin(i * 1.7) * (1.8 + (i % 4) * 0.3),
        -0.35 + (i % 7) * 0.45,
        Math.cos(i * 1.4) * (1.5 + (i % 3) * 0.36),
      )
      bean.rotation.set(i, i * 0.7, i * 0.31)
      group.add(bean)
      beans.push(bean)
    }

    const steam = []
    const steamMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.2,
    })
    for (let i = 0; i < 28; i += 1) {
      const puff = new THREE.Mesh(new THREE.SphereGeometry(0.035, 12, 8), steamMat)
      puff.position.set(
        (Math.random() - 0.5) * 0.7,
        0.9 + Math.random() * 2.6,
        (Math.random() - 0.5) * 0.5,
      )
      group.add(puff)
      steam.push(puff)
    }

    const pointer = { x: 0, y: 0 }
    const onPointerMove = (event) => {
      const rect = mount.getBoundingClientRect()
      pointer.x = ((event.clientX - rect.left) / rect.width - 0.5) * 0.8
      pointer.y = ((event.clientY - rect.top) / rect.height - 0.5) * 0.5
    }
    const onResize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(mount.clientWidth, mount.clientHeight)
    }

    mount.addEventListener('pointermove', onPointerMove)
    window.addEventListener('resize', onResize)

    let frame = 0
    const animate = () => {
      frame = requestAnimationFrame(animate)
      const t = performance.now() * 0.001
      group.rotation.y += (pointer.x - group.rotation.y) * 0.035
      group.rotation.x += (-pointer.y - group.rotation.x) * 0.035
      group.position.y = Math.sin(t * 1.2) * 0.08
      liquid.scale.setScalar(1 + Math.sin(t * 2) * 0.015)

      beans.forEach((bean, index) => {
        bean.rotation.x += 0.008 + index * 0.0002
        bean.rotation.y += 0.012
        bean.position.y += Math.sin(t + index) * 0.0015
      })

      steam.forEach((puff, index) => {
        puff.position.y += 0.006 + (index % 4) * 0.001
        puff.position.x += Math.sin(t * 1.7 + index) * 0.002
        puff.material.opacity = 0.08 + Math.sin(t * 2 + index) * 0.05
        if (puff.position.y > 3.8) puff.position.y = 0.85
      })

      renderer.render(scene, camera)
    }
    animate()

    return () => {
      cancelAnimationFrame(frame)
      mount.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('resize', onResize)
      renderer.dispose()
      mount.removeChild(renderer.domElement)
    }
  }, [compact])

  return <div ref={mountRef} className="h-full min-h-[250px] w-full" />
}
