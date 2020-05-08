import React, { Component } from 'react';
import logo from '../logo.png';
import './App.css';
import Web3 from 'web3';
import Navbar from './Navbar';
import SocialNetwork from '../abis/SocialNetwork.json';
import Identicon from 'identicon.js';

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
			console.log(this.state.postCount);
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
					<div className="row">
						<main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '500px' }}>
							<div className="content mr-auto ml-auto">
								{this.state.posts.map((post, key) => {
									return (
										<div className="card mb-4" key={key}>
											<div className="card-header">
												<img
													className="mr-2"
													width="30"
													height="30"
													src={`data:image/png;base64,${new Identicon(
														post.author,
														30
													).toString()}`}
												/>
												<small className="text-muted">{post.author}</small>
											</div>
											<ul id="postList" className="list-group list-group-flush">
												<li className="list-group-item">
													<p>{post.content}</p>
												</li>
												<li key={key} className="list-group-item py-2">
													<small className="float-left mt-1 text-muted">
														TIPS:
														{window.web3.utils.fromWei(post.tipAmount.toString(), 'Ether')}{' '}
														ETH
													</small>
													<button className="btn btn-link btn-sm float-right pt-0">TIP 0.1 ETH</button>
												</li>
											</ul>
										</div>
									);
								})}
							</div>
						</main>
					</div>
				</div>
			</div>
		);
	}
}

export default App;
