import { Response, Request } from 'express';
import { userModel } from '../models';
import { AuthRequest, AuthResponse, MessageResponse } from '../types';
import { generateToken, generateJWT } from '../helpers';

const authUser = async ( req: Request, res: Response ): Promise< Response<AuthResponse | MessageResponse> >  => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email });
    if ( !user ) return res.status(404).json({ ok: false, msg: 'User not found' });
    if ( !user.confirmed ) return res.status(401).json({ ok: false, msg: 'User not confirmed' });
    
    const validPassword = user.comparePassword( password );
    if ( !validPassword ) return res.status(401).json({ ok: false, msg: 'Invalid password' });

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
    return res.status(500).json({ 
      ok: false, 
      msg: 'Ocurrio un problema, comuniquese con el administrador' 
    });
  }
}

const registerUser = async ( req: Request, res: Response ): Promise< Response<MessageResponse> > => {
  const { email } = req.body;

  try {
    const userExist = await userModel.findOne({ email });
    if ( userExist ) return res.status(400).json({ ok: false, msg: 'User already exist' });

    const user = new userModel( req.body );
    await user.save();
    
    //Enviar email
    
    return res.status(201).json({ 
      ok: true, 
      msg: 'Hemos enviado las instrucciones a su correo electrónico' 
    });
  } catch (error) {
    return res.status(500).json({ 
      ok: false, 
      msg: 'Ocurrio un problema, comuniquese con el administrador' 
    });
  }
}

//Pruebas faltan
const confirmAccount = async ( req: Request, res: Response ): Promise< Response<MessageResponse> > => {
  const { token } = req.params;

  try {
    const user = await userModel.findOne({ token });
    if ( !user ) return res.status(401).json({ ok: false, msg: 'Token no válido o expirado'});
    if ( user?.confirmed ) return res.status(401).json({ ok: false, msg: 'Su cuenta ya ha sido confirmada anteriormente, por lo que no es necesario que intente confirmarla de nuevo. Por favor, utilice la información de inicio de sesión que se le proporcionó anteriormente para acceder a su cuenta.'});

    user.confirmed = true;
    user.token = '';
    await user.save();

    return res.status(201).json({
      ok: true,
      msg: 'Cuenta confirmada correctamente'
    })
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: 'Error del sistema, comuniquese con el administrador'
    })
  }
}

const forgotPassword = async ( req: Request, res: Response ): Promise< Response<MessageResponse> > => {
  const { email } = req.body;

  try {
    const user = await userModel.findOne({ email });
    if ( !user ) return res.status(404).json({ ok: false, msg: 'No existe un usuario con ese correo electrónico' });
    if ( !user.confirmed ) return res.status(401).json({ ok: false, msg: 'Falta confirmar su correo electronico' });

    user.token = generateToken();
    //Guardar usuario

    //Enviar Email

    return res.status(201).json({
      ok: true,
      msg: 'Hemos enviado las instrucciones a su correo electrónico'
    })

  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: 'Error del sistema, comuniquese con el administrador'
    })
  }
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

const revalidateJWT = async ( req: AuthRequest, res: Response ): Promise< Response<AuthResponse | MessageResponse> > => {
  try {
    const { _id, name, lastname, email } = req.user;
    return res.status(200).json({
      ok: true,
      _id,
      name,
      lastname,
      email,
      jwt: generateJWT({ _id, name }),
    })
  } catch (error) {
    return res.status(500).json({ ok: false, msg: 'Error del sistema, comuniquese con el administrador'})
  }
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