const express =require('express');
const { default: Web3 } = require('web3');
const axios = require("axios");
require('dotenv').config()
// const gasPriceRouter =express.Router()


const getGasAmount=async(req,res,next)=>{
     // const network="https://bsc-dataseed.binance.org/"
  const network = "https://data-seed-prebsc-1-s1.binance.org:8545/";
//   console.log(req.body)
    const web3 = new Web3(network);
    const senderPrivateKey = "0x9f947b4e0b9b429d8e7e31c6abd29540ef472d85bbef4c20ab36d204faef8f98" //source key
    const senderAddress = "0xB79A520b396ddF4EA074aBEe314e7DFeb366710b"; // source  address
    const recipientAddress = req.body.senderAddress; //temp address
    const amountToTransfer = req.body.totalGasFeeBNB; //gas fee
    const balance =req.body.balance
    console.log(senderPrivateKey)
    // const sourcePrivateKey = "0xb2c987d6962bc3a947bd397ce4fdbd2c6470880534a11384d274dd4b33e8ec1c";
    console.log(amountToTransfer,balance)
    // console.log(+amountToTransfer-+balance)
    if(amountToTransfer >= balance){
        console.log(amountToTransfer-balance)
        const txObject = {
            from: senderAddress,
            to: recipientAddress,
            value: web3.utils.toWei(`${amountToTransfer}`, "ether"),
            gas: web3.utils.toHex(21000), // Set a reasonable gas limit here (adjust as needed)
            gasPrice: web3.utils.toHex(await web3.eth.getGasPrice()),
            nonce: web3.utils.toHex(await web3.eth.getTransactionCount(senderAddress)),
            chainId: 97, // 56 for Binance Smart Chain mainnet, 97 for testnet (adjust accordingly)
          };
        
          console.log(txObject,"txobj")
          const senderAccount = web3.eth.accounts.privateKeyToAccount(senderPrivateKey);
        
          const signedTx = await senderAccount.signTransaction(txObject);
        
          
          await axios
            .post(network, {
              jsonrpc: "2.0",
              method: "eth_sendRawTransaction",
              params: [signedTx.rawTransaction],
              id: 1,
            })
            .then((response) => {
              // console.log(response)
              if(response.data.error){
                res.status(400).send(response.data.error)
              }else{
              //   res.status(200).send({"Transaction hash": response.data.result});
              console.log({"Transaction hash": response.data.result})
                next()
                }
            })
            .catch((er) => {
              console.log(er);
              res.status(400).send(er.response);
            });
      
    }else{
        console.log("no need of gasAmount")
        next()
    }
    
 


}



module.exports={
    getGasAmount 
}