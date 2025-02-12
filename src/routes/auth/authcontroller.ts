import { Router, Request, Response } from 'express';
import { authorize, generateAccessAndRefreshToken, 
    generateAuthCodeGrant, retrieveTokensWithGrant, createJWTPayload } from './auth';
import { Token } from './authtypes';

const router = Router();


router.get('/oauth/authorize', authorize, async (req: Request, res: Response) => {
    const generatedCode = await generateAuthCodeGrant(res.locals.profile);
    console.log(generatedCode);
    res.redirect(req.query.redirect_uri + '?code=' + generatedCode +'&state=' + req.query.state);
});

router.post('/oauth/token', authorize, async (req: Request, res: Response) => {

    let accessToken, refreshToken;

    console.log('grant type = ' + res.locals.grantType);
    switch(res.locals.grantType){
        case 'authorization_code':
            [accessToken, refreshToken] = await retrieveTokensWithGrant(res.locals.profile, req.body.code);
            console.log(accessToken);
            console.log(refreshToken);
        break;

        case 'refresh_token':
            [accessToken, refreshToken] = await generateAccessAndRefreshToken(res.locals.profile, createJWTPayload(res.locals.profile,Token.Access),
         createJWTPayload(res.locals.profile,Token.Refresh));
        break;
    }

    
    res.status(200).send({'access_token': accessToken, 'token_type': 'Bearer', 'refresh_token': refreshToken, 'expires_in': 3600});
});

export default router;