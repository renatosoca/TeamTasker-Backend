import { Router } from 'express';
import { authUser } from '../controllers';

const router = Router();

router.post( '/login', authUser );


export default router;