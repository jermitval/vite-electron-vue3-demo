/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** 应用名称 */
  readonly VITE_APP_TITLE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
