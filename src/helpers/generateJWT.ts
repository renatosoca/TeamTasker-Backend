import jwt from 'jsonwebtoken';

export const generateJWT = ( _id: string, name: string ): string => {
  return jwt.sign( { _id, name }, process.env.JWT_KEY_SECRET!, {
    expiresIn: '2h'
  }); 
}