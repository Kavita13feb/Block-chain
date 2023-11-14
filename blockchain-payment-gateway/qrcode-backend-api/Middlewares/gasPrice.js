const express =require('express');
const { default: Web3 } = require('web3');
// const gasPriceRouter =express.Router()


const getGasPrice=async(req,res,next)=>{
    // console.log(req.body)
    const senderAddress = req.body.senderAddress 
    const recipientAddress =req.body.recipientAddress 
    const amountToTransfer =req.body.amountToTransfer 

    // const network="https://bsc-dataseed.binance.org/"
    const network = "https://data-seed-prebsc-1-s1.binance.org:8545/";
    const web3 = new Web3(network);
  

        try {
        // Estimating the gas required for the transaction
        const gasEstimate = await web3.eth.estimateGas({
            from: senderAddress,
            to: recipientAddress,
            value: web3.utils.toWei(amountToTransfer.toString(), "ether"), // Convert to wei
            });

        // Getting the current gas price from the network
        const gasPriceWei = await web3.eth.getGasPrice();

        // Calculating the total gas fee in wei
        const totalGasFeeWei = gasPriceWei * gasEstimate;

// console.log(totalGasFeeWei)
        // Converting the total gas fee from wei to BNB using web3.utils.fromWei
        const totalGasFeeBNB = web3.utils.fromWei(
            totalGasFeeWei.toString(),
            "ether"
        );

        console.log("Total Gas Fee in BNB:", totalGasFeeBNB);
        req.body.totalGasFeeBNB=totalGasFeeBNB
           next()

        } catch (error) {
        console.error("Error occurred:", error.message);
        res.status(400).send(error)
        }




}



module.exports={
    getGasPrice 
}