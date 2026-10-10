/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Set by Vite's github-pages build mode; this host has no application server. */
  readonly VITE_STATIC_SITE?: string;
  /** Public base URL baked into share links / QR codes for static hosting (optional) */
  readonly VITE_PUBLIC_URL?: string;
  /** Google Form (or similar) link for cultural-content feedback (optional) */
  readonly VITE_FEEDBACK_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
