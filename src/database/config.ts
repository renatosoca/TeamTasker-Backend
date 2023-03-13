import { set, connect, ConnectOptions } from 'mongoose';

export const dbConnect = async (): Promise<void> => {
  set( 'strictQuery', false );
  
  try {
    const db = await connect( process.env.MONGO_URI!, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectOptions );

    console.log(`PORT: ${db.connection.port} | Database: ${db.connection.name}`);

  } catch (error) {
    console.log(error);
    throw new Error('Error connecting to database');
  }
}