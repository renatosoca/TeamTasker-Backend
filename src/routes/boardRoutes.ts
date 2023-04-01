import { Router } from 'express';
import { createBoard, getBoard } from '../controllers';
import { checkSesion } from '../middlewares';

const router = Router();

router.use( checkSesion );

router.get( '/:id', getBoard );
router.route('/').post( createBoard );

export default router;