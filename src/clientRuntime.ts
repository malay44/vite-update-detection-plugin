import { useEffect } from "react";

interface ILookForVersionChange extends Function {
  (): Promise<boolean>;
}

export default function useVersionChangeDetection(
  onChange?: () => void
): ILookForVersionChange {
  const interval = +(
    /** @type {string} */ import.meta.env.VITE_APP_VERSION_POLL_INTERVAL
  );
  const initial = import.meta.env.VITE_APP_VERSION;

  let timeout: NodeJS.Timeout;

  async function check() {
    if (import.meta.env.DEV || import.meta.env.SSR) return false;

    clearTimeout(timeout);

    if (interval) timeout = setTimeout(check, interval);

    const file = import.meta.env.VITE_APP_VERSION_FILE;
    const base = import.meta.env.BASE_URL || "/";
    const fetchUrl = base === "/" ? `/${file}` : `${base}/${file}`;

    const res = await fetch(fetchUrl, {
      headers: {
        pragma: "no-cache",
        "cache-control": "no-cache",
      },
    });

    if (res.ok) {
      const { version } = await res.json();
      const updated = version !== initial;

      if (updated) {
        onChange && onChange();
        clearTimeout(timeout);
      }

      return updated;
    } else {
      throw new Error(`Version check failed: ${res.status}`);
    }
  }

  useEffect(() => {
    if (interval) timeout = setTimeout(check, interval);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  return check;
}
