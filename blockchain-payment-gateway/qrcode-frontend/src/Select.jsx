
import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import {SiBlockchaindotcom} from 'react-icons/si'
import {FaEthereum} from 'react-icons/fa'
import {SiBitcoinsv,SiHiveBlockchain} from 'react-icons/si'
export default function BasicSelect() {
  const [network, Setnetwork] = React.useState(8);

  const handleChange = (event) => {
    Setnetwork(event.target.value);
  };

 
  return (
    <Box sx={{ minWidth: 120 }} className="glass-content">
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label" style={{position:'fixed'}}><SiBlockchaindotcom size={'25px'}/>
        </InputLabel>
      
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          label="Age"
          onChange={handleChange}
          style={{color:'white'}}
          value={network} 

        >
                     <MenuItem selected value={8}>Select Network</MenuItem>

          <MenuItem value="https://mainnet.infura.io/v3/33c103f4c72c46879ad549b60db2f805">
          <FaEthereum/> {" "} Ethereum Mainnet
          
          </MenuItem>
          <MenuItem value="https://ropsten.infura.io/v3/33c103f4c72c46879ad549b60db2f805">   
         <SiHiveBlockchain/>  {" "}Ropsten Testnet
          
          </MenuItem>
          <MenuItem value="https://data-seed-prebsc-1-s1.binance.org:8545/">
          <SiBitcoinsv/>  {" "} Bsc Smart Chain
            
            </MenuItem>
          
        </Select>
      </FormControl>
    </Box>
  );
}