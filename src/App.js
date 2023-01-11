import logo from './logo.svg';
import './App.css';
import { ethers } from "ethers";
import  { useState, useEffect } from 'react';
import GraceCars_ABI from './contracts/GraceCars_ABI'
import GraceArts_ABI from './contracts/GraceArts_ABI'
import GraceOptimizer_ABI from './contracts/GraceOptimizer_ABI'
import USDCProxy_ABI from './contracts/USDCProxy_ABI'
import Web3Modal from 'web3modal';

import CarsComponent from './components/CarsComponent'
import ArtsComponent from './components/ArtsComponent'
import OptimizerComponent from './components/OptimizerComponent'

// https://usdcfaucet.com/ --> click en ETH


function App() {

  const carsBaseUri = "https://gateway.pinata.cloud/ipfs/QmdyXFSGq2XFRLhpu3tQn7oAMLQn7HhucLa3LqvZW9MzW6/"
  // in this folder you'll find the following cars:
  // auto_uno.json
  // auto_dos.json
  // auto_tres.json
  // auto_cuatro.json
  // auto_cinco.json

  const artsBaseUri = "https://gateway.pinata.cloud/ipfs/QmXMNG6R7b5pkhXDSjSA8Qq2UjcKUaSusPHtDcx2DP7kcu/"
  // in this folder you'll find the following pieces of art:
  // arte_uno.json
  // arte_dos.json
  // arte_tres.json
  // arte_cuatro.json
  // arte_cinco.json
  
  const optimizerContractAddress = '0x7F1d3622b93B34728148653cF386efAdD91fF722' // contract in Goerli testnet
  const carsContractAddress = '0xe53e9A2E2C90768381bB121E9aa772fcF8786732' // contract in Goerli testnet
  const artsContractAddress = '0x22FC1903aD702591DaDfB9e0F84E06922d2A8F40' // contract in Goerli testnet
  const usdcAddress = '0x07865c6E87B9F70255377e024ace6630C1Eaa37F' // goerli usdc proxy contract

  const validChainId = "0x5" // "0x1" for Mainnet
  const chainName = "Goerli";
  const rpcUrl = "https://rpc.ankr.com/eth_goerli"
  const currency = "ETH";
  const explorer = "https://goerli.etherscan.io";

  const [chainId, setChainId] = useState(null)
  const [account, setAccount] = useState(null)
  const [optimizerContract, setOptimizerContract] = useState(null)
  const [carsContract, setCarsContract] = useState(null)
  const [artsContract, setArtsContract] = useState(null)
  const [USDCContract, setUSDCContract] = useState(null)
  let [provider, setProvider] = useState(null)

  const templates = document.getElementsByClassName('template_container')
  
  // @dev this function prompts user to connect metamask wallet
  // and sets the chosen address to 'account' variable
  async function requestAccount() {
    const web3Modal = new Web3Modal()
    let optimizerContractInstance;
    let graceCarsContractInstance;
    let graceArtsContractInstance;
    let USDCContractInstance;

      try {
        const connection = await web3Modal.connect()
        provider = new ethers.providers.Web3Provider(connection)
        setProvider(provider)
        const signer = await provider.getSigner()
        const address = await signer.getAddress()
        setAccount(address)

        // connect contracts and generate instances
        optimizerContractInstance = new ethers.Contract(optimizerContractAddress, GraceOptimizer_ABI, signer)
        graceCarsContractInstance = new ethers.Contract(carsContractAddress, GraceCars_ABI, signer)
        graceArtsContractInstance = new ethers.Contract(artsContractAddress, GraceArts_ABI, signer)
        USDCContractInstance = new ethers.Contract(usdcAddress, USDCProxy_ABI, signer)

        setOptimizerContract(optimizerContractInstance)
        setCarsContract(graceCarsContractInstance)
        setArtsContract(graceArtsContractInstance)
        setUSDCContract(USDCContractInstance)
      } catch(e) {
        console.error({ e })
      }

    if (!provider) return
    const chain = (await provider.getNetwork()).chainId;
    setChainId(decToHex(chain));
    return [provider, graceCarsContractInstance, graceArtsContractInstance, USDCContractInstance]
  }
  
  useEffect(() => {
    if(window && window.ethereum !== undefined){  
      window.ethereum.on('chainChanged', newChain => {
        setChainId(decToHex(newChain))
        requestAccount()
      })
    }
  }, [])

  function decToHex(number) {
    return `0x${parseInt(number).toString(16)}`;
  }

  async function switchOrCreateNetwork(
    chainIdHex,
    chainName,
    rpcUrl,
    currency,
    explorer
  ) {
    try {
      // asks user to change chain
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: chainIdHex }],
      });
    } catch (error) {
      if (error.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: chainIdHex,
                chainName: chainName,
                rpcUrls: [rpcUrl],
                nativeCurrency: {
                  name: currency,
                  symbol: currency,
                  decimals: 18,
                },
                blockExplorerUrls: [explorer],
              },
            ],
          });
        } catch (e) {
          console.error(e.message);
        }  
      } else if(error.code === 4001) { // error code 4001 is 'user rejected the request'
        return "userRejected"
      }
    }
  }

  const connectToMetamask = () => {
    requestAccount()
      .then(() => {
        switchOrCreateNetwork(validChainId, chainName, rpcUrl, currency, explorer)
        .then((res) => {
          if(res !== 'userRejected'){
            document.getElementById('connect_button').style.display = "none"
            document.getElementsByClassName('tabs')[0].style.display = "flex"
            templates[0].style.display = "flex"
          }
        })
        .catch(e => {
          console.error({ e })
        })
      })
      .catch((e) => {
        console.error({ e })
      })
  }
  

  const showCars = () => {
    templates[0].style.display = "none";
    templates[1].style.display = "flex";
    templates[2].style.display = "none"
  }

  const showArt = () => {
    templates[0].style.display = "none";
    templates[1].style.display = "none";
    templates[2].style.display = "flex"
  }

  const showOptimizer = () => {
    templates[0].style.display = "flex";
    templates[1].style.display = "none";
    templates[2].style.display = "none"
  }

  return (
    <div className="App">
      <header className="App-header">
        <button id='connect_button' onClick={() => connectToMetamask()}>CONNECT WALLET</button>
        <div className='tabs' style={{"display": "none"}}>
          <div onClick={() => showOptimizer()} className='tab'>OPTIMIZER CONTRACT</div>
          <div onClick={() => showCars()} className='tab'>CARS CONTRACT</div>
          <div onClick={() => showArt()} className='tab'>ART CONTRACT</div>
        </div>

        <OptimizerComponent
          USDCContract={USDCContract}
          optimizerContract={optimizerContract}
          account={account}
          provider={provider}
          optimizerContractAddress={optimizerContractAddress}
          switchOrCreateNetwork={switchOrCreateNetwork}
          validChainId={validChainId}
          chainName={chainName}
          rpcUrl={rpcUrl}
          currency={currency}
          explorer={explorer}
        />
        
        <CarsComponent
          USDCContract={USDCContract}
          carsContract={carsContract}
          account={account}
          provider={provider}
          carsContractAddress={carsContractAddress}
        />
        <ArtsComponent
          USDCContract={USDCContract}
          artsContract={artsContract}
          account={account}
          provider={provider}
          artsContractAddress={artsContractAddress}
        />
      </header>
    </div>
  );
}

export default App;
