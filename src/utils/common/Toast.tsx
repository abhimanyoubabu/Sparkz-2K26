"use client";

import {
  Toaster,
  toast,
  ToasterProps,
  Toast,
  ToastOptions,
} from "react-hot-toast";
import { motion } from "framer-motion";
import {
  X,
  Check,
  Loader2 as Loader,
  Info,
} from "lucide-react";

/* ---------------------------------------------------
   Gradients
--------------------------------------------------- */

const accentGradient =
  "bg-gradient-to-r from-indigo-500/30 via-fuchsia-500/25 to-amber-400/25";

const successGradient =
  "bg-gradient-to-r from-emerald-500/30 to-teal-500/25";

const errorGradient =
  "bg-gradient-to-r from-red-500/30 to-rose-500/25";

const warningGradient =
  "bg-gradient-to-r from-amber-500/30 to-orange-500/25";

/* ---------------------------------------------------
   Types
--------------------------------------------------- */

interface CustomToastProps extends ToastOptions {
  id: string;
  title?: string;
  description?: string;
  type?: Toast["type"];
}

/* ---------------------------------------------------
   Toast UI
--------------------------------------------------- */

const CustomToast = ({
  id,
  title,
  description,
  type = "blank",
}: CustomToastProps) => {
  const gradient =
    type === "success"
      ? successGradient
      : type === "error"
      ? errorGradient
      : type === "loading"
      ? warningGradient
      : accentGradient;

  const iconColor =
    type === "success"
      ? "text-emerald-400"
      : type === "error"
      ? "text-red-400"
      : type === "loading"
      ? "text-amber-400"
      : "text-indigo-400";

  return (
    <motion.div
      initial={{ opacity: 0, y: 18, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -12, scale: 0.96 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="relative flex w-full max-w-md items-center gap-4 overflow-hidden rounded-2xl border border-white/10 bg-black/40 p-4 shadow-xl backdrop-blur-md"
    >
      {/* Icon */}
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconColor}`}
      >
        {type === "success" && <Check className="h-5 w-5" />}
        {type === "error" && <X className="h-5 w-5" />}
        {type === "loading" && (
          <Loader className="h-5 w-5 animate-spin" />
        )}
        {type === "blank" && <Info className="h-5 w-5" />}
      </div>

      {/* Text */}
      <div className="min-w-0 flex-1">
        {title && (
          <h3 className="text-sm font-semibold text-white">
            {title}
          </h3>
        )}
        {description && (
          <p className="mt-0.5 text-sm leading-relaxed text-white/80">
            {description}
          </p>
        )}
      </div>

      {/* Close */}
      <button
        onClick={() => toast.dismiss(id)}
        className="flex h-6 w-6 items-center justify-center rounded-full text-white/40 transition hover:text-white"
      >
        <X className="h-3 w-3" />
      </button>

      {/* Gradient */}
      <div
        className={`pointer-events-none absolute inset-0 -z-10 ${gradient} opacity-80`}
      />
    </motion.div>
  );
};

/* ---------------------------------------------------
   Toast Helpers
--------------------------------------------------- */

export const showCustomToast = (
  message: string,
  options: Omit<CustomToastProps, "id"> = {}
) => {
  return toast.custom(
    (t) => (
      <CustomToast
        id={t.id}
        title={options.title}
        description={message}
        type={options.type}
      />
    ),
    {
      duration: options.duration ?? 4000,
    }
  );
};

export const toastSuccess = (message: string, title?: string) =>
  showCustomToast(message, { title, type: "success" });

export const toastError = (message: string, title?: string) =>
  showCustomToast(message, { title, type: "error" });

export const toastLoading = (message: string, title?: string) =>
  showCustomToast(message, { title, type: "loading" });

export const toastInfo = (message: string, title?: string) =>
  showCustomToast(message, { title, type: "blank" });

/* ---------------------------------------------------
   Toaster
--------------------------------------------------- */

export const CustomToaster: React.FC<ToasterProps> = (props) => {
  return (
    <Toaster
      position="bottom-center"
      gutter={12}
      containerStyle={{
        bottom: "1.25rem",
        pointerEvents: "none",
      }}
      toastOptions={{
        duration: 4000,
        style: {
          background: "transparent",
          padding: 0,
          boxShadow: "none",
        },
      }}
      {...props}
    >
      {(t: Toast) => (
        <div className="pointer-events-auto">
          <CustomToast
            id={t.id}
            description={
              typeof t.message === "string" ? t.message : ""
            }
            type={t.type ?? "blank"}
          />
        </div>
      )}
    </Toaster>
  );
};
