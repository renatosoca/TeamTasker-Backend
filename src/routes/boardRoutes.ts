import { Router } from 'express';
import { createBoard } from '../controllers';
import { checkSesion } from '../middlewares';

const router = Router();

router.use( checkSesion );

router.post('/', createBoard );

export default router;