import { Response, NextFunction } from 'express';
import { verifyJWT } from '../helpers';
import { UserResquestProvider } from '../interfaces';
import { userModel } from '../models';

export const checkSesion = async ( req: UserResquestProvider, res: Response, next: NextFunction ) => {
  let token: string | undefined;

  if ( req.headers.authorization && req.headers.authorization.startsWith('Bearer') ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const payload = verifyJWT(token);

      req.user = await userModel.findById(payload._id).select('-password -token -confirmed -createdAt -updatedAt -__v') ?? undefined;
      if ( !req.user) return res.status(404).json({ ok: false, msg: 'Usuario no encontrado'});

      return next();
    } catch (error) {
      return res.status(401).json({ ok: false, msg: 'Token no valido' });
    }
  }

  if ( !token ) return res.status(401).json({ ok: false, msg: 'No hay token en la peticion' });
  next();
}