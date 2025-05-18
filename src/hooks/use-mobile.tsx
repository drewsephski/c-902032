
import * as React from "react"

// Breakpoint constants
const BREAKPOINTS = {
  xs: 480,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  xxl: 1536
}

type BreakpointKey = keyof typeof BREAKPOINTS

/**
 * Hook to determine if viewport is narrower than a specific breakpoint
 * @param breakpoint - The breakpoint to check against (default: 'md')
 * @returns Boolean indicating if the viewport is narrower than the specified breakpoint
 */
export function useIsMobile(breakpoint: BreakpointKey = 'md') {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)
  
  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${BREAKPOINTS[breakpoint] - 1}px)`)
    
    const onChange = () => {
      setIsMobile(window.innerWidth < BREAKPOINTS[breakpoint])
    }
    
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < BREAKPOINTS[breakpoint])
    
    return () => mql.removeEventListener("change", onChange)
  }, [breakpoint])

  return !!isMobile
}

/**
 * Hook to determine if viewport matches a specific breakpoint range
 * @param min - The minimum breakpoint (inclusive)
 * @param max - The maximum breakpoint (exclusive)
 * @returns Boolean indicating if the viewport is within the specified range
 */
export function useBreakpointRange(min: BreakpointKey, max: BreakpointKey) {
  const [isWithinRange, setIsWithinRange] = React.useState<boolean | undefined>(undefined)
  
  React.useEffect(() => {
    const minWidth = BREAKPOINTS[min]
    const maxWidth = BREAKPOINTS[max] - 1
    
    const mql = window.matchMedia(
      `(min-width: ${minWidth}px) and (max-width: ${maxWidth}px)`
    )
    
    const onChange = () => {
      setIsWithinRange(
        window.innerWidth >= minWidth && window.innerWidth <= maxWidth
      )
    }
    
    mql.addEventListener("change", onChange)
    setIsWithinRange(
      window.innerWidth >= minWidth && window.innerWidth <= maxWidth
    )
    
    return () => mql.removeEventListener("change", onChange)
  }, [min, max])

  return !!isWithinRange
}

/**
 * Hook to get the current breakpoint name
 * @returns Current breakpoint name as string
 */
export function useCurrentBreakpoint() {
  const [breakpoint, setBreakpoint] = React.useState<BreakpointKey>('md')
  
  React.useEffect(() => {
    const determineBreakpoint = () => {
      const width = window.innerWidth
      
      if (width < BREAKPOINTS.xs) return 'xs'
      if (width < BREAKPOINTS.sm) return 'sm'
      if (width < BREAKPOINTS.md) return 'md'
      if (width < BREAKPOINTS.lg) return 'lg'
      if (width < BREAKPOINTS.xl) return 'xl'
      return 'xxl'
    }
    
    const handleResize = () => {
      setBreakpoint(determineBreakpoint() as BreakpointKey)
    }
    
    window.addEventListener('resize', handleResize)
    handleResize() // Set initial value
    
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return breakpoint
}

// Export breakpoint constants for use elsewhere
export { BREAKPOINTS }
