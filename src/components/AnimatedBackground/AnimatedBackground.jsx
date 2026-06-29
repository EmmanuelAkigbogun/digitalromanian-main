import { useEffect, useState } from 'react'
import { ShaderGradientCanvas, ShaderGradient } from '@shadergradient/react'
import './AnimatedBackground.scss'

function AnimatedBackground({ onReady }) {
  const [theme, setTheme] = useState('dark')

  useEffect(() => {
    function updateTheme() {
      const t = document.documentElement.getAttribute('data-theme') || 'dark'
      setTheme(t)
    }

    updateTheme()

    const observer = new MutationObserver(updateTheme)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    })

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    onReady?.()
  }, [onReady])

  const isLight = theme === 'light'
  const shaderColors = isLight
    ? {
      bgColor1: '#f8fbff',
      bgColor2: '#eef3ff',
      color1: '#dbeafe',
      color2: '#2563eb',
      color3: '#93c5fd',
      brightness: 1.14,
      reflection: 0.08,
    }
    : {
      bgColor1: '#020617',
      bgColor2: '#030712',
      color1: '#04133a',
      color2: '#0284c7',
      color3: '#60a5fa',
      brightness: 0.94,
      reflection: 0.06,
    }

  return (
    <div className={`dr-bg-wrapper dr-bg-wrapper-${theme}`} aria-hidden="true">
      <div className="dr-bg-parallax">
        <ShaderGradientCanvas
          style={{ width: '100%', height: '100%' }}
          pixelDensity={1}
          fov={45}
        >
          <ShaderGradient
            animate="on"
            axesHelper="off"
            bgColor1={shaderColors.bgColor1}
            bgColor2={shaderColors.bgColor2}
            brightness={shaderColors.brightness}
            cAzimuthAngle={170}
            cDistance={4.4}
            cPolarAngle={70}
            cameraZoom={1}
            color1={shaderColors.color1}
            color2={shaderColors.color2}
            color3={shaderColors.color3}
            destination="onCanvas"
            embedMode="off"
            envPreset="city"
            format="gif"
            frameRate={10}
            gizmoHelper="hide"
            grain="off"
            lightType="3d"
            positionX={0}
            positionY={0.9}
            positionZ={-0.3}
            range="disabled"
            rangeEnd={40}
            rangeStart={0}
            reflection={shaderColors.reflection}
            rotationX={45}
            rotationY={0}
            rotationZ={0}
            shader="defaults"
            type="waterPlane"
            uAmplitude={0.08}
            uDensity={1.55}
            uFrequency={0.22}
            uSpeed={0.34}
            uStrength={4.4}
            uTime={0}
            wireframe={false}
          />
        </ShaderGradientCanvas>
      </div>
    </div>
  )
}

export default AnimatedBackground
