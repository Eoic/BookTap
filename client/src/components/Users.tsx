import * as React from 'react';
import { ISubMenuProps } from './SubMenu';
import { getUsers } from '../actions/UserActions';
import { userStore, STORE_EVENTS } from '../stores/UserStore';
import uuid from 'uuid';

export interface IUsersProps {
}

export interface IUsersState {
	users: [],
}

export default class Users extends React.Component<IUsersProps, IUsersState> {
	constructor(props: ISubMenuProps) {
		super(props);

		this.state = {
			users: userStore.getUsers()
		}

		this.updateUsersList = this.updateUsersList.bind(this);
		this.requestUpdate = this.requestUpdate.bind(this);
	}

	updateUsersList() {
		this.setState({
			users: userStore.getUsers(),
		})
	}

	requestUpdate() {
		getUsers();
	}

	componentDidMount() {
		userStore.on(STORE_EVENTS.UPDATED, this.updateUsersList);
		userStore.on(STORE_EVENTS.UPDATE_REQUIRED, this.requestUpdate);
		getUsers();
	}

	componentWillUnmount() {
		userStore.removeListener(STORE_EVENTS.UPDATED, this.updateUsersList);
		userStore.removeListener(STORE_EVENTS.UPDATE_REQUIRED, this.requestUpdate);
	}

	public render() {
		return (
			<section className="padding-from-nav table-section">
				<table className="table">
					<thead>
						<tr>
							<th> USERNAME </th>
							<th> EMAIL </th>
							<th> TYPE </th>
							<th> CREATED AT </th>
							<th> UPDATED AT </th>
							<th style={{ width: 70, textAlign: "center" }}> Actions </th>
						</tr>
					</thead>
					<tbody>
						{this.state.users.map((user: any) => (
							<tr key={uuid()}>
								<td> {user.username} </td>
								<td> {user.email} </td>
								<td>
									<span className={`badge-${user.userType == 0 ? "green" : "blue" }`}>
										{console.log(user.userType)}
										{user.userType == 0 ? "User" : "Admin"}
									</span>
								</td>
								<td> {new Date(user.createdAt).toLocaleString()}</td>
								<td> {new Date(user.updatedAt).toLocaleString()}</td>
								<td>
									<button className="btn btn-gray">
										<i className="fas fa-pen color-green" />
									</button>

									<button className="btn btn-gray">
										<i className="fas fa-trash color-red" />
									</button>
								</td>
							</tr>
						))}
						{this.state.users.length === 0 && <tr>
							<td colSpan={6} style={{ textAlign: "center" }}> No users added... </td>
						</tr>}
					</tbody>
				</table>
			</section>
		);
	}
}
