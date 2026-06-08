import { useEffect, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt(): Promise<void>;
  userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
};

type PwaInstallPrompt = {
  canInstall: boolean;
  install(): Promise<boolean>;
};

const isBeforeInstallPromptEvent = (
  event: Event,
): event is BeforeInstallPromptEvent => {
  return (
    "prompt" in event &&
    typeof event.prompt === "function" &&
    "userChoice" in event
  );
};

export function usePwaInstallPrompt(): PwaInstallPrompt {
  const [installPrompt, setInstallPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();

      if (isBeforeInstallPromptEvent(event)) {
        setInstallPrompt(event);
      }
    };

    const handleAppInstalled = () => {
      setInstallPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  return {
    canInstall: installPrompt !== null,
    install: async () => {
      if (installPrompt === null) {
        return false;
      }

      await installPrompt.prompt();
      await installPrompt.userChoice;
      setInstallPrompt(null);

      return true;
    },
  };
}
