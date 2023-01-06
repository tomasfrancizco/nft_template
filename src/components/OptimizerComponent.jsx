import { useState } from 'react'
import { ethers } from "ethers";

const OptimizerComponent = ({USDCContract, optimizerContract, account, provider, optimizerContractAddress}) => {

  const [error, setError] = useState("")
  const [carName, setCarName] = useState(null)
  const [carPrice, setCarPrice] = useState(null)
  const [artName, setArtName] = useState(null)
  const [artPrice, setArtPrice] = useState(null)
  const [merchPrice, setMerchPrice] = useState(null)

  async function approveUsdc() {
    setError("")
    try {
      const params = [{
        from: account,
        to: USDCContract.address,
        data: `0x095ea7b3000000000000000000000000${optimizerContractAddress.substring(2)}ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff`
      }];
      // data is calling approve function with these parameters, allowing Grace's contract to manage user's USDCs:
      // approve(USDCContract.address, 2^256);
      const transactionHash = await provider.send('eth_sendTransaction', params)
      console.log('transactionHash is ' + transactionHash)
    } catch (e) {
      console.error({ e })
      setError(e.reason)
    }
  }

  async function buyCar(carName, carPrice) {
    setError("")
    try {
      const transaction = await optimizerContract.buyCar(carName, carPrice)
      await transaction.wait()
      console.log({ transaction })
      return transaction
    } catch (e) {
      console.error({ e })
      setError(e.reason)
    }
  }

  async function buyArt(artName, artPrice) {
    setError("")
    try {
      const transaction = await optimizerContract.buyArt(artName, artPrice)
      await transaction.wait()
      console.log({ transaction })
      return transaction
    } catch (e) {
      console.error({ e })
      setError(e.reason)
    }
  }

  async function buyMerch(merchPrice) {
    setError("")
    try {
      const transaction = await optimizerContract.buyMerch(merchPrice)
      await transaction.wait()
      console.log({ transaction })
      return transaction
    } catch (e) {
      console.error({ e })
      setError(e.reason)
    }
  }

  async function buyCarArt(carName, artName, carPrice, artPrice) {
    setError("")
    try {
      const transaction = await optimizerContract.buyCarArt(carName, artName, carPrice, artPrice)
      await transaction.wait()
      console.log({ transaction })
      return transaction
    } catch (e) {
      console.error({ e })
      setError(e.reason)
    }
  }

  async function buyCarMerch(carName, carPrice, merchPrice) {
    setError("")
    try {
      const transaction = await optimizerContract.buyCarMerch(carName, carPrice, merchPrice)
      await transaction.wait()
      console.log({ transaction })
      return transaction
    } catch (e) {
      console.error({ e })
      setError(e.reason)
    }
  }

  async function buyArtMerch(artName, artPrice, merchPrice) {
    setError("")
    try {
      const transaction = await optimizerContract.buyArtMerch(artName, artPrice, merchPrice)
      await transaction.wait()
      console.log({ transaction })
      return transaction
    } catch (e) {
      console.error({ e })
      setError(e.reason)
    }
  }

  async function buyCarArtMerch(carName, artName, carPrice, artPrice, merchPrice) {
    setError("")
    try {
      const transaction = await optimizerContract.buyCarArtMerch(carName, artName, carPrice, artPrice, merchPrice)
      await transaction.wait()
      console.log({ transaction })
      return transaction
    } catch (e) {
      console.error({ e })
      setError(e.reason)
    }
  }


  // buyCarArtMerch
  // setReceiver
  // setCarsAddress
  // setArtsAddress

  return (
    <div className="template_container" style={{"display": "none"}} >
      <div className="module_container">
        <span>
          OPTIMIZER Contract Address:{" "}
          <a href={`https://goerli.etherscan.io/address/${optimizerContractAddress}`}>
            {optimizerContractAddress}
          </a>
        </span>
      </div>
      <span id="errors">{error ? `error: ${error}` : null}</span>

      <div className="module_container">
        <div className="input_container">
          <button onClick={() => approveUsdc()}>Approve USDC contract</button>
        </div>
        <span className="description">
          This is a function that buyers will need to call before calling any other 'buy' function.
          <br></br>
          It's a standard ERC20 (USDCs standard) function that allows Grace's
          contract to manage the user's USDC.
          <br></br>
          In this case it's needed because Grace's contract will have to
          transfer the car's price from the user to the receiver.
          <br></br>
          In a production environment you can put the two transactions (approve
          & buy) together in the same button.
          <br></br>
          In that case the user will click the button only once but will still
          need to interact twice with metamask. To approve and buy.
        </span>
      </div>

      <div className="module_container">
        <div className="input_container">
          <div>
            <input
              onChange={(e) => setCarName(e.target.value)}
              placeholder="Car Name"
            />
            <input
              onChange={(e) => setCarPrice(e.target.value)}
              placeholder="Car Price"
            />
          </div>
          <button onClick={() => buyCar(carName, carPrice)}>
            Buy Car
          </button>
        </div>
        <span className="description">
          The car needs to be available and not paused.
          <br></br>
          It's important that the parameter (name) sent with this function is
          equal to Pinata's json name.
          <br></br>
          Because the URL created will be "baseURL + carName + .json".
          <br></br>
          Car price sent must be equal to car's price in cars contract list.
          <br></br>
          This function will transfer the car's price from the user to the
          receiver account.
          <br></br>
          User needs to call 'approve()' function first.
        </span>
      </div>

      <div className="module_container">
        <div className="input_container">
          <div>
            <input
              onChange={(e) => setArtName(e.target.value)}
              placeholder="Art Name"
            />
            <input
              onChange={(e) => setArtPrice(e.target.value)}
              placeholder="Art Price"
            />
          </div>
          <button onClick={() => buyArt(artName, artPrice)}>
            Buy Art
          </button>
        </div>
        <span className="description">
          The art needs to be available and not paused.
          <br></br>
          It's important that the parameter (name) sent with this function is
          equal to Pinata's json name.
          <br></br>
          Because the URL created will be "baseURL + artName + .json".
          <br></br>
          Art price sent must be equal to art's price in cars contract list.
          <br></br>
          This function will transfer the art's price from the user to the
          receiver account.
          <br></br>
          User needs to call 'approve()' function first.
        </span>
      </div>

      <div className="module_container">
        <div className="input_container">
          <div>
            <input
              onChange={(e) => setMerchPrice(e.target.value)}
              placeholder="Merch Price"
            />
          </div>
          <button onClick={() => buyMerch(merchPrice)}>
            Buy Merch
          </button>
        </div>
        <span className="description">
          This function will transfer the merch's price from the user to the
          receiver account.
          <br></br>
          User needs to call 'approve()' function first.
        </span>
      </div>

      <div className="module_container">
        <div className="input_container">
          <div>
            <input
              onChange={(e) => setCarName(e.target.value)}
              placeholder="Car Name"
            />
            <input
              onChange={(e) => setArtName(e.target.value)}
              placeholder="Art Name"
            />
            <input
              onChange={(e) => setCarPrice(e.target.value)}
              placeholder="Car Price"
            />
            <input
              onChange={(e) => setArtPrice(e.target.value)}
              placeholder="Art Price"
            />
          </div>
          <button onClick={() => buyCarArt(carName, artName, carPrice, artPrice)}>
            Buy Car & Art
          </button>
        </div>
        <span className="description">
          Both car and art need to be available and not paused.
          <br></br>
          It's important that the parameters (name) sent with this function are
          equal to Pinata's json names.
          <br></br>
          Because the URL created will be "baseURL + carName + .json" and "baseURL + artName + .json".
          <br></br>
          Prices sent must be equal to prices in original contracts lists.
          <br></br>
          This function will transfer the prices from the user to the
          receiver account.
          <br></br>
          User needs to call 'approve()' function first.
        </span>
      </div>

      <div className="module_container">
        <div className="input_container">
          <div>
            <input
              onChange={(e) => setCarName(e.target.value)}
              placeholder="Car Name"
            />
            <input
              onChange={(e) => setCarPrice(e.target.value)}
              placeholder="Car Price"
            />
            <input
              onChange={(e) => setMerchPrice(e.target.value)}
              placeholder="Merch Price"
            />
          </div>
          <button onClick={() => buyCarMerch(carName, carPrice, merchPrice)}>
            Buy Car & Merch
          </button>
        </div>
        <span className="description">
          The car needs to be available and not paused.
          <br></br>
          It's important that the parameter (name) sent with this function is
          equal to Pinata's json name.
          <br></br>
          Because the URL created will be "baseURL + carName + .json".
          <br></br>
          Car price sent must be equal to car's price in cars contract list.
          <br></br>
          This function will transfer both the car and merch prices from the user to the
          receiver account.
          <br></br>
          User needs to call 'approve()' function first.
        </span>
      </div>


      <div className="module_container">
        <div className="input_container">
          <div>
            <input
              onChange={(e) => setArtName(e.target.value)}
              placeholder="Art Name"
            />
            <input
              onChange={(e) => setArtPrice(e.target.value)}
              placeholder="Art Price"
            />
            <input
              onChange={(e) => setMerchPrice(e.target.value)}
              placeholder="Merch Price"
            />
          </div>
          <button onClick={() => buyArtMerch(artName, artPrice, merchPrice)}>
            Buy Art & Merch
          </button>
        </div>
        <span className="description">
          The art needs to be available and not paused.
          <br></br>
          It's important that the parameter (name) sent with this function is
          equal to Pinata's json name.
          <br></br>
          Because the URL created will be "baseURL + artName + .json".
          <br></br>
          Art price sent must be equal to car's price in cars contract list.
          <br></br>
          This function will transfer both the art and merch prices from the user to the
          receiver account.
          <br></br>
          User needs to call 'approve()' function first.
        </span>
      </div>

      <div className="module_container">
        <div className="input_container">
          <div>
            <input
              onChange={(e) => setCarName(e.target.value)}
              placeholder="Car Name"
            />
            <input
              onChange={(e) => setArtName(e.target.value)}
              placeholder="Art Name"
            />
            <input
              onChange={(e) => setCarPrice(e.target.value)}
              placeholder="Car Price"
            />
            <input
              onChange={(e) => setArtPrice(e.target.value)}
              placeholder="Art Price"
            />
            <input
              onChange={(e) => setMerchPrice(e.target.value)}
              placeholder="Merch Price"
            />
          </div>
          <button onClick={() => buyCarArtMerch(carName, artName, carPrice, artPrice, merchPrice)}>
            Buy Car, Art & Merch
          </button>
        </div>
        <span className="description">
          Both car and art need to be available and not paused.
          <br></br>
          It's important that the parameters (name) sent with this function are
          equal to Pinata's json names.
          <br></br>
          Because the URL created will be "baseURL + carName + .json" and "baseURL + artName + .json".
          <br></br>
          Prices sent must be equal to prices in original contracts lists.
          <br></br>
          This function will transfer the prices from the user to the
          receiver account.
          <br></br>
          User needs to call 'approve()' function first.
        </span>
      </div>
      
    </div>
  );
};

export default OptimizerComponent;
