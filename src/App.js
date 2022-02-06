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
  const [greeting, setGreetingValue] = useState('')

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
        // We use Web3Provider because we are already connected via MetaMask
        // Declare new ethers.providers.Web3Provider and pass in the Ethereum API using window.ethereum
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      // Create an instance of the contract
        //  new ethers.Contract( address , abi , signerOrProvider )
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, provider)
      try {
        // Using the contract instance we can call greet() from our contract and fetch the value we are reading from the blockchain
        const data = await contract.greet()
        // Print out the current value of greeting 
        console.log('data: ', data)
      } catch (err) {
        console.log("Error: ", err)
      }
    }    
  }

  // call the smart contract, send an update
  async function setGreeting() {
    // Check if they have entered a greeting so that we don't update with an empty string
    if (!greeting) return
    // If the globally available Ethereum API used to identify metamask account is NOT of data type undefined, then do these things...
    if (typeof window.ethereum !== 'undefined') {
      // Wait for the user to enable their account to be connected
      await requestAccount()
      // We create another provider
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      // Since we are writing to the blockchain we must create a transaction
        // To execute a transaction we request signature to sign the transaction
        // Using connect to JSON-RPC account syntax
      const signer = provider.getSigner()
       // Create a new instance of the contract
        //  new ethers.Contract( address , abi , signerOrProvider )
        // This time we pass in signer instead of provider because we are writing to the contract
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, signer)
      // Call contract.setGreeting and pass in the greeting variable that is local
        // ie whatever the user types into the form the update the greeting using setGreeting()
      const transaction = await contract.setGreeting(greeting)
      // Set greeting value to an empty string
      setGreetingValue('')
      // Wait for the transaction to return from the blockchain
        // Test env: will return very quickly
        // Production env: will take a little longer
      await transaction.wait()
      // Call fetchGreeting again to log out the new value
      fetchGreeting()
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        {/* When user clicks, fetchGreeting will be invoked */}
        <button onClick={fetchGreeting}>Fetch Greeting</button>
        {/* Invoke setGreeting with new input value */}
        <button onClick={setGreeting}>Set Greeting</button>
        {/*
          Event handler calls setGreetingValue which is the function from useState hooks that allows us to set state
          Where e.target.value is the value of the input/whatever is written to the UI
          We pass the event object and then specify the target of that object with .target.value
        */}
        <input 
          onChange={e => setGreetingValue(e.target.value)} 
          placeholder="Set greeting" 
          // Will update UI to empty string once greeting has been reset to an empty string
          value={greeting}
        />
      </header>
    </div>
  );
}

export default App;