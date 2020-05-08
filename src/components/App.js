import React, { Component } from 'react';
import logo from '../logo.png';
import './App.css';
import Web3 from 'web3';
import Navbar from './Navbar';
import SocialNetwork from '../abis/SocialNetwork.json';

class App extends Component {
	state = {
		account: '',
		socialNetwork: null,
		postCount: 0,
		posts: [],
	};

	async componentWillMount() {
		await this.loadWeb3();
		await this.loadBlockchainData();
	}

	async loadWeb3() {
		if (window.ethereum) {
			window.web3 = new Web3(window.ethereum);
			await window.ethereum.enable();
		} else if (window.web3) {
			window.web3 = new Web3(window.web3.currentProvider);
		} else {
			window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
		}
	}

	async loadBlockchainData() {
		const web3 = window.web3;
		const accounts = await web3.eth.getAccounts();
		console.log(accounts);
		this.setState({ account: accounts[0] });
		const networkId = await web3.eth.net.getId();
		const networkData = SocialNetwork.networks[networkId];
		if (networkData) {
			const socialNetwork = web3.eth.Contract(SocialNetwork.abi, networkData.address);
			this.setState({ socialNetwork });
			const postCount = await socialNetwork.methods.postCount().call();
			this.setState({ postCount });
			console.log(this.state.postCount)
			// Load Posts
			for (var i = 1; i <= postCount; i++) {
				const post = await socialNetwork.methods.posts(i).call();
				this.setState({
					posts: [...this.state.posts, post],
				});
			}
		} else {
			window.alert('SocialNetwork contract not deployed to detected network.');
		}
	}

	render() {
		return (
			<div>
				<Navbar account={this.state.account} />
				<div className="container-fluid mt-5">
					<h1>Social Network DApp</h1>
				</div>
			</div>
		);
	}
}

export default App;
