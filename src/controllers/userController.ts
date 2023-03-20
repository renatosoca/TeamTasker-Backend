import { Response, Request } from 'express';
import { userModel } from '../models';
import { comparePassword, emailForgotPassword, emailRegister, errorHttp, generateJWT, generateToken, hashPassword } from '../helpers';
import { UserResquestProvider } from '../interfaces';

const authUser = async ( { body }: Request, res: Response )  => {
  const { email, password } = body;

  try {
    const user = await userModel.findOne({ email });
    if ( !user ) return res.status(404).json({ ok: false, msg: 'No existe un usuario con ese correo electrónico' });
    if ( !user.confirmed ) return res.status(401).json({ ok: false, msg: 'Falta confirmar su correo electrónico' });
    
    const validPassword = comparePassword( password, user.password );
    if ( !validPassword ) return res.status(401).json({ ok: false, msg: 'Correo o contraseña incorrecto' });

    const { _id, name, lastname } = user;
    return res.status(202).json({
      ok: true,
      user: { _id, name, lastname, email },
      jwt: generateJWT( _id, email ),
    });
  } catch (error) {
    return errorHttp( res, 'Error del sistema, comuniquese con el administrador' );
  }
}

const registerUser = async ( { body }: Request, res: Response ) => {
  const { email, password } = body;

  try {
    const userExist = await userModel.findOne({ email });
    if ( userExist ) return res.status(400).json({ ok: false, msg: 'Correo electrónico ya en uso' });

    const user = new userModel( body );
    user.password = hashPassword( password );
    const userCreated = await user.save();
    
    emailRegister( userCreated.email, userCreated.name, userCreated.lastname, userCreated.token);
    
    return res.status(201).json({ 
      ok: true, 
      msg: 'Hemos enviado las instrucciones a su correo electrónico' 
    });
  } catch (error) {
    return errorHttp( res, 'Error del sistema, comuniquese con el administrador' );
  }
}

const confirmAccount = async ( { params }: Request, res: Response ) => {
  const { token } = params;

  try {
    const user = await userModel.findOne({ token });
    if ( !user ) return res.status(401).json({ ok: false, msg: 'Token no válido o expirado'});
    if ( user?.confirmed ) return res.status(401).json({ ok: false, msg: 'Su cuenta ya ha sido confirmada anteriormente, por lo que no es necesario que intente confirmarla de nuevo.'});

    user.confirmed = true;
    user.token = '';
    await user.save();

    return res.status(201).json({
      ok: true,
      msg: 'Cuenta confirmada correctamente'
    })
  } catch (error) {
    return errorHttp( res, 'Error del sistema, comuniquese con el administrador' );
  }
}

const forgotPassword = async ( req: Request, res: Response ) => {
  const { email } = req.body;

  try {
    const user = await userModel.findOne({ email });
    if ( !user ) return res.status(404).json({ ok: false, msg: 'No existe un usuario con ese correo electrónico' });
    if ( !user.confirmed ) return res.status(401).json({ ok: false, msg: 'Falta confirmar su correo electronico' });

    user.token = generateToken();
    const userSaved = await user.save();

    emailForgotPassword( userSaved.email, userSaved.name, userSaved.lastname, userSaved.token);

    return res.status(201).json({
      ok: true,
      msg: 'Consulta el correo electrónico para ver el enlace de restablecimiento de la contraseña.'
    });
  } catch (error) {
    return errorHttp( res, 'Error del sistema, comuniquese con el administrador' );
  }
}

const resetPassword = async ( { params, body }: Request, res: Response ) => {
  const { token } = params;
  const { password } = body;
  
  try {
    const user = await userModel.findOne({ token });
    if ( !user ) return res.status(401).json({ ok: false, msg: 'Token no válido o expirado'});
    if ( !user.confirmed ) return res.status(401).json({ ok: false, msg: 'Falta confirmar su correo electronico' });
    console.log(user, 'user')
    user.token = '';
    user.password = hashPassword( password );
    const userSaved = await user.save();

    const { _id, name, lastname, email } = userSaved;
    return res.status(201).json({
      ok: true,
      jwt: generateJWT( _id, email ),
      user: { _id, name, lastname, email },
      msg: 'Contraseña actualizado correctamente'
    });
  } catch (error) {
    return errorHttp( res, 'Error del sistema, comuniquese con el administrador' );
  }
}

//Private
//const userProfile = async ( _req: Request, res: Response ) => { }

const updateUserProfile = async ( { params, body, user }: UserResquestProvider, res: Response ) => {
  const { id } = params;
  const { email } = body;

  try {
    const userProfile = await userModel.findById( id );
    if ( !userProfile ) return res.status(401).json({ ok: false, msg: 'Usuario no encontrado'});
    if ( !userProfile.confirmed ) return res.status(401).json({ ok: false, msg: 'Falta confirmar su correo electronico' });

    if ( userProfile.email !== email ) {
      const emailExist = await userModel.findOne({ email });
      if ( emailExist ) return res.status(400).json({ ok: false, msg: 'El correo electrónico ya está en uso'});
    }

    if ( userProfile._id.toString() !== user!._id.toString() ) res.status(401).json({ ok: false, msg: 'No tiene permisos para realizar esta acción' });

    const updateUser = await userModel.findByIdAndUpdate( id, { ...body }, { new: true } );

    return res.status(201).json({
      ok: true,
      user: updateUser,
      msg: 'Usuario actualizado correctamente'
    });
  } catch (error) {
    return errorHttp( res, 'Error del sistema, comuniquese con el administrador' );
  }
}

const updateUserPassword = async ( { params, body, user }: UserResquestProvider, res: Response ) => {
  const { id } = params;
  const { oldPassword, newPassword } = body;

  try {
    const userProfile = await userModel.findById( id );
    if ( !userProfile ) return res.status(401).json({ ok: false, msg: 'Usuario no encontrado'});
    if ( !userProfile.confirmed ) return res.status(401).json({ ok: false, msg: 'Falta confirmar su correo electronico' });

    if ( userProfile._id.toString() !== user!._id.toString() ) res.status(401).json({ ok: false, msg: 'No tiene permisos para realizar esta acción' });

    const validPassword = comparePassword( oldPassword, userProfile.password );
    if ( !validPassword ) res.status(401).json({ ok: false, msg: 'La contraseña actual no es correcta' });

    userProfile.password = hashPassword( newPassword );
    await userProfile.save();

    return res.status(201).json({
      ok: true,
      msg: 'Contraseña actualizado correctamente'
    });
  } catch (error) {
    return errorHttp( res, 'Error del sistema, comuniquese con el administrador' );
  }
}

const revalidateJWT = async ( { user }: UserResquestProvider, res: Response ) => {
  try {
    return res.status(200).json({
      ok: true,
      user,
      jwt: generateJWT( user!._id, user!.email ),
    });
  } catch (error) {
    return res.status(500).json({ 
      ok: false,
      msg: 'Error del sistema, comuniquese con el administrador'
    })
  }
}

export {
  authUser,
  registerUser,
  confirmAccount,
  forgotPassword,
  resetPassword,
  updateUserProfile,
  updateUserPassword,
  revalidateJWT
}