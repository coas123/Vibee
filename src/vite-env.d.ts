/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APPLE_MUSIC_DEVELOPER_TOKEN?: string;
  readonly VITE_APP_NAME?: string;
  readonly VITE_APP_BUILD?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
