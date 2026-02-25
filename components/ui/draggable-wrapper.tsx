"use client"

import type React from "react"
import { useRef, useEffect, useState } from "react"
import dynamic from "next/dynamic"
import type { DraggableProps, DraggableEvent, DraggableData } from "react-draggable"

const Draggable = dynamic(
  () =>
    import("react-draggable").catch(() => {
      console.warn("Failed to load react-draggable, using fallback")
      // Return a fallback component that just renders children without dragging
      return { default: ({ children, nodeRef, ..._props }: any) => <div ref={nodeRef}>{children}</div> }
    }),
  {
    ssr: false,
    loading: () => null,
  },
)

interface DraggableWrapperProps extends Partial<Omit<DraggableProps, "children" | "nodeRef">> {
  children: React.ReactNode
  className?: string
}

export const DraggableWrapper: React.FC<DraggableWrapperProps> = ({
  children,
  className = "",
  onStart,
  onDrag,
  onStop,
  ...draggableProps
}) => {
  const nodeRef = useRef<HTMLDivElement>(null)
  const [isMounted, setIsMounted] = useState(false)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleStart = (e: DraggableEvent, data: DraggableData) => {
    try {
      onStart?.(e, data)
    } catch (error) {
      console.error("Error in drag start:", error)
      setHasError(true)
    }
  }

  const handleDrag = (e: DraggableEvent, data: DraggableData) => {
    try {
      onDrag?.(e, data)
    } catch (error) {
      console.error("Error in drag:", error)
      setHasError(true)
    }
  }

  const handleStop = (e: DraggableEvent, data: DraggableData) => {
    try {
      onStop?.(e, data)
    } catch (error) {
      console.error("Error in drag stop:", error)
      setHasError(true)
    }
  }

  // Don't render draggable on server or before mount
  if (!isMounted || hasError) {
    return <div className={className}>{children}</div>
  }

  return (
    <Draggable nodeRef={nodeRef} onStart={handleStart} onDrag={handleDrag} onStop={handleStop} {...draggableProps}>
      <div ref={nodeRef} className={className}>
        {children}
      </div>
    </Draggable>
  )
}
