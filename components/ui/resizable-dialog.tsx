"use client"

import * as React from "react"
import { Drawer } from "vaul"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Minimize2, Maximize2, X, GripVertical, Maximize, Minus, ChevronUp, FileText } from "lucide-react"
import { Dialog, DialogPortal, DialogOverlay } from "@/components/ui/dialog"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { DraggableWrapper } from "@/components/ui/draggable-wrapper"
import type { DraggableEvent, DraggableData } from "react-draggable"
import { useLiquidGlass } from "@/components/ui/satin-liquid-glass"
import { motion, AnimatePresence } from "framer-motion"

const MODAL_Z_INDEX_KEY = "__stockliModalZIndex"

function allocateModalZIndex(minZIndex: number) {
  const g = globalThis as any
  if (!g[MODAL_Z_INDEX_KEY]) {
    g[MODAL_Z_INDEX_KEY] = { current: 1000 }
  }
  const state = g[MODAL_Z_INDEX_KEY] as { current: number }
  state.current = Math.max(state.current + 2, minZIndex)
  return state.current
}

interface ResizableDialogProps {
  children: React.ReactNode
  isOpen: boolean
  onClose: () => void
  title?: string
  className?: string
  footer?: React.ReactNode
  productImage?: string
  productName?: string
  baseZIndex?: number
  mobileFullWidth?: boolean
  dismissible?: boolean
}

interface ModalContainerProps extends ResizableDialogProps { }

const applyGlassToFooterButtons = (node: React.ReactNode, glassStyle: React.CSSProperties): React.ReactNode => {
  if (!React.isValidElement(node)) return node
  const element = node as React.ReactElement<any>
  const isButtonElement = element.type === Button || element.type === "button"
  if (element.type === Button && (!element.props?.variant || element.props?.variant === "default")) {
    return element
  }
  if (isButtonElement) {
    return React.cloneElement(element, {
      className: cn("bg-transparent hover:bg-transparent", element.props?.className),
      style: { ...glassStyle, ...(element.props?.style ?? {}) },
    })
  }
  if (!element.props?.children) return element
  return React.cloneElement(element, {
    children: React.Children.map(element.props.children, (child) =>
      applyGlassToFooterButtons(child, glassStyle),
    ),
  })
}

const ProductHeader = ({
  productImage,
  productName,
  title,
}: { productImage?: string; productName?: string; title?: string }) => {
  if (productImage || productName) {
    const isPdf = productImage?.startsWith("data:application/pdf")
    return (
      <div className="flex items-center gap-2">
        {productImage && (
          isPdf ? (
            <div className="w-6 h-6 rounded flex items-center justify-center bg-muted flex-shrink-0">
              <FileText className="h-3.5 w-3.5 text-primary" />
            </div>
          ) : (
            <img
              src={productImage || "/placeholder.svg"}
              alt={productName || "Producto"}
              className="w-6 h-6 rounded object-cover flex-shrink-0"
            />
          )
        )}
        <span className="font-semibold text-lg truncate text-gray-900 dark:text-gray-100">
          {productName || title || "Producto"}
        </span>
      </div>
    )
  }
  return (
    <span className="font-semibold text-lg text-gray-900 dark:text-gray-100">{productName || title || "Modal"}</span>
  )
}

// Minimized View Component (Shared by both mobile and desktop)
const MinimizedView = ({
  onRestore,
  onClose,
  title,
  isMobile,
  productImage,
  productName,
}: {
  onRestore: () => void
  onClose: () => void
  title?: string
  isMobile: boolean
  productImage?: string
  productName?: string
}) => {
  const [isHovered, setIsHovered] = React.useState(false)
  const zIndexRef = React.useRef<number | null>(null)
  const displayTitle = productName || title || "Modal"
  const { style: minimizedGlassStyle } = useLiquidGlass({ intensity: "medium", variant: "natural" })

  if (zIndexRef.current === null) {
    zIndexRef.current = allocateModalZIndex(1050)
  }

  if (isMobile) {
    return (
      <div
        className="fixed bottom-16 left-0 right-0 z-[9997] bg-transparent border-t shadow-lg"
        style={{ zIndex: zIndexRef.current, ...minimizedGlassStyle }}
      >
        <div
          className="flex items-center justify-between px-4 py-2 cursor-pointer hover:bg-transparent transition-colors bg-transparent"
          onClick={onRestore}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{ touchAction: "manipulation", ...minimizedGlassStyle }}
        >
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <div className="flex items-center gap-2">
              {productImage && (
                productImage.startsWith("data:application/pdf") ? (
                  <div className="w-4 h-4 rounded flex items-center justify-center bg-muted flex-shrink-0">
                    <FileText className="h-2.5 w-2.5 text-primary" />
                  </div>
                ) : (
                  <img
                    src={productImage || "/placeholder.svg"}
                    alt={productName || "Producto"}
                    className="w-4 h-4 rounded object-cover flex-shrink-0"
                  />
                )
              )}
              <span className="text-sm font-medium text-muted-foreground">{displayTitle} minimizado</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ChevronUp
              className={cn(
                "h-4 w-4 text-muted-foreground transition-transform duration-200",
                isHovered && "transform -translate-y-0.5",
              )}
            />
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={(e) => {
                e.stopPropagation()
                onClose()
              }}
              aria-label="Cerrar"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 left-4 z-[9997]" style={{ zIndex: zIndexRef.current }}>
      <div
        className={cn(
          "bg-transparent border shadow-md rounded-lg cursor-pointer transition-all duration-200",
          "hover:shadow-md hover:scale-[1.02] active:scale-95",
          "flex items-center gap-3 px-4 py-3 min-w-[200px] max-w-[300px]",
        )}
        onClick={onRestore}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        role="button"
        tabIndex={0}
        aria-label={`Restaurar ${displayTitle}`}
        style={minimizedGlassStyle}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            onRestore()
          }
        }}
      >
        <div className="flex-shrink-0">
          <div className="w-3 h-3 bg-primary rounded-full animate-pulse" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            {productImage && (
              productImage.startsWith("data:application/pdf") ? (
                <div className="w-4 h-4 rounded flex items-center justify-center bg-muted flex-shrink-0">
                  <FileText className="h-2.5 w-2.5 text-primary" />
                </div>
              ) : (
                <img
                  src={productImage || "/placeholder.svg"}
                  alt={productName || "Producto"}
                  className="w-4 h-4 rounded object-cover flex-shrink-0"
                />
              )
            )}
            <div className="text-sm font-medium text-foreground truncate">{displayTitle}</div>
          </div>
          <div className="text-xs text-muted-foreground">Clic para restaurar</div>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className={cn("h-6 w-6 opacity-0 transition-opacity duration-200", isHovered && "opacity-100")}
            onClick={(e) => {
              e.stopPropagation()
              onRestore()
            }}
            aria-label="Restaurar"
          >
            <Maximize2 className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-6 w-6 opacity-0 transition-opacity duration-200 hover:bg-destructive/10 hover:text-destructive",
              isHovered && "opacity-100",
            )}
            onClick={(e) => {
              e.stopPropagation()
              onClose()
            }}
            aria-label="Cerrar"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  )
}

// Fullscreen View Component (Shared by both mobile and desktop)
const FullscreenView = ({
  onExit,
  onClose,
  title,
  children,
  footer,
  productImage,
  productName,
  baseZIndex,
}: {
  onExit: () => void
  onClose: () => void
  title?: string
  children: React.ReactNode
  footer?: React.ReactNode
  productImage?: string
  productName?: string
  baseZIndex?: number
}) => {
  const zIndexRef = React.useRef<number | null>(null)
  const { style: glassStyle } = useLiquidGlass({ intensity: "medium", satin: true })
  const { style: glassIconStyle } = useLiquidGlass({ intensity: "subtle", variant: "natural" })
  const { style: footerGlassStyle } = useLiquidGlass({ intensity: "subtle", variant: "natural" })
  const footerWithGlass = React.useMemo(() => applyGlassToFooterButtons(footer, footerGlassStyle), [footer, footerGlassStyle])
  if (zIndexRef.current === null) {
    zIndexRef.current = allocateModalZIndex(baseZIndex ?? 1100)
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      data-system-bar
      className="fixed inset-0 z-[9999] bg-background flex flex-col transition-colors duration-300"
      style={{ zIndex: zIndexRef.current }}
    >
      <div
        className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-4 pb-4 pt-[calc(env(safe-area-inset-top)+1rem)] sm:p-6 transition-colors duration-300"
        style={glassStyle}
      >
        <div className="flex items-center gap-2">
          {productImage || productName ? (
            <div className="flex items-center gap-2">
              {productImage && (
                productImage.startsWith("data:application/pdf") ? (
                  <div className="w-6 h-6 rounded flex items-center justify-center bg-muted flex-shrink-0">
                    <FileText className="h-3.5 w-3.5 text-primary" />
                  </div>
                ) : (
                  <img
                    src={productImage || "/placeholder.svg"}
                    alt={productName || "Producto"}
                    className="w-6 h-6 rounded object-cover flex-shrink-0"
                  />
                )
              )}
              <h2 className="text-lg font-semibold text-foreground">{productName || title}</h2>
            </div>
          ) : (
            title && <h2 className="text-lg font-semibold text-foreground">{title}</h2>
          )}
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground transition-colors bg-transparent hover:bg-transparent"
            style={glassIconStyle}
            onClick={onExit}
            aria-label="Salir de pantalla completa"
          >
            <Minimize2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-destructive transition-colors bg-transparent hover:bg-transparent"
            style={glassIconStyle}
            onClick={onClose}
            aria-label="Cerrar"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto bg-background pt-24 sm:pt-28 group/dialog-content" data-view="fullscreen">
        <div className="max-w-5xl mx-auto w-full p-4 sm:p-6 h-full flex flex-col">
          {children}
        </div>
      </div>
      {footerWithGlass && (
        <div className="border-t border-border p-4 sm:p-6 bg-background flex-shrink-0">
          <div className="flex justify-center gap-2">{footerWithGlass}</div>
        </div>
      )}
    </motion.div>
  )
}

const DesktopDialog = ({
  children,
  isOpen,
  onClose,
  title,
  className,
  footer,
  onMinimize,
  onMaximize,
  productImage,
  productName,
  onOpenChange,
  baseZIndex = 1000,
  dismissible = false,
}: ResizableDialogProps & {
  onMinimize: () => void
  onMaximize: () => void
  onOpenChange?: (open: boolean) => void
}) => {
  const [position, setPosition] = React.useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = React.useState(false)
  const [zIndex, setZIndex] = React.useState(baseZIndex)
  const { style: glassStyle } = useLiquidGlass({ intensity: "medium", satin: true })
  const { style: glassIconStyle } = useLiquidGlass({ intensity: "subtle", variant: "natural" })
  const { style: footerGlassStyle } = useLiquidGlass({ intensity: "subtle", variant: "natural" })
  const footerWithGlass = React.useMemo(() => applyGlassToFooterButtons(footer, footerGlassStyle), [footer, footerGlassStyle])

  React.useEffect(() => {
    if (isOpen) {
      const newZIndex = allocateModalZIndex(baseZIndex)
      setZIndex(newZIndex)
    }
  }, [isOpen, baseZIndex])

  const handleDragStart = React.useCallback((_e: DraggableEvent, _data: DraggableData) => {
    setIsDragging(true)
  }, [])

  const handleDragStop = React.useCallback((_e: DraggableEvent, data: DraggableData) => {
    setIsDragging(false)
    setPosition({ x: data.x, y: data.y })
  }, [])

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange || ((open) => !open && onClose())} modal={true}>
      <DialogPortal>
        <DialogOverlay className="bg-black/60 backdrop-blur-sm" style={{ zIndex: zIndex - 1 }} />
        <DialogPrimitive.Content
          className="fixed inset-0 flex items-center justify-center p-4 z-50"
          style={{ zIndex }}
          onPointerDownOutside={(e) => {
            if (!dismissible) e.preventDefault()
          }}
          onEscapeKeyDown={(e) => {
            if (!dismissible) e.preventDefault()
          }}
          aria-describedby={undefined}
        >
          <DraggableWrapper
            position={position}
            onStart={handleDragStart}
            onStop={handleDragStop}
            handle=".drag-handle"
            bounds="parent"
            className={cn(
              "flex flex-col w-full max-w-lg border-0 bg-transparent shadow-2xl duration-200 sm:rounded-2xl max-h-[95vh] overflow-hidden",
              isDragging && "cursor-grabbing shadow-2xl scale-105",
              className,
            )}
          >
            <div
              data-system-bar
              className="flex items-center justify-between p-4 border-b-0 flex-shrink-0 drag-handle cursor-grab active:cursor-grabbing rounded-t-2xl transition-colors duration-300"
              style={glassStyle}
            >
              <div className="flex items-center gap-3">
                <GripVertical className="h-5 w-5 text-muted-foreground" />
                <DialogPrimitive.Title className="font-bold text-lg flex items-center gap-2 text-foreground">
                  <ProductHeader productImage={productImage} productName={productName} title={title} />
                </DialogPrimitive.Title>
              </div>
              <div className="flex items-center gap-1" onPointerDown={(e) => e.stopPropagation()} onMouseDown={(e) => e.stopPropagation()}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-foreground transition-colors bg-transparent hover:bg-transparent"
                  style={glassIconStyle}
                  onClick={(e) => {
                    e.stopPropagation()
                    onMaximize()
                  }}
                  aria-label="Pantalla completa"
                >
                  <Maximize className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-foreground transition-colors bg-transparent hover:bg-transparent"
                  style={glassIconStyle}
                  onClick={(e) => {
                    e.stopPropagation()
                    onMinimize()
                  }}
                  aria-label="Minimizar"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive transition-colors bg-transparent hover:bg-transparent"
                  style={glassIconStyle}
                  onClick={(e) => {
                    e.stopPropagation()
                    onClose()
                  }}
                  aria-label="Cerrar"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div
              role="document"
              aria-label={productName || title || "Modal content"}
              tabIndex={-1}
              className="overflow-y-auto flex-1 px-6 py-4 bg-background shadow-lg group/dialog-content"
              data-view="dialog"
            >
              {children}
            </div>
            {footerWithGlass && (
              <div className="p-4 border-t border-border flex-shrink-0 rounded-b-2xl bg-background shadow-lg">
                <div className="flex justify-center gap-2">{footerWithGlass}</div>
              </div>
            )}
          </DraggableWrapper>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  )
}

const MobileDrawer = ({
  children,
  isOpen,
  onClose,
  title,
  className,
  footer,
  onMinimize,
  onMaximize,
  productImage,
  productName,
  onOpenChange,
  onAnimationEnd,
  baseZIndex = 1000,
  dismissible = false,
}: ResizableDialogProps & {
  onMinimize: () => void
  onMaximize: () => void
  onOpenChange?: (open: boolean) => void
  onAnimationEnd?: (open: boolean) => void
}) => {
  const [zIndex, setZIndex] = React.useState(baseZIndex)
  const { style: glassStyle } = useLiquidGlass({ intensity: "medium", satin: true })
  const { style: glassIconStyle } = useLiquidGlass({ intensity: "subtle", variant: "natural" })
  const { style: footerGlassStyle } = useLiquidGlass({ intensity: "subtle", variant: "natural" })
  const footerWithGlass = React.useMemo(() => applyGlassToFooterButtons(footer, footerGlassStyle), [footer, footerGlassStyle])

  React.useEffect(() => {
    if (isOpen) {
      const newZIndex = allocateModalZIndex(baseZIndex)
      setZIndex(newZIndex)
    }
  }, [isOpen, baseZIndex])

  return (
    <Drawer.Root
      open={isOpen}
      onOpenChange={onOpenChange || ((open) => !open && onClose())}
      onAnimationEnd={onAnimationEnd}
      dismissible={dismissible}
      repositionInputs={false}
    >
      <Drawer.Portal>
        <Drawer.Overlay
          className="fixed inset-0 bg-black/40 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 duration-300"
          style={{ zIndex: zIndex - 1 }}
        />
        <Drawer.Content
          className={cn(
            "bg-background flex flex-col rounded-t-[10px] fixed bottom-0 left-0 right-0 h-auto max-h-[100dvh]",
            "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 duration-300 ease-in-out",
            className,
          )}
          style={{ zIndex }}
          aria-describedby={undefined}
        >
          <div
            className={cn(
              "bg-transparent rounded-t-[10px] flex-1 min-h-0 px-0",
            )}
          >
            <div className={cn("w-full max-w-none mx-0", "flex flex-col min-h-0")}>
              <div
                className="flex flex-col rounded-t-xl"
                style={glassStyle}
              >
                <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-zinc-300/50 mt-3 mb-3" />
                <div className="flex items-center justify-between px-3 pb-3">
                  <div className="flex items-center gap-2">
                    {productImage && (
                      productImage.startsWith("data:application/pdf") ? (
                        <div className="w-6 h-6 rounded flex items-center justify-center bg-muted flex-shrink-0">
                          <FileText className="h-3.5 w-3.5 text-primary" />
                        </div>
                      ) : (
                        <img
                          src={productImage || "/placeholder.svg"}
                          alt={productName || "Producto"}
                          className="w-6 h-6 rounded object-cover flex-shrink-0"
                        />
                      )
                    )}
                    <Drawer.Title className="font-medium text-foreground">{productName || title || "Modal"}</Drawer.Title>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 bg-transparent hover:bg-transparent"
                      style={glassIconStyle}
                      onClick={onMaximize}
                      aria-label="Pantalla completa"
                    >
                      <Maximize className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 bg-transparent hover:bg-transparent"
                      style={glassIconStyle}
                      onClick={onMinimize}
                      aria-label="Minimizar"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Drawer.Close asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 bg-transparent hover:bg-transparent"
                        style={glassIconStyle}
                        onClick={onClose}
                        aria-label="Cerrar"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </Drawer.Close>
                  </div>
                </div>
              </div>
              <div className="overflow-y-auto flex-1 min-h-0 max-h-[calc(100dvh-180px)] bg-background p-4 group/dialog-content" data-view="mobile">
                {children}
              </div>
              {footerWithGlass && (
                <div className="mt-0 pt-4 border-t pb-[env(safe-area-inset-bottom)] bg-background">
                  <div className="flex justify-center gap-2 px-4 pb-4">{footerWithGlass}</div>
                </div>
              )}
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}

export function ResizableDialog({
  children,
  isOpen,
  onClose,
  title,
  className,
  footer,
  productImage,
  productName,
  baseZIndex,
  mobileFullWidth,
  dismissible = false,
}: ResizableDialogProps) {
  const isMobile = useMediaQuery("(max-width: 640px)")
  const [isMinimized, setIsMinimized] = React.useState(false)
  const [isFullscreen, setIsFullscreen] = React.useState(false)
  const [mounted, setMounted] = React.useState(isOpen)
  const [internalOpen, setInternalOpen] = React.useState(isOpen)

  React.useEffect(() => {
    if (isOpen) {
      setMounted(true)
      setInternalOpen(true)
    } else {
      setInternalOpen(false)
    }
  }, [isOpen])

  const handleAnimationEnd = (open: boolean) => {
    if (!open) {
      setMounted(false)
    }
  }

  React.useEffect(() => {
    if (!isOpen && !isMobile && mounted) {
      const timer = setTimeout(() => {
        setMounted(false)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [isOpen, isMobile, mounted])

  React.useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        event.preventDefault()
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscapeKey)
    }

    return () => {
      document.removeEventListener("keydown", handleEscapeKey)
    }
  }, [isOpen, onClose])

  React.useEffect(() => {
    if (!isOpen) {
      setIsMinimized(false)
      setIsFullscreen(false)
    }
  }, [isOpen])

  const handleClose = () => {
    setInternalOpen(false)
    setIsMinimized(false)
    setIsFullscreen(false)
    onClose()
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      handleClose()
    }
  }

  const handleMinimize = () => setIsMinimized(true)
  const handleMaximize = () => setIsFullscreen(true)
  const handleRestore = () => setIsMinimized(false)
  const handleExitFullscreen = () => setIsFullscreen(false)

  const commonProps = {
    isOpen: internalOpen && !isMinimized && !isFullscreen,
    onClose: handleClose,
    onMinimize: handleMinimize,
    onMaximize: handleMaximize,
    title,
    className,
    footer,
    productImage,
    productName,
    onOpenChange: handleOpenChange,
    baseZIndex,
    mobileFullWidth,
  }

  if (!mounted) return null

  return (
    <AnimatePresence
      onExitComplete={() => {
        if (!isOpen) setMounted(false)
      }}
    >
      {mounted && (
        <>
          {isMinimized ? (
            <MinimizedView
              onRestore={handleRestore}
              onClose={handleClose}
              title={title}
              isMobile={isMobile}
              productImage={productImage}
              productName={productName}
            />
          ) : isFullscreen ? (
            <FullscreenView
              onExit={handleExitFullscreen}
              onClose={handleClose}
              title={title}
              footer={footer}
              productImage={productImage}
              productName={productName}
              baseZIndex={baseZIndex}
            >
              {children}
            </FullscreenView>
          ) : isMobile ? (
            <MobileDrawer
              {...commonProps}
              onAnimationEnd={handleAnimationEnd}
            >
              {children}
            </MobileDrawer>
          ) : (
            <DesktopDialog
              {...commonProps}
            >
              {children}
            </DesktopDialog>
          )}
        </>
      )}
    </AnimatePresence>
  )
}

// Export the ModalContainer component for backward compatibility
export function ModalContainer({
  isOpen,
  onClose,
  title,
  children,
  footer,
  className,
  productImage,
  productName,
  baseZIndex,
}: ModalContainerProps) {
  return (
    <ResizableDialog
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      className={className}
      footer={footer}
      productImage={productImage}
      productName={productName}
      baseZIndex={baseZIndex}
    >
      {children}
    </ResizableDialog>
  )
}
