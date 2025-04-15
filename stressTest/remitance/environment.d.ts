declare global {
    namespace NodeJS {
      interface ProcessEnv {
        DB_HOST: string
        DB_PORT: number
        DB_USER:string
        DB_PASSWORD:string
        DB_NAME:string
        PORT:number,
        JWT_SECRET_KEY_USER: string ,
        JWT_SECRET_KEY_ADMIN: string ,
        KAVENEGAR_API_KEY:string,
        AUTH_URL:string,
        SHAHKAR_BASE_URL:string,
        IDENTITY_INFO_URL:string,
        SHAHKAR_USER:string,
        SHAHKAR_PASSWORD:string
      }
    }
  }
 
  
  export {};
    