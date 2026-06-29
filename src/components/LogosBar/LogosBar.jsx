import { useEffect, useState } from 'react'

import './LogosBar.scss'

import l1Dark from '../../assets/logosBar/1.svg'
import l2Dark from '../../assets/logosBar/2.svg'
import l3Dark from '../../assets/logosBar/3.svg'
import l4Dark from '../../assets/logosBar/4.svg'
import l5Dark from '../../assets/logosBar/5.svg'
import l6Dark from '../../assets/logosBar/6.svg'
import l7Dark from '../../assets/logosBar/7.svg'
import l8Dark from '../../assets/logosBar/8.svg'

import l1Light from '../../assets/logosBar/1-light.svg'
import l2Light from '../../assets/logosBar/2-light.svg'
import l3Light from '../../assets/logosBar/3-light.svg'
import l4Light from '../../assets/logosBar/4-light.svg'
import l5Light from '../../assets/logosBar/5-light.svg'
import l6Light from '../../assets/logosBar/6-light.svg'
import l7Light from '../../assets/logosBar/7-light.svg'
import l8Light from '../../assets/logosBar/8-light.svg'

function LogosBar() {
  const [theme, setTheme] = useState(() => {
    if (typeof document === 'undefined') {
      return 'dark'
    }

    return document.documentElement.getAttribute('data-theme') || 'dark'
  })

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setTheme(document.documentElement.getAttribute('data-theme') || 'dark')
    })

    observer.observe(document.documentElement, { attributes: true })

    return () => observer.disconnect()
  }, [])

  const logos = theme === 'light'
    ? [l1Dark, l2Dark, l3Dark, l4Dark, l5Dark, l6Dark, l7Dark, l8Dark]
    : [l1Light, l2Light, l3Light, l4Light, l5Light, l6Light, l7Light, l8Light]

  return (
    <section className="dr-logos" aria-hidden="true">
      <div className="dr-logos-track">
        {[...logos, ...logos].map((logo, index) => (
          <div className="dr-logo-item" key={index}>
            <img src={logo} alt="" loading="lazy" decoding="async" />
          </div>
        ))}
      </div>
    </section>
  )
}

export default LogosBar
