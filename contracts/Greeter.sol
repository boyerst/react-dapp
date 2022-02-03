//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Greeter {

    // private state variable, that is a string
    string private greeting;

    // Constructor that gets executed when smart contract is created
    constructor(string memory _greeting) {
        // We pass in _greeting, refering to the constructor code that we passed in in our deploy script 
        // So the contract will deploy with an initial value of _greeting
        console.log("Deploying a Greeter with greeting:", _greeting);
        greeting = _greeting;
    }

    // Exposes function greet that returns the greeting
    // Reads the value of greeting
      // Public = can be read from outside smart contract, ie our front end
    function greet() public view returns (string memory) {
        return greeting;
    }

    // User can update the greeting
    // Writes the value of greeting
    // Notice this function doesnt return anything but it DOES pass in an argument
    // We update the value of greeting in state with the _greeting that we pass in
    function setGreeting(string memory _greeting) public {
        console.log("Changing greeting from '%s' to '%s'", greeting, _greeting);
        greeting = _greeting;
    }
}
