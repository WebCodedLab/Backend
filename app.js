import express from 'express';
import 'dotenv/config'
import connectToDatabase from './config/db.config.js'
import cookieParser from 'cookie-parser';

import userRouter from './routes/user.routes.js'
import indexRouter from './routes/index.routes.js'

const app = express();

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
connectToDatabase()


app.use('/user', userRouter)
app.use('/', indexRouter)

app.listen(process.env.PORT, (req, res) => {
    console.log(`Server started at PORT ${process.env.PORT}`);
})