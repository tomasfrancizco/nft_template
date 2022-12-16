import logo from './logo.svg';
import './App.css';
import { ethers } from "ethers";
import  { useState } from 'react';
import GraceCars_ABI from './contracts/GraceCars_ABI'
import GraceArts_ABI from './contracts/GraceArts_ABI'
import USDCProxy_ABI from './contracts/USDCProxy_ABI'
import Web3Modal from 'web3modal';

import CarsComponent from './components/CarsComponent'
import ArtsComponent from './components/ArtsComponent'

// https://usdcfaucet.com/ --> click en ETH


function App() {


  const carsBaseUri = "https://gateway.pinata.cloud/ipfs/QmPbjHTxGx6187jnByK33LSxKLtTiYLSgNCRvaYGT2K6Pc/"
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
  
  const carsContractAddress = '0xa1d8E5962c2Da159938FB6139F3dF47Cb714138d' // contract in Goerli testnet
  const artsContractAddress = '0x4B166DBccDf79D2591b34DE47674e0acc6E8df65' // contract in Goerli testnet
  const usdcAddress = '0x07865c6E87B9F70255377e024ace6630C1Eaa37F' // goerli usdc proxy contract

  const [account, setAccount] = useState(null)
  const [carsContract, setCarsContract] = useState(null)
  const [artsContract, setArtsContract] = useState(null)
  const [USDCContract, setUSDCContract] = useState(null)
  let [provider, setProvider] = useState(null)

  const templates = document.getElementsByClassName('template_container')
  
  // @dev this function prompts user to connect metamask wallet
  // and sets the chosen address to 'account' variable
  async function requestAccount() {
    const web3Modal = new Web3Modal()
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
        graceCarsContractInstance = new ethers.Contract(carsContractAddress, GraceCars_ABI, signer)
        graceArtsContractInstance = new ethers.Contract(artsContractAddress, GraceArts_ABI, signer)
        USDCContractInstance = new ethers.Contract(usdcAddress, USDCProxy_ABI, signer)
        setCarsContract(graceCarsContractInstance)
        setArtsContract(graceArtsContractInstance)
        setUSDCContract(USDCContractInstance)
        document.getElementById('connect_button').style.display = "none"
        document.getElementsByClassName('tabs')[0].style.display = "flex"
        templates[0].style.display = "flex"
      } catch(e) {
        console.error({ e })
      }

    if (!provider) return
    else return [provider, graceCarsContractInstance, graceArtsContractInstance, USDCContractInstance]
  }

  const showCars = () => {
    templates[0].style.display = "flex";
    templates[1].style.display = "none"
  }

  const showArt = () => {
    templates[0].style.display = "none";
    templates[1].style.display = "flex"
  }

  return (
    <div className="App">
      <header className="App-header">
        <button id='connect_button' onClick={() => requestAccount()}>CONNECT WALLET</button>
        <div className='tabs' style={{"display": "none"}}>
          <div onClick={() => showCars()} className='tab'>CARS CONTRACT</div>
          <div onClick={() => showArt()} className='tab'>ART CONTRACT</div>
        </div>
        
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
