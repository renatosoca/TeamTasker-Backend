import { Response } from 'express';

export const errorHttp = ( res: Response, msg: string) => {
  return res.status(500).json({ ok: false, msg });
}