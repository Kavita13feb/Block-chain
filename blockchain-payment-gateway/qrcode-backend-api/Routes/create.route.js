const express = require("express");
const { default: Web3 } = require("web3");
const createRouter = express.Router();
const qrcode = require("qrcode");
const { TempWalletModal } = require("../Models/tempWallet.model");
const bscRpcUrl=process.env.REACT_APP_bscRpcUrl
const web3 = new Web3(new Web3.providers.HttpProvider(bscRpcUrl));

createRouter.get("/", async (req, res) => {
  const tokenAmount = req.query.amount;
  const tokenContractAddress=process.env.REACT_APP_tokenContractAddress

  try {
    const tokenWeiAmount =  web3.utils.toWei(tokenAmount,"ether")
  
    const newAccount = await web3.eth.accounts.create();
    const paymentRequestUrl = `ethereum:${tokenContractAddress}/transfer(address,uint256)?address=${newAccount.address}&uint256=${tokenWeiAmount}`;
    
    qrcode.toDataURL(paymentRequestUrl, async (err, qrCodeDataURL) => {
      if (err) {
        console.error("Error generating QR code:", err);
        res.send("Internal Server Error");
      } else {
      
        console.log({qrCodeDataURL:qrCodeDataURL,address: newAccount.address,key:newAccount.privateKey})
        res.status(200).send({qrCodeDataURL:qrCodeDataURL,address: newAccount.address,key:newAccount.privateKey});

      }
    });
  } catch (error) {
    if(error.code==1100){
      res.status(400).send("Invalid arguments: amount is not defined")
    }else{
console.error("Error creating the wallet:", error);
    res.status(400).send(error);
    }
    
  }
});

module.exports = {
  createRouter,
};
