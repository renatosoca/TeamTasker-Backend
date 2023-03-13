import { Response, Request } from 'express';
import { userModel } from '../models';
import { generateJWT } from '../helpers/generateJWT';
//import { AuthRequest } from '../types';

const authUser = async ( req: Request, res: Response ) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email });
    if ( !user ) return res.status(404).json({ ok: false, message: 'User not found' });
    if ( !user.confirmed ) return res.status(401).json({ ok: false, message: 'User not confirmed' });
    
    const validPassword = user.comparePassword( password );
    if ( !validPassword ) return res.status(401).json({ ok: false, message: 'Invalid password' });

    const { _id, name, lastname } = user;

    return res.status(202).json({
      ok: true,
      _id,
      name,
      lastname,
      email,
      jwt: generateJWT({ _id, name }),
    });
  } catch (error) {
    return res.status(500).json({ ok: false, message: 'Ocurrio un problema, comuniquese con el administrador' });
  }
}

const registerUser = async ( req: Request, res: Response ) => {
  const { email } = req.body;

  try {
    const userExist = await userModel.findOne({ email });
    if ( userExist ) return res.status(400).json({ ok: false, message: 'User already exist' });

    const user = new userModel( req.body );
    await user.save();
    
    return res.status(201).json({ ok: true, message: 'Hemos enviado las instrucciones a su correo electrónico' });
  } catch (error) {
    return res.status(500).json({ ok: false, message: 'Ocurrio un problema, comuniquese con el administrador' });
  }
}

const confirmAccount = async ( _req: Request, res: Response ): Promise<void> => {
  res.status(200).json( { message: 'confirmAccount' } );
}

const forgotPassword = async ( _req: Request, res: Response ): Promise<void> => {
  res.status(200).json( { message: 'forgotPassword' } );
}

const resetPassword = async ( _req: Request, res: Response ): Promise<void> => {
  res.status(200).json( { message: 'resetPassword' } );
}

const userProfile = async ( _req: Request, res: Response ): Promise<void> => {
  res.status(200).json( { message: 'profileUser' } );
}

const updateUserProfile = async ( _req: Request, res: Response ): Promise<void> => {
  res.status(200).json( { message: 'updateUserProfile' } );
}

const updateUserPassword = async ( _req: Request, res: Response ): Promise<void> => {
  res.status(200).json( { message: 'updateUserPassword' } );
}

const revalidateJWT = async ( _req: Request, _res: Response ) => {
  /* const { _id, name, lastname, email } = req.user;
  return res.status(200).json({
    _id,
    name,
    lastname,
    email,
    jwt: generateJWT({ _id, name }),
  }) */
}

export {
  authUser,
  registerUser,
  confirmAccount,
  forgotPassword,
  resetPassword,
  userProfile,
  updateUserProfile,
  updateUserPassword,
  revalidateJWT
}