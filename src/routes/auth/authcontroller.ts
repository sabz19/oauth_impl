import { Router, Request, Response } from 'express';
import { authorize, generateAuthCodeGrant } from './auth';

const router = Router();


router.get('/oauth/authorize', authorize, async (req: Request, res: Response) => {
    const generatedCode = await generateAuthCodeGrant(res.locals.profile);
    console.log(generatedCode);
    res.redirect(req.query.redirect_uri + '?code=' + generatedCode +'&state=' + req.query.state);
});

router.post('/oauth/token', authorize, (req: Request, res: Response) => {
    res.send('Token end point hit!');
});

export default router;