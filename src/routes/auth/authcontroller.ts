import { Router, Request, Response } from 'express';
import authorize from './auth';

const router = Router();


router.get('/oauth/authorize', authorize, (req: Request, res: Response) => {
    res.redirect('/oauth/token');
});

router.post('/oauth/token', authorize, (req: Request, res: Response) => {
    res.send('Token end point hit!');
});

export default router;