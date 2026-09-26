/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Public base URL baked into share links / QR codes for static hosting (optional) */
  readonly VITE_PUBLIC_URL?: string;
  /** Google Form (or similar) link for cultural-content feedback (optional) */
  readonly VITE_FEEDBACK_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
