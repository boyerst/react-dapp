import './App.css';
import { useState } from 'react';
// Import ethers library from ethers.js
import { ethers } from 'ethers'
import Greeter from './artifacts/contracts/Greeter.sol/Greeter.json'


// Store contract address in a variable
const greeterAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"

function App() {
  // Store greeting in local state
    // We use useState hook because this is a functional component
    // Where
      // greeting = 1st element of the useState array from React is the current state
      // setGreetingValue = 2nd element of the useState array from React is a function we can use to call to set new state
  const [greeting, setGreetingValue] = useState()

  // Request access to the user's MetaMask account
  async function requestAccount() {
    // Request access using web3 wallet permissions syntax
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  }

  // Call the smart contract, read the current greeting value
  async function fetchGreeting() {
    // If the globally available Ethereum API used to identify metamask account is NOT of data type undefined, then do these things...
    if (typeof window.ethereum !== 'undefined') {
      // Create new provider using ethers
        // Declare new ethers.providers.Web3Provider and pass in the Ethereum API using window.ethereum
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      // Fetch the contract
        //  new ethers.Contract( address , abi , signerOrProvider )
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, provider)
      try {
        const data = await contract.greet()
        console.log('data: ', data)
      } catch (err) {
        console.log("Error: ", err)
      }
    }    
  }

  // call the smart contract, send an update
  async function setGreeting() {
    if (!greeting) return
    // If the globally available Ethereum API used to identify metamask account is NOT of data type undefined, then do these things...
    if (typeof window.ethereum !== 'undefined') {
      // Call requestAccount
      await requestAccount()
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      // Request signature using connect to JSON-RPC account syntax
      const signer = provider.getSigner()
       // Fetch the contract
        //  new ethers.Contract( address , abi , signerOrProvider )
        // This time we pass in signer instead of provider because we are writing to the contract
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, signer)
      // Pass in the current state❓❓❓
      const transaction = await contract.setGreeting(greeting)
      await transaction.wait()
      fetchGreeting()
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={fetchGreeting}>Fetch Greeting</button>
        <button onClick={setGreeting}>Set Greeting</button>
        {/*
          Event handler calls setGreetingValue which is the function from useState hooks that allows us to set state
          Where e.target.value is the value of the input
          We pass the event object and then specify the target of that object with .target.value
        */}
        <input onChange={e => setGreetingValue(e.target.value)} placeholder="Set greeting" />
      </header>
    </div>
  );
}

export default App;