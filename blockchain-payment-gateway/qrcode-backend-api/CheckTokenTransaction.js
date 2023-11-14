

const { default: axios } = require("axios");
const { default: BigNumber } = require("bignumber.js");
const express = require("express");
const { default: Web3 } = require("web3");
const checkTransactionByHash = express.Router();
const bscRpcUrl = "https://bsc-dataseed.binance.org/";
const web3 = new Web3(new Web3.providers.HttpProvider(bscRpcUrl));
checkTransactionByHash.get("/", async (req, res) => {
    const { transactionHash } = req.query;
    console.log(transactionHash);

    web3.eth.getTransaction(transactionHash)
        .then(async (transaction) => {
            if (transaction && transaction.input !== '0x') {
                const input = transaction.input;

                // Check if the input data corresponds to a token transfer
                if (input.startsWith('0xa9059cbb')) {
                    const tokenDecimalPlaces = 18; // Replace with the actual decimal places of the token

                    // Extract the amount from input and convert it to a BigNumber
                    const amountInWeiHex = `0x${input.slice(74)}`;
                    const amountInWei = new BigNumber(amountInWeiHex);

                    // Convert the amount from Wei to USDT
                    const divisor = new BigNumber(10).exponentiatedBy(tokenDecimalPlaces);
                    const amountInUSDT = amountInWei.dividedBy(divisor);
                    const recipientAddress = `0x${input.slice(34, 74)}`;
                    // Fetch the transaction receipt
                    console.log(amountInUSDT)
                    const receipt = await web3.eth.getTransactionReceipt(transactionHash);

                    // Convert the BigInt values to strings within the response object
                    const response = {
                        ...receipt,
                        gasUsed: receipt.gasUsed.toString(),
                        cumulativeGasUsed: receipt.cumulativeGasUsed.toString(),
                        tokenAmountInUSDT: amountInUSDT.toString(), // Convert to a string
                    };

                    // Send the response as JSON
                    console.log(response)
                    res.json({status:response.status==1n?"success":"failed",from:response.from,to:recipientAddress,transactionHash:response.transactionHash,gasUsed:response.gasUsed,amount:response.tokenAmountInUSDT,token:response.to});
                    
                }
            } else {
                console.log('No Input Data');
            }
        })
        .catch((error) => {
            console.error('Error fetching transaction:', error);
            res.status(500).json({ 'Error fetching transaction':error});
        });
});

module.exports = {
    checkTransactionByHash,
};
