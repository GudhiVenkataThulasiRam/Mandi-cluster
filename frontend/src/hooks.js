
import { useEffect, useState } from 'react'

export function useMaxWidth(px) {
  const [matches, setMatches] = useState(
    window.matchMedia(`(max-width: ${px}px)`).matches
  )

  useEffect(() => {
    const mediaQuery = window.matchMedia(`(max-width: ${px}px)`)

    const handleChange = (event) => {
      setMatches(event.matches)
    }

    mediaQuery.addEventListener('change', handleChange)

    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [px])

  return matches
}
