
import BasicSelect from "./Select";
import React, { useState, useRef } from "react";
import { useEffect } from "react";
import axios from "axios";
import { Backdrop, CircularProgress } from "@mui/material";

import "./qr.css"
export const QrCodeGateway = () => {
    const [network, setNetwork] = useState("");
    const [TempwalletAddress, setTempWalletAddress] = useState("");
    const [key, setKey] = useState("");
    const [qrCodeDataURL, setqrCodeDataURL] = useState("");
    const Details = JSON.parse(localStorage.getItem("details")) || [];
    const [DetailsArr, setArr] = useState(Details);
    const [isLoading, setIsloading] = useState(false);
    const [isError, setIsError] = useState(false);
  
    const [txhash, setTxhash] = useState("");
  
    const [classval, setClass] = useState(false);
    const [shortAddress, setShortAddres] = useState("");
    const [isCopied, setIsCopied] = React.useState(false);
  
    const handleCopyClick = (event) => {
      const textToCopy = TempwalletAddress
  
      const tempInput = document.createElement("textarea");
      tempInput.value = textToCopy;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand("copy");
      document.body.removeChild(tempInput);
      setIsCopied(true);
      alert("Link Copied to Clipboard")
      setTimeout(() => setIsCopied(false), 2000);
    };
  
    const videoRef = useRef(null);
    const handleNetworkChange = (event) => {
      setNetwork(event.target.value);
    };
  
   
  
    const createNewWallet = async () => {
      setIsloading(true)
       fetch(`${process.env.REACT_APP_api}/create?amount=.00001`)
        .then(async(res) => {
          res = await res.json()
          // console.log(res);
  
          console.log(res,res.qrCodeDataURL,res.address,res.key);
          setTempWalletAddress(res.address);
          setKey(res.key);
          setqrCodeDataURL(res.qrCodeDataURL);
          let saddress = shortenwalletAddres(res.address);
          // setClass(true)
         setShortAddres(saddress);
         setIsloading(false)
  
        })
        .catch((er) => {
          console.log(er);
          setIsError(true)
          setIsloading(false)
  
        });
    };
  
    const apiKey = "N73GUZNSYKZVKWYUBJ7JSBK6F8WP924F4E";
    // const apiKey="FARZRYJ3FMED2HBW63XW7EJZDSAZAC9Y6P"
    // const apiUrl=`https://api-testnet.bscscan.com/api?module=account&action=tokentx&address=${TempwalletAddress}&apikey=${apiKey}`
    // const apiUrl = `https://api.bscscan.com/api?module=account&action=tokentx&address=${TempwalletAddress}&apikey=${apiKey}`;
  const apiUrl=`https://apilist.tronscanapi.com/api/transfer/trc20?address=${TempwalletAddress}&trc20Id=TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t&start=0&limit=2&direction=0&reverse=true&db_version=1&start_timestamp=&end_timestamp= `
    // const apiUrl = `https://api-testnet.bscscan.com/api?module=account&action=txlist&address=${TempwalletAddress}&apikey=${apiKey}`;
  // token:- `https://api.shasta.trongrid.io/v1/accounts/TJ2JW2sTsz3rru2M4Y5vi4f6YkVWQCrCF1/transactions/trc20?limit=1&only_to=true`
    async function checkRecentTransactions() {
      try {
        const response = await axios.get(apiUrl);
        const transactions = response.data.data
        // console.log(transactions)
        // let latest = transactions ? response.data[0] : [];
        if (transactions.length !== 0) {
          // setTxhash((prev) => transactions[0].hash);
          setIsloading(false);
  
          return transactions[0].hash;
        } else {
          return null;
        }
      } catch (error) {
        console.error("Error checking transactions:", error);
  
        return null;
      }
    }
  
  
    const data=()=>{
     axios.get(`https://apilist.tronscanapi.com/api/transfer/trc20?address=TJ2JW2sTsz3rru2M4Y5vi4f6YkVWQCrCF1&trc20Id=TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t&start=0&limit=2&direction=0&reverse=true&db_version=1&start_timestamp=&end_timestamp= `).then((res)=>{
      console.log(res)
     }).catch((er)=>{
  console.log(er)
     })
    }
  
    useEffect(() => {
      let intervalId;
      data()
      const checkAndSend = async () => {
        const res = await checkRecentTransactions();
        console.log(res);
        if (res) {
          clearInterval(intervalId);
          await sendToMain();
        }
      };
  
      if (TempwalletAddress) {
        intervalId = setInterval(checkAndSend, 2000);
      }
  
      return () => {
        clearInterval(intervalId);
      };
    }, [TempwalletAddress]);
  
  
    const sendToMain = async () => {
      setIsloading(true)
      const transactionDetails = {
        senderPrivateKey: key,
        senderAddress: TempwalletAddress,
        recipientAddress: "TJ2JW2sTsz3rru2M4Y5vi4f6YkVWQCrCF1",
        amountInTokens: "1",
      };
      axios
        .post(`${process.env.REACT_APP_api}/send`, transactionDetails)
        .then((res) => {
          // console.log("res", res.data["Transaction hash"]);
          // let tx = shortenwalletAddres(res.data["Transaction hash"]);
          let tx = res.data.txid;
          setIsloading(false)
  
          alert("Transaction Successful");
          setTxhash(tx);
  
        })
        .catch((er) => {
          console.log(er.response.data);
          if (er.response.data.code == -32000) {
  
            alert(er.response.data.message);
          setIsError(true)
          setIsloading(false)
  
            return er.response.data.message;
          }
        });
    };
  
    const shortenwalletAddres = (TempwalletAddress) => {
      const walletAddress = TempwalletAddress;
  
      const firstPart = walletAddress.substring(0, 5);
      const lastPart = walletAddress.substring(walletAddress.length - 4);
  
      const maskedAddress = `${firstPart}...${lastPart}`;
      return maskedAddress;
    };

  return (
    <div className="scene scene--card">
    <div className={`card ${classval ? "is-flipped" : ""}`}>
      <div className={`glass-container card__face card__face--front`}>
         {!isLoading?TempwalletAddress ? (
          <div className="qrcodeDiv">
            <img src={qrCodeDataURL} />
                  
            <p className="shorten" onClick={handleCopyClick}>{shortAddress}</p>
            <h4>Scan And Pay</h4>
            <button onClick={sendToMain}>send</button>
            {txhash &&
             <div>
             <p>Txh:{shortenwalletAddres(txhash)}</p>
            <a href={`https://tronscan.org/#/transaction/${txhash}`} target="_blanck">Click to view Transaction on bscscan</a>
             </div>
             
             }

          </div>
        ) : (
          <>
            <BasicSelect />

            <button className="glass-btn" onClick={createNewWallet}>
              Create Account
            </button>
          </>
        ):
      
        <Backdrop 
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
}
      </div>
    </div>
  </div>
  )
}
