import { Response, Request } from 'express';

const authUser = async ( _req: Request, res: Response ): Promise<void> => {
  res.status(200).json( { message: 'authUser' } );
}

export {
  authUser,
}