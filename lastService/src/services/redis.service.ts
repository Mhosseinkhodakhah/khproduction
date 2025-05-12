import { createClient, RedisClientType } from 'redis';


const client: RedisClientType = createClient({
    url: 'redis://localhost:6379',
    // password: process.env.REDIS_PASSWORD // Good practice: use environment variables
  });

  export async function connectRedis(): Promise<void> {
    await client.connect();
    console.log('Successfully connected to Redis');
  }
  // Error handling
  client.on('error', (err: Error) => {
    console.error('Redis connection error:', err);
  });




export class cacher {

    async setter( key : string, msg : string){
        await client.set(key , msg);
    }

    async getter(key : string){
        console.log('cache is >>> ' ,  await client.get(key))
        return await client.get(key)
    }

    async deleter(key : string){
        await client.del(key)
    }

}



// export async function basicStringOperations(): Promise<void> {
//     // Setting a value  
//     await client.set('test1', 'its a test for testing a bit test');
    
//     // Retrieving a value
//     const value: string | null = await client.get('test1');
//     console.log(value); // Output: value
    
//     // Setting with expiration (10 seconds)
//     await client.set('test1', 'hello its fucking testtttt >>>>> ', {
//         EX: 10
//     });

//     // Getting the value before expiration
//     const temporaryValue: string | null = await client.get('test1');
//     console.log(temporaryValue); // Output: temporary_value

//     // Waiting for the key to expire
//     // await new Promise(resolve => setTimeout(resolve, 11000));
    
//     // Getting the value after expiration
//     const expiredValue: string | null = await client.get('test1');
//     console.log('after getting from cache >>> ' , expiredValue); // Output: null
// }