/**
 * Simple toast notification utility
 * If you're using a library like react-hot-toast or sonner, replace this with that
 */

type ToastType = "success" | "error" | "info" | "warning";

interface ToastOptions {
  duration?: number;
  position?: "top-center" | "top-right" | "bottom-center" | "bottom-right";
}

function createToast(message: string, type: ToastType, options: ToastOptions = {}) {
  const { duration = 3000, position = "top-center" } = options;

  // Create toast element
  const toast = document.createElement("div");
  toast.className = getToastClasses(type, position);
  toast.textContent = message;
  toast.setAttribute("role", "alert");
  toast.setAttribute("aria-live", type === "error" ? "assertive" : "polite");

  // Add to DOM
  document.body.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => {
    toast.classList.add("opacity-100", "translate-y-0");
  });

  // Remove after duration
  setTimeout(() => {
    toast.classList.remove("opacity-100", "translate-y-0");
    toast.classList.add("opacity-0", "-translate-y-2");
    
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 300);
  }, duration);
}

function getToastClasses(type: ToastType, position: string): string {
  const baseClasses = [
    "fixed",
    "z-50",
    "px-4",
    "py-3",
    "rounded-lg",
    "shadow-lg",
    "font-medium",
    "text-sm",
    "transition-all",
    "duration-300",
    "opacity-0",
    "-translate-y-2",
    "max-w-md",
  ];

  // Position classes
  const positionClasses: Record<string, string[]> = {
    "top-center": ["top-4", "left-1/2", "-translate-x-1/2"],
    "top-right": ["top-4", "right-4"],
    "bottom-center": ["bottom-4", "left-1/2", "-translate-x-1/2"],
    "bottom-right": ["bottom-4", "right-4"],
  };

  // Type-specific classes
  const typeClasses: Record<ToastType, string[]> = {
    success: ["bg-green-600", "text-white"],
    error: ["bg-red-600", "text-white"],
    info: ["bg-blue-600", "text-white"],
    warning: ["bg-orange-600", "text-white"],
  };

  return [
    ...baseClasses,
    ...positionClasses[position],
    ...typeClasses[type],
  ].join(" ");
}

export const toast = {
  success: (message: string, options?: ToastOptions) => 
    createToast(message, "success", options),
  
  error: (message: string, options?: ToastOptions) => 
    createToast(message, "error", options),
  
  info: (message: string, options?: ToastOptions) => 
    createToast(message, "info", options),
  
  warning: (message: string, options?: ToastOptions) => 
    createToast(message, "warning", options),
};

// Alternative: If using react-hot-toast
// import { toast as hotToast } from 'react-hot-toast';
// export const toast = hotToast;