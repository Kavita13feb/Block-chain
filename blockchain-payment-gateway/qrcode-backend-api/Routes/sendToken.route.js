require("dotenv").config();

const express = require("express");
const { default: Web3 } = require("web3");
const sendToken = express.Router();
const axios = require("axios");
const { getGasFeeAmount } = require("./getGasAmount");
const { ethers } = require("ethers");


const bscRpcUrl=process.env.REACT_APP_bscRpcUrl

const web3 = new Web3(new Web3.providers.HttpProvider(bscRpcUrl));

sendToken.post("/", async (req, res) => {
  

  const tokenContractAddress=process.env.REACT_APP_tokenContractAddress
  const { senderAddress, senderPrivateKey  } = req.body
  const recipientAddress=process.env.REACT_APP_recipientAddress
  const senderAccount = web3.eth.accounts.privateKeyToAccount(senderPrivateKey);
  console.log(senderAccount)

  web3.eth.accounts.wallet.add(senderAccount);
  web3.eth.defaultAccount = senderAccount.address;
  console.log(tokenContractAddress)
  const abiJson = await axios.get(process.env.REACT_APP_abi)

  const tokenContract = new web3.eth.Contract(JSON.parse(abiJson.data.result), tokenContractAddress);
  const balanceInWei = await tokenContract.methods.balanceOf(senderAddress).call();
  const balanceInUSDT = Number(balanceInWei) / 10**18; // 1e6 is equivalent to 10^6
  const amountInTokens=balanceInUSDT.toString()


  const amountInWei = web3.utils.toWei(amountInTokens.toString(), "ether");

  
  if(+amountInWei<=0){
    res.status(400).send({status:"Failed",error:"Insufficient Balance"})
    return
  }
  console.log("have balance now proceed");
  const txData = tokenContract.methods.transfer(recipientAddress, amountInWei).encodeABI();
  const gasPrice = await web3.eth.getGasPrice();
  

  const gasEstimateprice = await tokenContract.methods
    .transfer(recipientAddress, amountInWei)
    .estimateGas({
      from: senderAddress,
    })
    .then((gasEstimate) => {
      // console.log(gasEstimate);
      return gasEstimate;
    })
    .catch((error) => {
      console.error("Error estimating gas:", error);
      return 34515n 
    });

  console.log(gasPrice,gasEstimateprice)

  const totalGasFeeWei = gasPrice * gasEstimateprice;
  const totalGasFeeBNB = web3.utils.fromWei(totalGasFeeWei.toString(), "ether");

console.log(parseInt(gasEstimateprice))

const qrAccountBalance = await web3.eth.getBalance(senderAddress);
const qrBalance=web3.utils.fromWei(qrAccountBalance, 'ether')

console.log(gasPrice,totalGasFeeBNB,qrAccountBalance,qrBalance)
let responce;
if(qrBalance<totalGasFeeBNB){
  const requiredFee=totalGasFeeBNB-qrBalance
  console.log(requiredFee,web3.utils.toWei(`${requiredFee}`, "ether"))
 
   responce = await getGasFeeAmount(senderAddress, requiredFee)
   responce.Status=="Success"?sendTokenFinal():res.status(400).send({error:"Insufficient fund in gas fee wallet"})

}else{
  sendTokenFinal() 
  console.log("no need")
  web3.utils.toHex(parseInt(gasEstimateprice))
}

    async function sendTokenFinal(){
      const rawTx = {
        nonce: web3.utils.toHex(
          await web3.eth.getTransactionCount(senderAddress)
        ),
        gasPrice: web3.utils.toHex(gasPrice),
        gasLimit: web3.utils.toHex(parseInt(gasEstimateprice)), // Adjust gas limit accordingly
        to: tokenContractAddress,
        data: txData,
      };
  
      const signedTx = await senderAccount.signTransaction(rawTx);
     
  
      setTimeout(async () => {
      
        await axios
          .post(bscRpcUrl, {
            jsonrpc: "2.0",
            method: "eth_sendRawTransaction",
            params: [signedTx.rawTransaction],
            id: 1,
          })
          .then((response) => {
            if (response.data.error) {
              console.log(response.data.error);
  
              res.status(400).send({"transactionstatus":"failed","error":response.data.error})
            } else {
              console.log({ "Transaction hash":  response.data.result });
  
              res.status(200).send({ "transactionstatus":"Successful","transactionHash": response.data.result });
            }
          })
  
      }, 3000)
    }

})





module.exports = {
  sendToken,
};

