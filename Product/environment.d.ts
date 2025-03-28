declare global {
    namespace NodeJS {
      interface ProcessEnv {
        DB_HOST: string
        DB_PORT: number
        DB_USER:string
        DB_PASSWORD:string
        DB_NAME:string
        PORT:number,
        JWT_SECRET_KEY: string ,
        JWT_SECRET_KEY_USER:string
      }
    }
  }
 
  
  export {};
    