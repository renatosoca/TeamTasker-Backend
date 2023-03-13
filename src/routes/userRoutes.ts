import { Router } from 'express';
import {  confirmAccount, forgotPassword, resetPassword, updateUserPassword, updateUserProfile, userProfile } from '../controllers';
import { jwtValidation } from '../middlewares';

const router = Router();

//router.post( '/login', authUser );
//router.post( '/register', registerUser );
router.get( '/confirm-account/:token', confirmAccount );
router.post( '/forgot-password', forgotPassword );
router.post( '/reset-password', resetPassword );

router.use( jwtValidation );

//router.get( '/revalidate-jwt', revalidateJWT );
router.get('/user-profile', userProfile );
router.put( '/user-profile/:id', updateUserProfile );
router.put( '/user-password/:id', updateUserPassword );

export default router;