const mongoose = require("mongoose");

const TempWalletsSchema = new mongoose.Schema({
  WalletAddress: String,
  PrivateKey: String,
  txDetails: {
    Id: String,
    Txnid: String,
    ReceieveAddress: String,
    TxHash: String,
    Response: String,
    Amount: Number,
    Token: String,
    Status: String,
    date: { type: Date, default: Date.now },
  },
},{
    versionKey: false
});
const TempWalletModal = mongoose.model("TempWallets", TempWalletsSchema);
module.exports = {TempWalletModal};
