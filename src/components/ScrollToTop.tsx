import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// Scrolls to top on route change; if there's a hash, scrolls to the anchor
export default function ScrollToTop() {
  const location = useLocation()

  useEffect(() => {
    const scrollToAnchor = (hash: string) => {
      const id = hash.replace('#', '')
      const el = document.getElementById(id)
      if (!el) return false
      // Use instant jump to avoid partial offset under sticky headers
      el.scrollIntoView({ behavior: 'auto', block: 'start' })
      return true
    }

    const scrollTopHard = () => {
      // Multiple strategies to guarantee exact top
      window.scrollTo(0, 0)
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0
      requestAnimationFrame(() => {
        window.scrollTo(0, 0)
      })
      setTimeout(() => window.scrollTo(0, 0), 0)
    }

    if (location.hash) {
      // Try immediately, then retry after render
      if (!scrollToAnchor(location.hash)) {
        setTimeout(() => scrollToAnchor(location.hash), 0)
        setTimeout(() => scrollToAnchor(location.hash), 120)
      }
    } else {
      scrollTopHard()
    }
  }, [location.pathname, location.hash])

  return null
}
