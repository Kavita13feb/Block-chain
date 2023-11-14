require("dotenv").config();


const axios = require("axios");
const { default: Web3 } = require("web3");


const getGasFeeAmount=async(TempAddress,totalGasFeeBNB)=>{
    const bscRpcUrl = process.env.REACT_APP_bscRpcUrl
    const web3 = new Web3(new Web3.providers.HttpProvider(bscRpcUrl));
    const sourceWallet=process.env.sourceWallet
    const sourcePrivateKey=process.env.sourcePrivateKey
    console.log(sourcePrivateKey)
    console.log(TempAddress,totalGasFeeBNB)
  
  
  const txObject = {
        from: sourceWallet,
        to: TempAddress,
        value: web3.utils.toWei(`${totalGasFeeBNB}`, "ether"),
        gas: web3.utils.toHex(21000), // Set a reasonable gas limit here (adjust as needed)
        gasPrice: web3.utils.toHex(await web3.eth.getGasPrice()),
        nonce: web3.utils.toHex(
          await web3.eth.getTransactionCount( sourceWallet)
     ),
        chainId: 97, // 56 for Binance Smart Chain mainnet, 97 for testnet (adjust accordingly)
      };
    
      const sourceAccount = web3.eth.accounts.privateKeyToAccount(sourcePrivateKey);
    
      const sourcesignedTx = await sourceAccount.signTransaction(txObject);

      try {
        const response = await axios.post(bscRpcUrl, {
          jsonrpc: "2.0",
          method: "eth_sendRawTransaction",
          params: [sourcesignedTx.rawTransaction],
          id: 1,
        });
    
        if (response.data.error) {
          console.log(response.data.error);
          return {
            Status: "Failed",
            message: response.data.error,
          };
        } else {
          console.log({ "Transaction hash": response.data.result });
          return {
            Status: "Success",
            hash: response.data.result,
          };
        }
      } catch (er) {
        console.log(er);
        return {
          Status: "Failed",
          message: er,
        };
      }
    };
    
    module.exports={
        getGasFeeAmount    
    }