import express from 'express';
import dotenv from 'dotenv/config';
import cors from 'cors';

const app = express();

app.use( cors({ origin: "*" }) );
app.use( express.json() );



const port = process.env.PORT || 4000;
app.listen( port, () => {
  console.log( `Server is running on port ${port}` );
});