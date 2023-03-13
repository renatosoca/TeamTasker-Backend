import { Response } from 'express';

export const errorHttp = ( res: Response, msg: string) => {
  res.status(500).json({ ok: false, msg });
}