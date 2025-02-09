import express from 'express';
import routes from './routes/routes';


const app = express();
const port = 5001;
app.use(routes);

app.listen(port, () =>{
    console.log(`Server is active & listening on PORT ${port}`);
});