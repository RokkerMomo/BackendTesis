import express from "express";
import morgan from "morgan";
import cors from "cors";
import authroutes from "./routes/auth.routes";
const app = express();

app.set('port', process.env.PORT || 3000);

app.use(morgan('dev'));
app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(cors());

app.get('/',(req,res)=>{
    res.send(`THE API IS AT http://localhost:${app.get('port')}`)
})

app.use(authroutes)

export default app;