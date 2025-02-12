import express from 'express';
import routes from './routes/routes';
import createDummyClients from './routes/dummyobj/createdummyclients';


const app = express();
const port = 8080;
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(routes);

// Call to create a dummy client with client ID 'upfirst'
createDummyClients();

app.listen(port, () =>{
    console.log(`Server is active & listening on PORT ${port}`);
});