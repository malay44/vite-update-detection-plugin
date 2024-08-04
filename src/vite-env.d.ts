/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_VERSION: string;
  readonly VITE_APP_VERSION_FILE: string;
  readonly VITE_APP_VERSION_POLL_INTERVAL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
