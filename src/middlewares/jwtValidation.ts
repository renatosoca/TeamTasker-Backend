import { Response, NextFunction } from 'express';
import { userModel } from '../models';
import jwt from 'jsonwebtoken';
import { UserRequest } from '../types';

export const jwtValidation = async ( req: UserRequest, res: Response, next: NextFunction ) => {
  const token: string | undefined = req.header('x-token');
  if ( !token ) return res.status(401).json({ ok: false, message: 'No token provided' });

  try {
    const { _id } = jwt.verify( token, process.env.JWT_KEY_SECRET! ) as { _id: string };
    req.user = await userModel.findById( _id ).select('-password -token -confirmed -createdAt -updatedAt -__v') ?? undefined;
    if( !req.user ) return res.status(404).json({ ok: false, message: 'User not found' });

    return next();
  } catch (error) {
    return res.status(401).json({ ok: false, message: 'Invalid token' });
  }
}