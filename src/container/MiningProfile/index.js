import React, { Component } from 'react'
import { connect } from 'react-redux'
import Loader from 'react-loader'
import {
	Button,
	Table,
} from 'react-bootstrap'
import query from '../../common/Query';
import axios from 'axios';

const products = [];


class MiningProfile extends Component {
	constructor(props, context) {
		super(props, context);

		this.state = {
			smShow: false,
			lgShow: false,
			data: []
		};
	}


	componentWillMount() {
		// this.addProducts(100);
		this.getData()
	}

	
	renderShowsTotal(start, to, total) {
		return (
			<p style={{ color: 'blue' }}>
				From {start} to {to}, totals is {total}&nbsp;&nbsp;(its a customize text)
			</p>
		);
	}
	handlePageChange = (pageNumber) => {
		// console.log(`active page is ${pageNumber}`);
		this.setState({ activePage: pageNumber })
	}

	renderShowsTotal(start, to, total) {
		return (
			<p className="btn-pagination">
				From {start} to {to}, totals is {total}&nbsp;&nbsp;(its a customize text)
			</p>
		);
	}

// API call 
getData = () => {
	var token = localStorage.getItem('token')
	// console.log('token dashboard', token)
	// axios.get('https://dev.boltos.io:3000/api/v1/users/mining-profiles', {
	axios.get('http://localhost:3000/api/v1/users/mining-profiles', {
		headers: {
			'Authorization': 'Bearer ' + token,
		}
	})
		.then(res => {
			if (res.status == 200) {
				this.setState({ data: res.data.data })
			} 
			else {
				this.props.history.push('/');
			}
			console.log('res mining-profile =>', res.data)
			// this.addProducts(res.data.data.length, res.data.data)
		})
}

deleteProfile = (mc_id) => {
	var r = confirm("Do you want to delete this profile?");
	if(!r) {
		return;
	}

	var token = localStorage.getItem('token');
	var postData = {
		mc_id : mc_id
	};
	axios.post('http://localhost:3000/api/v1/users/delete-mining-profile',postData, {
			headers: {
				'Authorization': 'Bearer ' + token,
			}
		})
		.then(res => {
			// console.log(res);
			// this.props.history.push('/home/miningprofile');
			this.getData();
		})
}

addPool = () =>{
	this.props.history.push('/home/add');
}

	render() {
		// const { profile } = this.state

		const { data } = this.state

		

		return (
			<div className="mining">
				<Loader loaded={true} color="white" />
				<p className="title-page">Mining Server Dashboard</p>
				<p className="gray-box">Mining Profiles</p>
				<div className="general-table">
					<Table striped condensed hover>
						<thead>
							<tr>
								<th>Mining Profile</th>
								<th>Profile Type</th>
								<th>Mining Pool(s)</th>
								<th>Switching Interval</th>
								<th>Actions</th>
							</tr>
						</thead>
						<tbody>
							{
							data.map((item, i) =>
									<tr key={i}>
								<td>{item.profile}</td>
								<td>
									{item.type == 1 ? 'SinglePool': null}
									{item.type == 2 ? 'MultiPool': null}
									{item.type == 3 ? 'Profitability Pool': null}
								</td>
								<td>{item.pools}</td>
								<td>{item.switchingIntervals}</td>
								<td>
									<Button className="black-btn" onClick={() => this.props.history.push('/home/edit/' + item.mc_id)}>Edit</Button>
									<Button className="red-btn" onClick={() => {this.deleteProfile(item.mc_id)}}>Delete</Button>
								</td>
							</tr>
							
							)

						}

						
						</tbody>
					</Table>
					<Button className="green-btn" onClick={()=>this.addPool()}>Add Profile</Button>
					<div className="pagination-box">
						<Button className="btn-pagination">Showing 2 to 2 of 2 entries</Button>
						<nav className="page-box" aria-label="Page navigation example">
							<ul className="pagination justify-content-end">
								<li className="page-item disabled">
									<a className="page-link" href="#">Previous</a>
								</li>
								<li className="page-item"><a className="page-link" href="#">1</a></li>
								<li className="page-item disabled">
									<a className="page-link" href="#">Next</a>
								</li>
							</ul>
						</nav>
					</div>
				</div>
			</div >
		)
	}
	
}
const mapStateToProps = state => ({
	session: state.session
});

export default connect(mapStateToProps)(MiningProfile)
