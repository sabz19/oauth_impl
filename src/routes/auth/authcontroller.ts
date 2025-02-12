import { Router, Request, Response } from 'express';
import { authorize, generateAuthCodeGrant, retrieveAccessToken } from './auth';

const router = Router();


router.get('/oauth/authorize', authorize, async (req: Request, res: Response) => {
    const generatedCode = await generateAuthCodeGrant(res.locals.profile);
    console.log(generatedCode);
    res.redirect(req.query.redirect_uri + '?code=' + generatedCode +'&state=' + req.query.state);
});

router.post('/oauth/token', authorize, async (req: Request, res: Response) => {
    const accessToken = await retrieveAccessToken(res.locals.profile, req.body.code);
    console.log('access token retrieved = ' + accessToken);
    res.status(200).send({'access_token': accessToken, 'token_type': 'Bearer'});
});

export default router;