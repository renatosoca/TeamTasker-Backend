import { Response, NextFunction } from 'express';
import { verifyJWT } from '../helpers';
import { UserResquestProvider } from '../interfaces';
import { userModel } from '../models';

export const checkSesion = async ( req: UserResquestProvider, res: Response, next: NextFunction ) => {
  const token: string = req.header('x-token') || '';
  if ( !token ) return res.status(401).json({ ok: false, message: 'No hay un token en la petición' });

  try {
    const { _id } = verifyJWT( token );
    if ( !_id ) return  res.status(401).json({ ok: false, message: 'Por favor, proporcione un token válido' });

    req.user = await userModel.findById( _id ).select('-password -token -confirmed -createdAt -updatedAt -__v') ?? undefined;
 
    if( !req.user ) return res.status(404).json({ ok: false, message: 'User not found' });

    return next();
  } catch (error) {
    return res.status(401).json({ ok: false, message: 'Sesión inválida' });
  }
}