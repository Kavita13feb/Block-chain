const express =require('express');
const { default: Web3 } = require('web3');

const getAccountBalance=async(req,res,next)=>{

    const walletAddress= req.body.senderAddress

    try {
const network="https://data-seed-prebsc-1-s1.binance.org:8545/"
        const web3 = new Web3(network);
        const accountBalance = await web3.eth.getBalance(walletAddress);
        const Balance=web3.utils.fromWei(accountBalance, 'ether')
        // res.status(200).send({"Balance":Balance})
        console.log({"Balance":Balance})
      req.body.balance=Balance
       next()
         
      } catch (error) {
        console.error('Error getting the account balance:', error);
        res.status(400).send(error)
      }


}


module.exports={
    getAccountBalance 
}