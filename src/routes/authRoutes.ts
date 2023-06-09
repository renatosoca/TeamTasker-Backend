import { Router } from 'express';
import {
  authUser, confirmAccount, forgotPassword, registerUser, resetPassword, revalidateJWT, updateUserPassword, updateUserProfile 
} from '../controllers';
import { checkSesion } from '../middlewares';

const router = Router();

router.post( '/login', authUser );
router.post( '/register', registerUser );
router.get( '/confirm-account/:token', confirmAccount );
router.post( '/forgot-password', forgotPassword );
router.post( '/reset-password/:token', resetPassword );

router.use( checkSesion );

router.get( '/revalidate-jwt', revalidateJWT );
//router.get('/user-profile', userProfile );
router.put( '/user-profile/:id', updateUserProfile );
router.put( '/user-password/:id', updateUserPassword );

export default router;