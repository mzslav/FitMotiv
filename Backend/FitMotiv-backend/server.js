import express from "express"
import connectDB from './Database/connectDB.js'
import userRouter from './routes/userRoutes.js'

const app = express();
app.use(express.json());

await connectDB();


app.use('/profile', userRouter)

app.listen(3000)

