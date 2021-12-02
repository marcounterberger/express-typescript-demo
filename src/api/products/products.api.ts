import express, { Request, Response } from 'express';
import { body, param, validationResult } from 'express-validator';
import { checkJwt, checkPermissions } from '../../middleware/authentication.middleware';
import Logger from '../../utilities/logger.service';
import Products from './products.service';

const router = express.Router();
const products = new Products();

export enum ProductPermission {
    CreateProducts = "create:products",
    DeleteProducts = "delete:products",
};

const completeUrl = (req: Request) => `${req.protocol}://${req.get('host')}${req.originalUrl}`

/**
 * Any route needs authn / authz
 */
router.use(checkJwt);

/**
 * returns all available products
 */
router.get(
    '/',
    async (req: Request, res: Response) => {

        const _products = await products.get();
        Logger.info(`Found ${_products.length} products`);
        res.status(200).json(_products);
    }
);

/**
 * returns a product by its id
 */
router.get(
    '/:id',
    async (req: Request, res: Response) => {

        const productUuid = req.params.id;
        const _product = await products.find(productUuid);
        
        if (_product) {
            Logger.info(`Product found`);
            Logger.debug(`Return product with name '${_product.title}'`);
            res.json(_product);
        } else {
            Logger.error(`Attempt to requst none-existing product with id ${productUuid}`);
            res.sendStatus(404); // Not Found
        }
    }
);

/**
 * adds a new product
 */
router.post(
    '/',
    checkPermissions([ProductPermission.CreateProducts]),
    (req: Request, res: Response) => {

        const _product = req.body; // TODO validate payload

        products.add(_product);

        res.location(`${completeUrl(req)}/${_product.__id}`).sendStatus(201);
    }
);

/** 
 * deletes product
 */
router.delete(
    '/:id',
    checkPermissions([ProductPermission.DeleteProducts]),
    param('id').isUUID(),
    async (req: Request, res: Response) => {

        try {
            validationResult(req).throw(); // in case :id is not an UUID

            const product = await products.find(req.params.id);

            if (product) {
                products.delete(product);
                Logger.info(`Product deleted`);
                res.sendStatus(204); // No Content
            } else {
                Logger.info(`Product not found`);
                res.sendStatus(404); // Not Found
            }
        } catch (err) {
            res.sendStatus(400); // Bad Request
        }
    }
);

export { router as default, Products };