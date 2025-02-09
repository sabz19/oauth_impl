import { Request, Response, NextFunction } from 'express';
import registeredClients from './registeredclients';
import crypto from 'node:crypto';

/**
 * Authorization middleware for clients
 * 
 * @param req - request from client
 * @param res - response to send back to client
 * @param next - call next middleware or router
 */
function authorize(req: Request, res: Response, next: NextFunction): void{

    // check request parameters for client_id & redirect_uri & response_type
    // if response_type = code do the following
    // check if client_id is valid 
    // check if redirect_uri is valid
    // Then generate code JWT token & match it with the redirect_uri

    // if response_type = token do the following
    let unauthorized: Boolean = true;
    
    if(req.method == 'GET'){

        const responseType = req.query.response_type;
        const clientId = req.query.client_id;
        const redirectUri = req.query.redirect_uri;
        const state = req.query.state;
    
        let unauthorized: Boolean = true;
    
        if(responseType?.toString() == 'code'){
            console.log('Response type is code');
            if(clientId?.toString() in registeredClients){
                console.log('Client ID is valid');
                let redirectUriList = registeredClients[clientId.toString()]['redirectUris'];
                if(redirectUriList?.includes(redirectUri)){
                    const authGrantCode = generateAuthCodeGrant();
                    updateAuthCodeGrant(authGrantCode, clientId.toString());
                    unauthorized = false;
                    next();
                }
            }
        }

    }

    if(req.method == 'POST'){
        const responseType = req.body.response_type;
        const clientId = req.body.client_id;
        const redirectUri = req.body.redirect_uri;
        const state = req.body.state;
    
        let unauthorized: Boolean = true;
    
        if(responseType?.toString() == 'code'){
            console.log('Response type is code');
            if(clientId?.toString() in registeredClients){
                console.log('Client ID is valid');
                let redirectUriList = registeredClients[clientId.toString()]['redirectUris'];
                if(redirectUriList?.includes(redirectUri)){
                    const authGrantCode = generateAuthCodeGrant();
                    updateAuthCodeGrant(authGrantCode, clientId.toString());
                    unauthorized = false;
                    next();
                }
            }
        }
    }

    if(unauthorized){
        res.status(401).send('Unauthorized');
    }
}

/**
 * 
 * @returns String
 */

function generateAuthCodeGrant(): String{

    return crypto.randomBytes(16).toString('hex');    
}

function updateAuthCodeGrant(authGrantCode: String, clientId: string): void {
    console.log('Auth grant to update: ', authGrantCode);
    registeredClients[clientId]['authGrantCode'] = authGrantCode;
}


export default authorize;