import { Request, Response } from 'express';
import jwt from 'express-jwt';
import jwksRsa from 'jwks-rsa';
import jwtAuthz from 'express-jwt-authz';


/**
 * checks if provided API key matches
 * @param req
 * @param res 
 * @param next 
 */
export const checkApiKey: any = (req: Request, res: Response, next: any) => {
    if (req.headers.authorization === 'secretpassword') {
      next();
    } else {
      res.status(401).json({error: 'not permitted'});
    }
};

/**
 * checks if JSON Web Token is present and valid
 * issuer and audience must match
 * @param req 
 * @param res 
 * @param next 
 */
export const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `http://localhost:8080/auth/realms/global/protocol/openid-connect/certs`
  }),
  issuer: `http://localhost:8080/auth/realms/global`,
  algorithms: ['RS256'],
  audience: 'product-shop',
});

/**
 * protect route from authenticated requests
 * that lack the required permission
 * @param permissions 
 */
export const checkPermissions = (permissions: string[]) => {
  return jwtAuthz(permissions, {
    checkAllScopes: true,
    failWithError: true
  });
};