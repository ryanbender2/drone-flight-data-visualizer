
declare global {
  interface ProcessEnv {
    readonly NODE_ENV: "development" | "production" | "test"
    readonly GOOGLE_MAPS_APIKEY: string
    readonly GOOGLE_MAP_ID: string
    readonly FIREBASE_APIKEY: string
  }

  interface NodeJS {
    readonly env: ProcessEnv
  }
}
