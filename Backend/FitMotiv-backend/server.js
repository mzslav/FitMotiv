import express from "express"
import connectDB from './Database/connectDB.js'
import userRouter from './routes/userRoutes.js'
import challengeRouter from './routes/challengeRouters.js'
import logRouter from './routes/logRouters.js'
import exerciseRouter from './routes/exerciseRouters.js'
import cors from 'cors'
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const port = process.env.PORT || 3000

app.use(cors({
  origin: "http://localhost:8081",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));


app.use(express.json());

await connectDB();


app.use('/profile', userRouter)
app.use('/challenge', challengeRouter)
app.use('/log', logRouter)
app.use('/exercise', exerciseRouter)

app.listen(port)

