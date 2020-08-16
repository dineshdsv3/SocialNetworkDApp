import React, { Component } from 'react';
import logo from '../logo.png';
import './App.css';
import Web3 from 'web3';
import Fortmatic from 'fortmatic';
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

	async componentDidMount() {
		await this.loadWeb3();
		await this.loadBlockchainData();
	}

	async loadWeb3() {
		let fm = new Fortmatic('pk_test_097457B513F0A02C', 'ropsten');
		window.web3 = new Web3(fm.getProvider());
		console.log(fm.getProvider().isFortmatic)
		console.log(window.web3.currentProvider.isFortmatic )
		if (window.ethereum) {
			// Use MetaMask provider
			window.web3 = new Web3(window.ethereum);
		  } else {
			// Use Fortmatic provider
			window.web3 = new Web3(fm.getProvider());
			console.log(fm.getProvider().isFortmatic)
		  }
	}

	async loadBlockchainData() {
		const web3 = window.web3;
		console.log(web3);
		const accounts = await web3.eth.getAccounts();
		console.log(accounts);
		this.setState({ account: accounts[0] });
		const networkId = await web3.eth.net.getId();
		console.log(networkId);
		const networkData = SocialNetwork.networks[networkId];
		console.log(networkData)
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
			this.setState({ posts: this.state.posts.sort((a, b) => b.tipAmount - a.tipAmount) });
		}
	}

	createPost(content) {
		this.setState({ loading: true });
		this.state.socialNetwork.methods
			.createPost(content)
			.send({ from: this.state.account })
			.once('receipt', (receipt) => {
				this.setState({ loading: false });
			});
	}

	tipPost(id, tipAmount) {
		this.state.socialNetwork.methods.tipPost(id).send({ from: this.state.account, value: tipAmount });
	}

	render() {
		return (
			<div>
				<Navbar account={this.state.account} />
				<div className="container-fluid mt-5">
					<form
						onSubmit={(event) => {
							event.preventDefault();
							const content = this.postContent.value;
							this.createPost(content);
						}}
					>
						<div className="form-group mr-sm-2">
							<input
								id="postContent"
								type="text"
								ref={(input) => {
									this.postContent = input;
								}}
								className="form-control"
								placeholder="What's on your mind?"
								required
							/>
						</div>
						<button type="submit" className="btn btn-primary btn-block">
							Share
						</button>
					</form>
				</div>
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
														{window.web3.utils.fromWei(
															post.tipAmount.toString(),
															'Ether'
														)}{' '}
														ETH
													</small>
													<button
														className="btn btn-link btn-sm float-right pt-0"
														name={post.id}
														onClick={(event) => {
															let tipAmount = window.web3.utils.toWei('0.1', 'Ether');
															this.tipPost(event.target.name, tipAmount);
														}}
													>
														TIP 0.1 ETH
													</button>
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
