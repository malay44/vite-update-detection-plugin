import { useCallback, useEffect, useRef } from "react";

interface ILookForVersionChange extends Function {
  (): Promise<boolean>;
}

export default function useVersionChangeDetection(
  onChange?: () => void
): ILookForVersionChange {
  const interval = +import.meta.env.VITE_APP_VERSION_POLL_INTERVAL || 0;
  const initialVersion = import.meta.env.VITE_APP_VERSION;
  const timeoutRef = useRef<NodeJS.Timeout>();

  const checkVersion = useCallback(async () => {
    if (import.meta.env.DEV || import.meta.env.SSR) return false;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (interval) {
      timeoutRef.current = setTimeout(checkVersion, interval);
    }

    const versionFile = import.meta.env.VITE_APP_VERSION_FILE;
    const baseUrl = import.meta.env.BASE_URL || "/";
    const fetchUrl = `${baseUrl}${versionFile}`;

    try {
      const response = await fetch(fetchUrl, {
        headers: {
          pragma: "no-cache",
          "cache-control": "no-cache",
        },
      });

      if (!response.ok) {
        throw new Error(`Version check failed: ${response.status}`);
      }

      const { version } = await response.json();
      const isUpdated = version !== initialVersion;

      if (isUpdated && onChange) {
        onChange();
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      }

      return isUpdated;
    } catch (error) {
      console.error(error);
      return false;
    }
  }, [initialVersion, interval, onChange]);

  useEffect(() => {
    if (interval) {
      timeoutRef.current = setTimeout(checkVersion, interval);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [checkVersion, interval]);

  return checkVersion;
}
