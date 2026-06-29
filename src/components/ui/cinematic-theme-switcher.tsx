import { Moon, Sun } from "lucide-react"
import { useEffect, useId, useRef, useState } from "react"
import { motion, useReducedMotion } from "framer-motion"

import { cn } from "@/lib/utils"

interface Particle {
  id: number
  delay: number
  duration: number
}

interface CinematicThemeSwitcherProps {
  theme: "light" | "dark"
  onToggle: () => void
  className?: string
  size?: "default" | "compact"
}

const sizeConfig = {
  default: {
    trackClass: "h-[64px] w-[104px] p-[6px]",
    insetClass: "inset-[3px]",
    iconPaddingClass: "px-4",
    iconSize: 20,
    thumbClass: "h-[44px] w-[44px]",
    thumbX: 46,
  },
  compact: {
    trackClass: "h-[44px] w-[72px] p-[4px]",
    insetClass: "inset-[2px]",
    iconPaddingClass: "px-2.5",
    iconSize: 15,
    thumbClass: "h-[32px] w-[32px]",
    thumbX: 28,
  },
}

export default function CinematicThemeSwitcher({
  theme,
  onToggle,
  className,
  size = "default",
}: CinematicThemeSwitcherProps) {
  const [particles, setParticles] = useState<Particle[]>([])
  const [isAnimating, setIsAnimating] = useState(false)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const cleanupTimerRef = useRef<number | null>(null)
  const filterBaseId = useId().replace(/:/g, "")
  const prefersReducedMotion = useReducedMotion()

  const isDark = theme === "dark"
  const config = sizeConfig[size]
  const grainLightId = `${filterBaseId}-grain-light`
  const grainDarkId = `${filterBaseId}-grain-dark`

  function generateParticles() {
    if (prefersReducedMotion) return

    const newParticles = Array.from({ length: 3 }, (_, id) => ({
      id,
      delay: id * 0.1,
      duration: 0.6 + id * 0.1,
    }))

    setParticles(newParticles)
    setIsAnimating(true)

    if (cleanupTimerRef.current) {
      window.clearTimeout(cleanupTimerRef.current)
    }

    cleanupTimerRef.current = window.setTimeout(() => {
      setIsAnimating(false)
      setParticles([])
      cleanupTimerRef.current = null
    }, 1000)
  }

  function handleToggle() {
    generateParticles()
    onToggle()
  }

  useEffect(() => {
    return () => {
      if (cleanupTimerRef.current) {
        window.clearTimeout(cleanupTimerRef.current)
      }
    }
  }, [])

  return (
    <div className={cn("relative inline-block", className)}>
      <svg className="absolute h-0 w-0" aria-hidden="true" focusable="false">
        <defs>
          <filter id={grainLightId}>
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" result="noise" />
            <feColorMatrix in="noise" type="saturate" values="0" result="desaturatedNoise" />
            <feComponentTransfer in="desaturatedNoise" result="lightGrain">
              <feFuncA type="linear" slope="0.3" />
            </feComponentTransfer>
            <feBlend in="SourceGraphic" in2="lightGrain" mode="overlay" />
          </filter>

          <filter id={grainDarkId}>
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" result="noise" />
            <feColorMatrix in="noise" type="saturate" values="0" result="desaturatedNoise" />
            <feComponentTransfer in="desaturatedNoise" result="darkGrain">
              <feFuncA type="linear" slope="0.5" />
            </feComponentTransfer>
            <feBlend in="SourceGraphic" in2="darkGrain" mode="overlay" />
          </filter>
        </defs>
      </svg>

      <motion.button
        ref={toggleRef}
        type="button"
        onClick={handleToggle}
        className={cn(
          "relative flex items-center rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/50",
          config.trackClass,
        )}
        style={{
          background: isDark
            ? "radial-gradient(ellipse at top left, #1e293b 0%, #0f172a 40%, #020617 100%)"
            : "radial-gradient(ellipse at top left, #ffffff 0%, #f1f5f9 40%, #cbd5e1 100%)",
          boxShadow: isDark
            ? `
              inset 5px 5px 12px rgba(0, 0, 0, 0.9),
              inset -5px -5px 12px rgba(71, 85, 105, 0.4),
              inset 8px 8px 16px rgba(0, 0, 0, 0.7),
              inset -8px -8px 16px rgba(100, 116, 139, 0.2),
              inset 0 2px 4px rgba(0, 0, 0, 1),
              inset 0 -2px 4px rgba(71, 85, 105, 0.4),
              inset 0 0 20px rgba(0, 0, 0, 0.6),
              0 1px 1px rgba(255, 255, 255, 0.05),
              0 2px 4px rgba(0, 0, 0, 0.4),
              0 8px 16px rgba(0, 0, 0, 0.4)
            `
            : `
              inset 5px 5px 12px rgba(148, 163, 184, 0.5),
              inset -5px -5px 12px rgba(255, 255, 255, 1),
              inset 8px 8px 16px rgba(100, 116, 139, 0.3),
              inset -8px -8px 16px rgba(255, 255, 255, 0.9),
              inset 0 2px 4px rgba(148, 163, 184, 0.4),
              inset 0 -2px 4px rgba(255, 255, 255, 1),
              inset 0 0 20px rgba(203, 213, 225, 0.3),
              0 1px 2px rgba(255, 255, 255, 1),
              0 2px 4px rgba(0, 0, 0, 0.1),
              0 8px 16px rgba(0, 0, 0, 0.08)
            `,
          border: isDark
            ? "2px solid rgba(51, 65, 85, 0.6)"
            : "2px solid rgba(203, 213, 225, 0.6)",
          filter: isDark ? `url(#${grainDarkId})` : `url(#${grainLightId})`,
        }}
        aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
        role="switch"
        aria-checked={isDark}
        whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
      >
        <div
          className={cn("pointer-events-none absolute rounded-full", config.insetClass)}
          style={{
            boxShadow: isDark
              ? "inset 0 2px 6px rgba(0, 0, 0, 0.9), inset 0 -1px 3px rgba(71, 85, 105, 0.3)"
              : "inset 0 2px 6px rgba(100, 116, 139, 0.4), inset 0 -1px 3px rgba(255, 255, 255, 0.8)",
          }}
        />

        <div
          className="pointer-events-none absolute inset-0 rounded-full"
          style={{
            background: isDark
              ? `
                radial-gradient(ellipse at top, rgba(71, 85, 105, 0.15) 0%, transparent 50%),
                linear-gradient(to bottom, rgba(71, 85, 105, 0.2) 0%, transparent 30%, transparent 70%, rgba(0, 0, 0, 0.3) 100%)
              `
              : `
                radial-gradient(ellipse at top, rgba(255, 255, 255, 0.8) 0%, transparent 50%),
                linear-gradient(to bottom, rgba(255, 255, 255, 0.7) 0%, transparent 30%, transparent 70%, rgba(148, 163, 184, 0.15) 100%)
              `,
            mixBlendMode: "overlay",
          }}
        />

        <div
          className="pointer-events-none absolute inset-0 rounded-full"
          style={{
            boxShadow: isDark
              ? "inset 0 0 15px rgba(0, 0, 0, 0.5)"
              : "inset 0 0 15px rgba(148, 163, 184, 0.2)",
          }}
        />

        <div className={cn("absolute inset-0 flex items-center justify-between", config.iconPaddingClass)}>
          <Sun
            size={config.iconSize}
            className={isDark ? "text-yellow-100/80" : "text-amber-600"}
            aria-hidden="true"
          />
          <Moon
            size={config.iconSize}
            className={isDark ? "text-yellow-100" : "text-slate-700"}
            aria-hidden="true"
          />
        </div>

        <motion.div
          className={cn(
            "relative z-10 flex items-center justify-center overflow-hidden rounded-full",
            config.thumbClass,
          )}
          style={{
            background: isDark
              ? "linear-gradient(145deg, #64748b 0%, #475569 50%, #334155 100%)"
              : "linear-gradient(145deg, #ffffff 0%, #fefefe 50%, #f8fafc 100%)",
            boxShadow: isDark
              ? `
                inset 2px 2px 4px rgba(100, 116, 139, 0.4),
                inset -2px -2px 4px rgba(0, 0, 0, 0.8),
                inset 0 1px 1px rgba(255, 255, 255, 0.15),
                0 8px 24px rgba(0, 0, 0, 0.45),
                0 3px 10px rgba(0, 0, 0, 0.38)
              `
              : `
                inset 2px 2px 4px rgba(203, 213, 225, 0.3),
                inset -2px -2px 4px rgba(255, 255, 255, 1),
                inset 0 1px 2px rgba(255, 255, 255, 1),
                0 8px 24px rgba(0, 0, 0, 0.16),
                0 3px 10px rgba(0, 0, 0, 0.1)
              `,
            border: isDark
              ? "2px solid rgba(148, 163, 184, 0.3)"
              : "2px solid rgba(255, 255, 255, 0.9)",
          }}
          animate={{
            x: isDark ? config.thumbX : 0,
          }}
          transition={
            prefersReducedMotion
              ? { duration: 0 }
              : {
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                }
          }
        >
          <div
            className="pointer-events-none absolute inset-0 rounded-full"
            style={{
              background:
                "linear-gradient(to bottom, rgba(255, 255, 255, 0.4) 0%, transparent 40%, rgba(0, 0, 0, 0.1) 100%)",
              mixBlendMode: "overlay",
            }}
          />

          {isAnimating &&
            particles.map((particle) => (
              <motion.div
                key={particle.id}
                className="pointer-events-none absolute inset-0 flex items-center justify-center"
              >
                <motion.div
                  className="absolute rounded-full"
                  style={{
                    width: "10px",
                    height: "10px",
                    background: isDark
                      ? "radial-gradient(circle, rgba(147, 197, 253, 0.5) 0%, rgba(147, 197, 253, 0) 70%)"
                      : "radial-gradient(circle, rgba(251, 191, 36, 0.7) 0%, rgba(251, 191, 36, 0) 70%)",
                    mixBlendMode: "normal",
                  }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: isDark ? 6 : 8, opacity: [0, 1, 0] }}
                  transition={{
                    duration: isDark ? 0.5 : particle.duration,
                    delay: particle.delay,
                    ease: "easeOut",
                  }}
                >
                  <div
                    className="absolute inset-0 rounded-full opacity-40"
                    style={{
                      backgroundImage:
                        'url("data:image/svg+xml,%3Csvg viewBox=%270 0 200 200%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cfilter id=%27noiseFilter%27%3E%3CfeTurbulence type=%27fractalNoise%27 baseFrequency=%270.9%27 numOctaves=%274%27 stitchTiles=%27stitch%27/%3E%3C/filter%3E%3Crect width=%27100%25%27 height=%27100%25%27 filter=%27url(%23noiseFilter)%27/%3E%3C/svg%3E")',
                      mixBlendMode: "overlay",
                    }}
                  />
                </motion.div>
              </motion.div>
            ))}

          <div className="relative z-10">
            {isDark ? (
              <Moon size={config.iconSize} className="text-yellow-200" aria-hidden="true" />
            ) : (
              <Sun size={config.iconSize} className="text-amber-500" aria-hidden="true" />
            )}
          </div>
        </motion.div>
      </motion.button>
    </div>
  )
}
