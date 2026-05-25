import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { joinClassNames } from "./wrappers/shared";
import { generateRandomUUID } from "../helpers/uuid";

const TOAST_TIMEOUT_MS = 5000;

type ToastType = "error" | "warning" | "success";

type ToastInput = {
  message: string;
  type: ToastType;
};

type Toast = ToastInput & {
  id: string;
};

type ToastContextValue = {
  setToast(toast: ToastInput): void;
};

type ToastProviderProps = {
  children: ReactNode;
};

type ToastMessageProps = {
  toast: Toast;
  onClose(id: string): void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

const toastClassNames: Record<ToastType, string> = {
  error: "border-danger bg-danger-soft text-danger-text",
  success: "border-success bg-success-soft text-success-text",
  warning: "border-warning bg-warning-soft text-warning-text",
};

const toastLabels: Record<ToastType, string> = {
  error: "Error",
  success: "Success",
  warning: "Warning",
};

function ToastMessage({ toast, onClose }: ToastMessageProps) {
  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      onClose(toast.id);
    }, TOAST_TIMEOUT_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [onClose, toast.id]);

  return (
    <div
      className={joinClassNames(
        "pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-lg border px-4 py-3 shadow-md",
        toastClassNames[toast.type],
      )}
      role={toast.type === "error" ? "alert" : "status"}
    >
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold leading-5">
          {toastLabels[toast.type]}
        </p>
        <p className="mt-1 break-words text-sm leading-5">{toast.message}</p>
      </div>
      <button
        aria-label={`Close ${toastLabels[toast.type].toLowerCase()} toast`}
        className="inline-flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-md text-lg leading-none opacity-70 transition hover:bg-surface/50 hover:opacity-100"
        onClick={() => {
          onClose(toast.id);
        }}
        type="button"
      >
        x
      </button>
    </div>
  );
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const closeToast = useCallback((id: string) => {
    setToasts((currentToasts) =>
      currentToasts.filter((toast) => toast.id !== id),
    );
  }, []);

  const setToast = useCallback((toast: ToastInput) => {
    setToasts((currentToasts) => [
      ...currentToasts,
      {
        ...toast,
        id: generateRandomUUID(),
      },
    ]);
  }, []);

  const contextValue = useMemo<ToastContextValue>(
    () => ({
      setToast,
    }),
    [setToast],
  );

  return (
    <ToastContext value={contextValue}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed left-1/2 top-5 z-50 flex w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 flex-col gap-2"
      >
        {toasts.map((toast) => (
          <ToastMessage key={toast.id} onClose={closeToast} toast={toast} />
        ))}
      </div>
    </ToastContext>
  );
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);

  if (context === null) {
    throw new Error("useToast must be used inside ToastProvider");
  }

  return context;
}
