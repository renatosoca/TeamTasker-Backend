import jwt from 'jsonwebtoken';
import { jwtPayload } from '../types';

export const generateJWT = ( payload: jwtPayload ): string => {
  return jwt.sign( payload, process.env.JWT_KEY_SECRET!, {
    expiresIn: '2h'
  });
}