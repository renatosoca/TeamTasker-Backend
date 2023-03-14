import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import { dbConnect } from './database/config';
import { authRoutes, projectRoutes } from './routes';

const app = express();
dbConnect();

app.use( cors({ origin: "*" }));
app.use( express.json());

app.use( '/api/auth', authRoutes );
app.use( '/api/project', projectRoutes );

const port = process.env.PORT || 3001;
app.listen( port, () => {
  console.log(`Server running on port http://localhost:${port}`);
})