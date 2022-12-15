import logo from './logo.svg';
import './App.css';
import { ethers } from "ethers";
import  { useState } from 'react';
import GraceCars from './contracts/GraceCars'
import USDCProxy from './contracts/USDCProxy'
import Web3Modal from 'web3modal';

// agregar funciones tipo transferOwnership, grantRole, revokeRole, ponerlas activas o no segun usuario

// contrato arte
// withdrawUsdc?
// getCarsOnSale?
// getCarsSold?
// explicacion de funciones
// quitar los 6 ceros de los valores
// manejo de errores y confirmaciones


function App() {

  const baseUri = "https://gateway.pinata.cloud/ipfs/QmZ7aDrUAjuouNkSoMNoVaChJWuMwTmrT846vypobH2dy6/"

  const contractAddress = '0xDE031c9460249369104ee9cDf463Ab7E6028b319' // contract in Goerli
  const usdcAddress = '0x07865c6E87B9F70255377e024ace6630C1Eaa37F' // goerli usdc

  const [account, setAccount] = useState(null)
  const [contract, setContract] = useState(null)
  const [USDCContract, setUSDCContract] = useState(null)
  let [provider, setProvider] = useState(null)
  const [error, setError] = useState("")
  const [carNames, setCarNames] = useState(null)
  const [carPrices, setCarPrices] = useState(null)
  const [carName, setCarName] = useState(null)
  const [address, setAddress] = useState(null)
  const [newPrice, setNewPrice] = useState(null)
  const [carsByUser, setCarsByUser] = useState(null)
  const [newURL, setNewURL] = useState(null)
  const [marketplacePermission, setMarketplacePermission] = useState(null)
  const [role, setRole] = useState(null)
  
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
        document.getElementById('connect_button').style.display = "none"
        document.getElementById('template_container').style.display = "flex"
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
    setError("")
    try {
      const params = [{
        from: account,
        to: USDCContract.address,
        data: `0x095ea7b3000000000000000000000000${contractAddress.substring(2)}000000000000000000000000000000004b3b4ca85a86c47a098a223fffffffff`
      }];
  
      // approve(USDCContract.address, 99999999999999999999999999999999999999);
      const transactionHash = await provider.send('eth_sendTransaction', params)
      console.log('transactionHash is ' + transactionHash)
    } catch (e) {
      console.error({ e })
      setError(e.rason)
    }
  }

  async function putCarsOnSale(carNames, carPrices) {
    setError("")
    try {
      const namesArr = carNames.split(",")
      const pricesArr = carPrices.split(",")
      const transaction = await contract.putCarsOnSale(namesArr, pricesArr)
      await transaction.wait()
      return true
    } catch (e) {
      console.error({ e })
      setError(e.reason)
    }
  }

  async function buyCarOnChain(carName) {
    setError("")
    try {
      const transaction = await contract.buyCarOnChain(carName)
      await transaction.wait()
      return true
    } catch (e) {
      console.error({ e })
      setError(e.reason)
    }
  }

  async function buyCarOffChain(carName, account) {
    setError("")
    try {
      const transaction = await contract.buyCarOffChain(carName, account)
      await transaction.wait()
      return true
    } catch (e) {
      console.error({ e })
      setError(e.reason)
    }
  }

  async function changePrice(carName, newPrice) {
    setError("")
    try {
      const transaction = await contract.changePrice(carName, newPrice)
      await transaction.wait()
      return true
    } catch (e) {
      console.error({ e })
      setError(e.reason)
    }
  }

  async function pauseSale(carName) {
    setError("")
    try {
      const transaction = await contract.pauseSale(carName)
      await transaction.wait()
      return true
    } catch (e) {
      console.error({ e })
      setError(e.reason)
    }
  }

  async function unpauseSale(carName) {
    setError("")
    try {
      const transaction = await contract.unpauseSale(carName)
      await transaction.wait()
      return true
    } catch (e) {
      console.error({ e })
      setError(e.reason)
    }
  }

  async function getCarsByUser(address) {
    setError("")
    try {
      const transaction = await contract.getCarsByUser(address)
      console.log({ transaction })
      setCarsByUser(transaction[0].toString())
    } catch (e) {
      console.error({ e })
      setError(e.reason)
    }
  }

  async function setReceiver(address) {
    setError("")
    try {
      const transaction = await contract.setReceiver(address)
      await transaction.wait()
      return true
    } catch (e) {
      console.error({ e })
      setError(e.reason)
    }
  }

  async function setBaseURI(address) {
    setError("")
    try {
      const transaction = await contract.setBaseURI(address)
      await transaction.wait()
      return true
    } catch (e) {
      console.error({ e })
      setError(e.reason)
    }
  }

  async function checkMarketplacePermission() {
    setError("")
    try {
      const transaction = await contract.marketplaceAllowed()
      transaction ? setMarketplacePermission("true") : setMarketplacePermission("false")
      return transaction
    } catch (e) {
      console.error({ e })
      setError(e.reason)
    }
  }

  async function toggleMarketplacePermission() {
    setError("")
    try {
      const transaction = await contract.toggleMarketplacePermission()
      await transaction.wait()
      const result = await contract.marketplaceAllowed()
      result ? setMarketplacePermission("Marketplaces are now allowed") : setMarketplacePermission("Marketplaces are restricted")
      return result
    } catch (e) {
      console.error({ e })
      setError(e.reason)
    }
  }

  async function toggleMarketplaceAddress(address) {
    setError("")
    try {
      const transaction = await contract.toggleMarketplaceAddress(address)
      await transaction.wait()
      const result = await contract.marketplaceAllowed()
      return result
    } catch (e) {
      console.error({ e })
      setError(e.reason)
    }
  }

  async function grantRole(role, address) {
    setError("")
    const bytesRole = ethers.utils.id(role)
    try {
      const transaction = await contract.grantRole(bytesRole, address)
      await transaction.wait()
      return true
    } catch (e) {
      console.error({ e })
      setError(e.reason)
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <button id='connect_button' onClick={() => requestAccount()}>CONNECT WALLET</button>
        <div id='template_container' style={{"display": "none"}}>

          <div className='module_container'>
            <span>
              Contract Address: {" "}
              <a href={`https://goerli.etherscan.io/address/${contractAddress}`}>{contractAddress}</a>
            </span>
          </div>
          <span id='errors' >{error ? `error: ${error}` : null}</span>
          <div className='module_container'>
            <button onClick={() => approveUsdc()}>Approve USDC contract</button>
          </div>

          <div className='module_container'>
            <div className='input_container'>
              <input onChange={e => setCarNames(e.target.value)} placeholder='Name' />
              <input onChange={e => setCarPrices(e.target.value)} placeholder='Price' />
              <button onClick={() => putCarsOnSale(carNames, carPrices)}>Put Cars On Sale</button>
            </div>
          </div>

          <div className='module_container'>
            <div className='input_container'>
              <input onChange={e => setCarName(e.target.value)} placeholder='Car Name' />
              <button onClick={() => buyCarOnChain(carName)} >Buy Car On Chain</button>
            </div>
          </div>
          
          <div className='module_container'>
            <div className='input_container'>
              <input onChange={e => setAddress(e.target.value)} placeholder='Address' />
              <input onChange={e => setCarName(e.target.value)} placeholder='Car Name' />
              <button onClick={() => buyCarOffChain(carName, address)}>Buy Car Off Chain</button>
            </div>
          </div>

          <div className='module_container'>
            <div className='input_container'>
              <input onChange={e => setCarName(e.target.value)} placeholder='Car Name' />
              <input onChange={e => setNewPrice(e.target.value)} placeholder='New price' />
              <button onClick={() => changePrice(carName, newPrice)}>Change Price</button>
            </div>
          </div>

          <div className='module_container'>
            <div className='input_container'>
              <input onChange={e => setCarName(e.target.value)} placeholder='Car name'/>
              <button onClick={() => pauseSale(carName)}>Pause Sale</button>
            </div>            
          </div>

          <div className='module_container'>
            <div className='input_container'>
              <input onChange={e => setCarName(e.target.value)} placeholder='Car name'/>
              <button onClick={() => unpauseSale(carName)}>Unpause Sale</button>
            </div>
          </div>

          <div className='module_container'>
            <div className='input_container'>
              <input onChange={e => setAddress(e.target.value)} placeholder='Address'/>
              <button onClick={() => getCarsByUser(address)}>Get Cars By User</button>
            </div>
            
            <span>{carsByUser}</span>
          </div>

          <div className='module_container'>
            <div className='input_container'>
              <input onChange={e => setAddress(e.target.value)} placeholder='New Receiver'/>
              <button onClick={() => setReceiver(address)}>Set New Receiver</button>
            </div>
          </div>

          <div className='module_container'>
            <div className='input_container'>
              <input onChange={e => setNewURL(e.target.value)} placeholder='New Base URI'/>
              <button onClick={() => setBaseURI(newURL)}>Set New BaseUri</button>
            </div>
            
          </div>

          <div className='module_container'>
            <div className='input_container'>
              <button onClick={() => checkMarketplacePermission()}>Check Marketplace Permission</button>
              <button onClick={() => toggleMarketplacePermission()}>Toggle Marketplace Permission</button>
            </div>
            <span>{marketplacePermission}</span>
          </div>

          <div className='module_container'>
            <div className='input_container'>
              <input onChange={e => setAddress(e.target.value)} placeholder='Address'/>
              <button onClick={() => toggleMarketplaceAddress(address)}>Toggle Marketplace Address</button>
            </div>
            
          </div>

          <div className='module_container'>
            <div className='input_container'>
              <input onChange={e => setRole(e.target.value)} placeholder='Role'/>
              <input onChange={e => setAddress(e.target.value)} placeholder='Address'/>
              <button onClick={() => grantRole(role, address)}>Grant Role</button>
            </div>
            
          </div>

          <div className='module_container'>
            <div className='input_container'>
              <input placeholder='Role'/>
              <input placeholder='Address'/>
              <button>Revoke Role</button>
            </div>
            
          </div>

          <div className='module_container'>
            <div className='input_container'>
              <input placeholder='Role'/>
              <input placeholder='Address'/>
              <button>Renounce Role</button>
            </div>
            
          </div>

          <div style={{"marginBottom": "100px"}} className='module_container'>
            <div className='input_container'>
              <input placeholder='Address'/>
              <button>Transfer Ownership</button>
            </div>
          </div>

          

        </div>
      </header>
    </div>
  );
}

export default App;
