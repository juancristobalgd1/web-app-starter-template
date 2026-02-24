"use client";

import { cn } from "@/lib/utils";
import { useLiquidGlass } from "@/components/ui/satin-liquid-glass";
import Link, { type LinkProps } from "next/link";
import React, { useState, createContext, useContext, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";

interface Links {
  label: string;
  href: string;
  icon: React.ReactElement | React.ReactNode;
}

interface SidebarContextProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  animate: boolean;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(undefined);

export const useSidebar = () => {
  const ctx = useContext(SidebarContext);
  if (!ctx) throw new Error("useSidebar must be used within a SidebarProvider");
  return ctx;
};

export const SidebarProvider = ({
  children,
  open: openProp,
  setOpen: setOpenProp,
  animate = true,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  const [openState, setOpenState] = useState(false);
  const open = openProp !== undefined ? openProp : openState;
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;
  return (
    <SidebarContext.Provider value={{ open, setOpen, animate }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const Sidebar = ({
  children, open, setOpen, animate,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => (
  <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
    {children}
  </SidebarProvider>
);

export const SidebarBody = (props: React.ComponentProps<typeof motion.div>) => (
  <>
    <DesktopSidebar {...props} />
    <MobileSidebar  {...(props as React.ComponentProps<"div">)} />
  </>
);

export const DesktopSidebar = ({ className, children, ...props }: React.ComponentProps<typeof motion.div>) => {
  const { open, setOpen, animate } = useSidebar();
  const { style: glassStyle } = useLiquidGlass({ intensity: "medium", satin: true });

  useEffect(() => {
    const width = animate ? (open ? "300px" : "60px") : "300px";
    document.documentElement.style.setProperty("--sidebar-width", width);
  }, [open, animate]);

  return (
    <motion.div
      className={cn(
        "h-full pt-1 pb-1 hidden md:flex md:flex-col w-[var(--sidebar-width)]",
        "flex-shrink-0 px-0 relative z-[100] border-r border-sidebar-border",
        className
      )}
      style={{
        ...glassStyle,
        "--sidebar-width": animate ? (open ? "300px" : "60px") : "300px",
      } as React.CSSProperties}
      animate={{ width: animate ? (open ? "300px" : "60px") : "300px" }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const MobileSidebar = ({ className, children, ...props }: React.ComponentProps<"div">) => {
  const { open, setOpen } = useSidebar();
  const { style: glassStyle } = useLiquidGlass({ intensity: "medium", satin: true });
  return (
    <div
      className={cn("h-10 px-4 py-4 flex flex-row md:hidden items-center justify-between w-full")}
      style={glassStyle}
    >
      <div className="flex justify-end z-20 w-full">
        <Menu className="text-sidebar-foreground cursor-pointer" onClick={() => setOpen(!open)} />
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: "-100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "-100%", opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className={cn(
              "fixed h-full w-full inset-0 p-10 z-[100] flex flex-col justify-between",
              className
            )}
            style={glassStyle}
          >
            <div className="absolute right-10 top-10 z-50 text-sidebar-foreground cursor-pointer" onClick={() => setOpen(false)}>
              <X />
            </div>
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const SidebarLink = ({
  link, className, ...props
}: {
  link: Links;
  className?: string;
  props?: LinkProps;
}) => {
  const { open, animate } = useSidebar();
  return (
    <Link href={link.href} className={cn("flex items-center justify-start gap-2 group/sidebar py-2", className)} {...props}>
      {link.icon}
      <motion.span
        animate={{
          display: animate ? (open ? "inline-block" : "none") : "inline-block",
          opacity: animate ? (open ? 1 : 0) : 1,
        }}
        className="text-sidebar-foreground text-sm group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre inline-block !p-0 !m-0"
      >
        {link.label}
      </motion.span>
    </Link>
  );
};
