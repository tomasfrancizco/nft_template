import logo from './logo.svg';
import './App.css';
import { ethers } from "ethers";
import  { useState } from 'react';
import GraceCars from './contracts/GraceCars'
import USDCProxy from './contracts/USDCProxy'
import Web3Modal from 'web3modal';


function App() {

  const baseUri = "https://gateway.pinata.cloud/ipfs/QmZ7aDrUAjuouNkSoMNoVaChJWuMwTmrT846vypobH2dy6/"

  const contractAddress = '0x838499B1f2e2F824e4f43868d082d2b58D781D16' // contract in Goerli
  const usdcAddress = '0x07865c6E87B9F70255377e024ace6630C1Eaa37F' // goerli usdc

  const price = ethers.BigNumber.from('1000000000000');

  const [account, setAccount] = useState(null)
  const [contract, setContract] = useState(null)
  const [USDCContract, setUSDCContract] = useState(null)
  let [provider, setProvider] = useState(null)
  const [carNames, setCarNames] = useState(null)
  const [carPrices, setCarPrices] = useState(null)
  const [carName, setCarName] = useState(null)
  
  async function requestAccount() {
    const web3Modal = new Web3Modal()
    let graceContractInstance;
    let USDCContractInstance;
      try {
        const connection = await web3Modal.connect()
        provider = new ethers.providers.Web3Provider(connection)
        setProvider(provider)
        const signer = await provider.getSigner()
        const address = await signer.getAddress()
        setAccount(address)

        // connect contracts and generate instances
        graceContractInstance = new ethers.Contract(contractAddress, GraceCars, signer)
        USDCContractInstance = new ethers.Contract(usdcAddress, USDCProxy, signer)
        setContract(graceContractInstance)
        setUSDCContract(USDCContractInstance)
        console.log([graceContractInstance, USDCContractInstance])
        console.log({provider})
        document.getElementById('connect_button').style.display = "none"
        document.getElementById('template_container').style.display = "block"
      } catch(e) {
        console.error({ e })
      }

    if (!provider) return
    else return [provider, graceContractInstance, USDCContractInstance]

    // const chain = (await provider.getNetwork()).chainId
    // setChainId(decToHex(chain))

    // const chainName = "Goerli"
    // const rpcUrl = "https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"
    // const currency = "gETH"
    // const explorer = "https://goerli.etherscan.io"
    // switchOrCreateNetwork(validChainId, chainName, rpcUrl, currency, explorer)
  }

  async function approveUsdc() {
    const params = [{
      from: account,
      to: USDCContract.address,
      data: `0x095ea7b3000000000000000000000000${contractAddress.substring(2)}000000000000000000000000000000004b3b4ca85a86c47a098a223fffffffff`
    }];

    // approve(USDCContract.address, 99999999999999999999999999999999999999);
  
    const transactionHash = await provider.send('eth_sendTransaction', params)
    console.log('transactionHash is ' + transactionHash)
  }

  async function putCarsOnSale(carNames, carPrices) {
    try {
      const namesArr = carNames.split(",")
      const pricesArr = carPrices.split(",")
      const putOnSale = await contract.putCarsOnSale(namesArr, pricesArr)
      await putOnSale.wait()
      return true
    } catch (e) {
      console.log({ e })
    }
  }

  async function buyCarOnChain(carName) {
    try {
      const buyOnChain = await contract.buyCarOnChain(carName)
      await buyOnChain.wait()
      return true
    } catch (e) {
      console.log({ e })
    }
  }

  async function buyCarOffChain(carName, account){}


  return (
    <div className="App">
      <header className="App-header">
        <button id='connect_button' onClick={() => requestAccount()}>CONNECT WALLET</button>
        <div id='template_container' style={{"display": "none"}}>

          <div>
            <button onClick={() => approveUsdc()}>Approve USDC contract</button>
          </div>

          <div>
            <input onChange={e => setCarNames(e.target.value)} placeholder='name' />
            <input onChange={e => setCarPrices(e.target.value)} placeholder='price' />
            <button onClick={() => putCarsOnSale(carNames, carPrices)}>Put Cars On Sale</button>
          </div>

          <div>
            <input onChange={e => setCarName(e.target.value)} placeholder='Car Name' />
            <button onClick={() => buyCarOnChain(carName)} >Buy Car On Chain</button>
          </div>
          
          <div>
            <input placeholder='Address' />
            <input placeholder='Car Name' />
            <button>Buy Car Off Chain</button>
          </div>

          <div>
            <input placeholder='New price' />
            <button>Change Price</button>
          </div>

          <div>
            <input placeholder='Car name'/>
            <button>Pause Sale</button>
          </div>

          <div>
            <input placeholder='Car name'/>
            <button>Unpause Sale</button>
          </div>

          <div>
            <input placeholder='New receiver'/>
            <button>Set New Receiver</button>
          </div>

          <div>
            <input placeholder='New Base URI'/>
            <button>Set New BaseUri</button>
          </div>

          <div>
            <button>Toggle Marketplace Permission</button>
          </div>

          <div>
            <input placeholder='Address'/>
            <button>Toggle Marketplace Address</button>
          </div>

        </div>
      </header>
    </div>
  );
}

export default App;
