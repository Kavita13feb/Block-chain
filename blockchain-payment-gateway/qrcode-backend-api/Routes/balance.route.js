const { default: axios } = require('axios');
const express =require('express');
const { default: Web3 } = require('web3');
const balanceRouter =express.Router()

balanceRouter.post("/",async(req,res)=>{
    const walletAddress= req.body.walletAddress
    // console.log(req.body)
try
     {
const bscRpcUrl=process.env.REACT_APP_bscRpcUrl
const web3 = new Web3(new Web3.providers.HttpProvider(bscRpcUrl));
const tokenContractAddress=process.env.REACT_APP_tokenContractAddress

const abiJson = await axios.get( process.env.REACT_APP_abi);

const tokenContract = new web3.eth.Contract(JSON.parse(abiJson.data.result), tokenContractAddress);
const balanceInWei = await tokenContract.methods.balanceOf(walletAddress).call();
const balanceInUSDT = Number(balanceInWei) / 10**18; // 1e6 is equivalent to 10^6
const amountInTokens=balanceInUSDT.toString()

const amountInWei = web3.utils.toWei(amountInTokens.toString(), "ether");
        // const accountBalance = await web3.eth.getBalance(walletAddress);
        // const Balance=web3.utils.fromWei(accountBalance, 'ether')
        res.status(200).send({"Balance":amountInTokens,tokentype:"USDT"})

         
      } catch (error) {
        console.error('Error getting the account balance:', error);
        res.status(400).send(error)
      }


})



module.exports={
    balanceRouter 
}