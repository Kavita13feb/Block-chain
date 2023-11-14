require('dotenv').config()
process.env.NODE_TLS_REJECT_UNAUTHORIZED="0"
const express =require('express')

const cors =require('cors')

const { createRouter } = require('./Routes/create.route')
const { balanceRouter } = require('./Routes/balance.route')
const { sendToken } = require('./Routes/sendToken.route')
const { checkTransactionByHash } = require('./CheckTokenTransaction')
const app =express()
app.use(express.json());

app.use(cors({ origin: "https://qr.fourfighter.in", credentials: true }));


  
app.get("/",(req,res)=>{
    console.log("running")
    res.send("running")
})
  
// app.use(cors())
app.use("/create",createRouter )
app.use("/balance",balanceRouter)
app.use("/token",sendToken)
app.use("/status",checkTransactionByHash)


app.listen(8080 ,() => {
    console.log('Server is running ');
  });