import { Request, Response } from 'express';

/**
 * logs access to the API
 * @param req
 * @param res 
 * @param next 
 */
const logAccess = (req: Request, res: Response, next: any) => {
  
  // TODO
  next();
};

export default logAccess;