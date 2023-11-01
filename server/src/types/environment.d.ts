export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DB_PROTOCOL: "mongodb"
      DB_PORT?: number
      DB_HOST: string
      DB_USER: string
      DB_PASS: string
      DB_NAME: string
    }
  }
}
