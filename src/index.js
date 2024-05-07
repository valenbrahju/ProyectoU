import express from "express";
import { engine } from 'express-handlebars';
import bodyParser from "body-parser";
import path from 'path';
import config from './config';
import router from "./routes/index.routes";
import cookieParser from 'cookie-parser';
const app = express()

app.use(cookieParser());

app.use(function(req, res, next) {
    if(!req.user)
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    next();
})

app.set('views', path.join(__dirname, 'views'))
app.set('public', path.join(__dirname, 'public'))
app.set('dashboard', path.join(__dirname, 'dashboard'))

app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

app.use(express.static(path.join(__dirname, 'public')))
app.use(router)
app.engine('.hbs', engine({
    defaultLayout : 'main',
    extname : '.hbs'
}))

app.set('view engine', '.hbs')

app.listen(config.port, ()=>{
    console.log("esta corriendo")
})