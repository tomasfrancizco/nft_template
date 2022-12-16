import { useState } from 'react'
import { ethers } from "ethers";

const CarsComponent = ({USDCContract, carsContract, account, provider, carsContractAddress}) => {

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

  async function approveUsdc() {
    setError("")
    try {
      const params = [{
        from: account,
        to: USDCContract.address,
        data: `0x095ea7b3000000000000000000000000${carsContractAddress.substring(2)}ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff`
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

  // contract's function 'putCarsOnSale()' takes two parameters: a string array and a uint array.
  // in this template, both need to be entered separated by commas with no spaces.
  // e.g.: car_one,car_two,car_three // 100000000000,200000000000,300000000000
  // this allows the NFTs to be bought later on
  async function putCarsOnSale(carNames, carPrices) {
    setError("")
    try {
      const namesArr = carNames.split(",")
      const pricesArr = carPrices.split(",")
      const transaction = await carsContract.putCarsOnSale(namesArr, pricesArr)
      await transaction.wait()
      console.log({ transaction }) // the wait() method can be used only for write functions (not read)
      return transaction
    } catch (e) {
      console.error({ e })
      setError(e.reason)
    }
  }

  async function buyCarOnChain(carName) {
    setError("")
    try {
      const transaction = await carsContract.buyCarOnChain(carName)
      await transaction.wait()
      console.log({ transaction })
      return transaction
    } catch (e) {
      console.error({ e })
      setError(e.reason)
    }
  }

  async function buyCarOffChain(carName, account) {
    setError("")
    try {
      const transaction = await carsContract.buyCarOffChain(carName, account)
      await transaction.wait()
      console.log({ transaction })
      return transaction
    } catch (e) {
      console.error({ e })
      setError(e.reason)
    }
  }

  async function changePrice(carName, newPrice) {
    setError("")
    try {
      const transaction = await carsContract.changePrice(carName, newPrice)
      await transaction.wait()
      console.log({ transaction })
      return transaction
    } catch (e) {
      console.error({ e })
      setError(e.reason)
    }
  }

  async function pauseSale(carName) {
    setError("")
    try {
      const transaction = await carsContract.pauseSale(carName)
      await transaction.wait()
      console.log({ transaction })
      return transaction
    } catch (e) {
      console.error({ e })
      setError(e.reason)
    }
  }

  async function unpauseSale(carName) {
    setError("")
    try {
      const transaction = await carsContract.unpauseSale(carName)
      await transaction.wait()
      console.log({ transaction })
      return transaction
    } catch (e) {
      console.error({ e })
      setError(e.reason)
    }
  }

  async function getCarsByUser(address) {
    setError("")
    try {
      const transaction = await carsContract.getCarsByUser(address)
      if(transaction.length > 0){
        console.log({ transaction })
        let res = [];
        for(let i=0;i<transaction.length;i++){
          res.push(transaction[i].toString())
        }
        setCarsByUser(res)
      } else {
        setError("User has no cars.")
      }
    } catch (e) {
      console.error({ e })
      setError(e.reason)
    }
  }

  async function setReceiver(address) {
    setError("")
    try {
      const transaction = await carsContract.setReceiver(address)
      await transaction.wait()
      console.log({ transaction })
      return transaction
    } catch (e) {
      console.error({ e })
      setError(e.reason)
    }
  }

  async function setBaseURI(address) {
    setError("")
    try {
      const transaction = await carsContract.setBaseURI(address)
      await transaction.wait()
      console.log({ transaction })
      return transaction
    } catch (e) {
      console.error({ e })
      setError(e.reason)
    }
  }

  async function checkMarketplacePermission() {
    setError("")
    try {
      const transaction = await carsContract.marketplaceAllowed() // marketplaceAllowed is a public variable in the contract, hence it can be called this way
      transaction ? setMarketplacePermission("true") : setMarketplacePermission("false")
      console.log({ transaction })
      return transaction
    } catch (e) {
      console.error({ e })
      setError(e.reason)
    }
  }

  async function toggleMarketplacePermission() {
    setError("")
    try {
      const transaction = await carsContract.toggleMarketplacePermission()
      await transaction.wait()
      const result = await carsContract.marketplaceAllowed()
      result ? setMarketplacePermission("Marketplaces are now allowed") : setMarketplacePermission("Marketplaces are restricted")
      console.log({ transaction })
      return transaction
    } catch (e) {
      console.error({ e })
      setError(e.reason)
    }
  }

  async function toggleMarketplaceAddress(address) {
    setError("")
    try {
      const transaction = await carsContract.toggleMarketplaceAddress(address)
      await transaction.wait()
      console.log({ transaction })
      return transaction
    } catch (e) {
      console.error({ e })
      setError(e.reason)
    }
  }

  async function grantRole(role, address) {
    setError("")
    let bytesRole;
    if(role !== "DEFAULT_ADMIN_ROLE"){
      bytesRole = ethers.utils.id(role)
    } else {
      bytesRole = "0x0000000000000000000000000000000000000000000000000000000000000000"
    }
    // contract's function asks for the keccak256 hash of the role's text
    // this is ethers function to compute the keccak256 hash of the text bytes
    try {
      const transaction = await carsContract.grantRole(bytesRole, address)
      await transaction.wait()
      console.log({ transaction })
      return transaction
    } catch (e) {
      console.error({ e })
      setError(e.reason)
    }
  }

  async function revokeRole(role, address) {
    setError("")
    const bytesRole = ethers.utils.id(role)
    try {
      const transaction = await carsContract.revokeRole(bytesRole, address)
      await transaction.wait()
      console.log({ transaction })
      return transaction
    } catch (e) {
      console.error({ e })
      setError(e.reason)
    }
  }

  async function renounceRole(role, address) {
    setError("")
    const bytesRole = ethers.utils.id(role)
    try {
      const transaction = await carsContract.revokeRole(bytesRole, address)
      await transaction.wait()
      console.log({ transaction })
      return transaction
    } catch (e) {
      console.error({ e })
      setError(e.reason)
    }
  }

  return (
    <div className="template_container" style={{ display: "none" }}>
      <div className="module_container">
        <span>
          CARS Contract Address:{" "}
          <a href={`https://goerli.etherscan.io/address/${carsContractAddress}`}>
            {carsContractAddress}
          </a>
        </span>
      </div>
      <span id="errors">{error ? `error: ${error}` : null}</span>

      <div className="module_container">
        <div className="input_container">
          <input
            onChange={(e) => setCarNames(e.target.value)}
            placeholder="Name"
          />
          <input
            onChange={(e) => setCarPrices(e.target.value)}
            placeholder="Price"
          />
          <button onClick={() => putCarsOnSale(carNames, carPrices)}>
            Put Cars On Sale
          </button>
        </div>
        <span className="description">
          Only DEFAULT_ADMIN_ROLE & SUBADMIN can put cars on sale.
          <br></br>
          Cars need to be on a 'sale' list in order to be sold. You can add up
          to 10 cars per tx. In this case, values should be separated by commas
          and both lists should have the same length.
          <br></br>
          E.g.: names: auto_uno, auto_dos & prices: 300000000000,500000000000.
          <br></br>
          (remember that USDC has 6 decimals, hence we need to add 6 0's to the
          value.
          <br></br>
          If the price is $300.000, we need to type 300000000000)
          <br></br>
          The contract's function receives two arrays: ["auto_uno", "auto_dos"]
          & [300000000000,500000000000].
          <br></br>
          We recommend that you upload each car's json file to Pinata before
          putting them on sale.
        </span>
      </div>

      <div className="module_container">
        <div className="input_container">
          <button onClick={() => approveUsdc()}>Approve USDC contract</button>
        </div>
        <span className="description">
          This is a function that buyers will need to call before calling
          'buyCarOnChain()'.
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
          <input
            onChange={(e) => setCarName(e.target.value)}
            placeholder="Car Name"
          />
          <button onClick={() => buyCarOnChain(carName)}>
            Buy Car On Chain
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
          This function will transfer the car's price from the user to the
          receiver account.
          <br></br>
          User needs to call 'approve()' function first.
        </span>
      </div>

      <div className="module_container">
        <div className="input_container">
          <input
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Address"
          />
          <input
            onChange={(e) => setCarName(e.target.value)}
            placeholder="Car Name"
          />
          <button onClick={() => buyCarOffChain(carName, address)}>
            Buy Car Off Chain
          </button>
        </div>
        <span className="description">
          The only difference between this function and 'buyCarOnChain()' is
          that this one doesn't transfer USDCs.
          <br></br>
          It is also important that the parameter (name) is equal to Pinata's
          json name.
          <br></br>
          Can only be called by DEFAULT_ADMIN_ROLE & SUBADMIN.
        </span>
      </div>

      <div className="module_container">
        <div className="input_container">
          <input
            onChange={(e) => setCarName(e.target.value)}
            placeholder="Car Name"
          />
          <input
            onChange={(e) => setNewPrice(e.target.value)}
            placeholder="New price"
          />
          <button onClick={() => changePrice(carName, newPrice)}>
            Change Price
          </button>
        </div>
        <span className="description">
          If the new price is lower, only ADMIN can call the function.
          <br></br>
          If the new price is higher, both ADMIN & SUBADMIN can call the
          function.
        </span>
      </div>

      <div className="module_container">
        <div className="input_container">
          <input
            onChange={(e) => setCarName(e.target.value)}
            placeholder="Car name"
          />
          <button onClick={() => pauseSale(carName)}>Pause Sale</button>
        </div>
        <span className="description">
          Only DEFAULT_ADMIN_ROLE & SUBADMIN can pause sales.
          <br></br>
          This prevents cars to be sold, both ON & OFF chain.
        </span>
      </div>

      <div className="module_container">
        <div className="input_container">
          <input
            onChange={(e) => setCarName(e.target.value)}
            placeholder="Car name"
          />
          <button onClick={() => unpauseSale(carName)}>Unpause Sale</button>
        </div>
        <span className="description">
          Only DEFAULT_ADMIN_ROLE & SUBADMIN can unpause sales.
          <br></br>
          This prevents car to be sold, both ON & OFF chain.
        </span>
      </div>

      <div className="module_container">
        <div className="input_container">
          <input
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Address"
          />
          <button onClick={() => getCarsByUser(address)}>
            Get Cars By User
          </button>
        </div>
        <span className="description">
          Returns the list of car's objects each user has bought.
          <br></br>
          Keys are: name, owner, price, timestamp.
        </span>
        <span>{carsByUser}</span>
      </div>

      <div className="module_container">
        <div className="input_container">
          <input
            onChange={(e) => setAddress(e.target.value)}
            placeholder="New Receiver"
          />
          <button onClick={() => setReceiver(address)}>Set New Receiver</button>
        </div>
        <span className="description">
          <span className="description">
            Only DEFAULT_ADMIN_ROLE can change the receiver.
            <br></br>
            All future sales through 'buyCarOnChain()' function will be
            transferred to this address until it's changed again.
          </span>
        </span>
      </div>

      <div className="module_container">
        <div className="input_container">
          <input
            onChange={(e) => setNewURL(e.target.value)}
            placeholder="New Base URI"
          />
          <button onClick={() => setBaseURI(newURL)}>Set New BaseUri</button>
        </div>
        <span className="description">
          Only DEFAULT_ADMIN_ROLE can change baseUri.
          <br></br>
          This function only applies to new NFTS. When minting them, the URL
          created is "baseUri + carName + .json".
          <br></br>
          E.g.:
          https://gateway.pinata.cloud/ipfs/QmZ7aDrUAjuouNkSoMNoVaChJWuMwTmrT846vypobH2dy6/car_one.json
        </span>
      </div>

      <div className="module_container">
        <div className="input_container">
          <button onClick={() => checkMarketplacePermission()}>
            Check Marketplace Permission
          </button>
          <button onClick={() => toggleMarketplacePermission()}>
            Toggle Marketplace Permission
          </button>
        </div>
        <span className="description">
          Only DEFAULT_ADMIN_ROLE can toggle marketplace permission.
          <br></br>
          Check Marketplace Permission tells us if marketplaces in general are
          allowed or restricted.
          <br></br>
          Toggle Marketplace permission reverts that permission.
        </span>
        <span>{marketplacePermission}</span>
      </div>

      <div className="module_container">
        <div className="input_container">
          <input
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Address"
          />
          <button onClick={() => toggleMarketplaceAddress(address)}>
            Toggle Marketplace Address
          </button>
        </div>
        <span className="description">
          Only DEFAULT_ADMIN_ROLE can toggle marketplace address permission.
          <br></br>
          This function allows a specific address to serve as a marketplace.
        </span>
      </div>

      <div className="module_container">
        <div className="input_container">
          <input onChange={(e) => setRole(e.target.value)} placeholder="Role" />
          <input
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Address"
          />
          <button onClick={() => grantRole(role, address)}>Grant Role</button>
        </div>
        <span className="description">
          Only DEFAULT_ADMIN_ROLE can grant roles.
          <br></br>
          This function is used to grant both DEFAULT_ADMIN_ROLE and SUBADMIN
          roles to new accounts.
        </span>
      </div>

      <div className="module_container">
        <div className="input_container">
          <input onChange={(e) => setRole(e.target.value)} placeholder="Role" />
          <input
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Address"
          />
          <button onClick={() => revokeRole(role, address)}>Revoke Role</button>
        </div>
        <span className="description">
          Only DEFAULT_ADMIN_ROLE can revoke roles.
          <br></br>
          This function is used to revoke both DEFAULT_ADMIN_ROLE and SUBADMIN
          roles.
        </span>
      </div>

      <div style={{ marginBottom: "100px" }} className="module_container">
        <div className="input_container">
          <input onChange={(e) => setRole(e.target.value)} placeholder="Role" />
          <input
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Address"
          />
          <button onClick={() => renounceRole(role, address)}>
            Renounce Role
          </button>
        </div>
        <span className="description">
          This function is used to renounce to your own role.
          <br></br>
          CAUTION: do not use with DEFAULT_ADMIN_ROLE if there's only one of
          them.
        </span>
      </div>

    </div>
  );
};

export default CarsComponent;
