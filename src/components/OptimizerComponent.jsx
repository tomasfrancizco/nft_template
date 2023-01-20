import { useState } from 'react'
import { ethers } from "ethers";

const OptimizerComponent = (props) => {
  const { USDCContract,
          optimizerContract,
          account,
          provider,
          optimizerContractAddress,
          switchOrCreateNetwork,
          validChainId,
          chainName,
          rpcUrl,
          currency,
          explorer
          } = props;

  const [error, setError] = useState("")
  const [carNames, setCarNames] = useState(null)
  const [carPrices, setCarPrices] = useState(null)
  const [artNames, setArtNames] = useState(null)
  const [artPrices, setArtPrices] = useState(null)
  const [merchPrice, setMerchPrice] = useState(null)

  // this function first asks the user to change network, if the user rejects the tx it doesn't go through
  async function approveUsdc() {
    setError("")
    switchOrCreateNetwork(validChainId,chainName,rpcUrl,currency,explorer)
      .then( async (res) => {
        if(res !== 'userRejected'){
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
      })
      .catch(e => {
        console.error({ e })
      })
  }

  async function buy(carNames, artNames, carPrices, artPrices, merchPrice) {
    setError("")
    const carNamesArr = carNames.split(",");
    const artNamesArr = artNames.split(",");
    const carPricesArr = carPrices.split(",");
    const artPricesArr = artPrices.split(",");
    try {
      const transaction = await optimizerContract.buy(carNamesArr, artNamesArr, carPricesArr, artPricesArr, merchPrice)
      await transaction.wait()
      console.log({ transaction })
      return transaction
    } catch (e) {
      console.error({ e })
      setError(e.reason)
    }
  }

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
          THIS FUNCTION FIRST ASKS THE USER TO CHANGE NETWORK IF IT'S IN ANOTHER THAN GOERLI.
          IF USER REJECTS THE CHANGE, THE TX DOESN'T GO THROUGH.
          <br></br>
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
              onChange={(e) => setCarNames(e.target.value)}
              placeholder="Car Names"
            />
            <input
              onChange={(e) => setCarPrices(e.target.value)}
              placeholder="Art Names"
            />
            <input
              onChange={(e) => setArtNames(e.target.value)}
              placeholder="Car Prices"
            />
            <input
              onChange={(e) => setArtPrices(e.target.value)}
              placeholder="Art Prices"
            />
            <input
              onChange={(e) => setMerchPrice(e.target.value)}
              placeholder="Merch Price"
            />
          </div>
          <button onClick={() => buy(carNames, artNames, carPrices, artPrices, merchPrice)}>
            Buy
          </button>
        </div>
        <span className="description">
          Contract's function receives 4 arrays (car & art names & prices) and a uint (merch price)
          <br></br>
          Therefore inputs must be in format carName1,carName2,... and 1000000,2000000,...
          <br></br>
          User needs to call 'approve()' function first.
        </span>
      </div>
    </div>
  );
};

export default OptimizerComponent;
