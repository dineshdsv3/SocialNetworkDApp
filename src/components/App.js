import React, { Component } from 'react';
import logo from '../logo.png';
import './App.css';
import Web3 from 'web3'


class App extends Component {

  async componentWillMount() {
    await this.loadWeb3();
    await this.loadBlockchainData()
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3
    const accounts = await web3.eth.getAccounts()
    console.log(accounts)
  }

  render() {
    return (
      <div>
       <h1>Social Network DApp</h1>
      </div>
    );
  }
}

export default App;
