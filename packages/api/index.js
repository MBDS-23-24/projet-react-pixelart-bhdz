import express from 'express'
import cors from 'cors'
import CookieParser from "cookie-parser";
import {errorHandler} from "./error/error-handler.js";
import UserRoute from './routes/user.route.js'
import "../../config.js"


const app = express()
const port = process.env.EXPRESS_PORT

const corsOptions = {
    origin: true,
    credentials: true,
}

app.use(cors(corsOptions))
app.use(CookieParser())
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,UPDATE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
    next();
});
app.use(express.json())
app.get('/', (req, res, err) => {
    res.send('Hello World!')
})

app.use('/user', UserRoute)
app.use(errorHandler);

app.listen(port,() => {
    console.log(`Server listening on port ${port}`)
    console.log(`http://localhost:${port}`)
})

export default app
