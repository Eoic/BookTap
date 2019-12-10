import * as React from 'react';
import { ISubMenuProps } from './SubMenu';
import { getUsers, deleteUser, changeRole, createUser } from '../actions/UserActions';
import { userStore, STORE_EVENTS } from '../stores/UserStore';
import uuid from 'uuid';
import Stepper from './Stepper';
import { openConfirmation } from '../actions/AppActions';
import ModalMinimal from './ModalMinimal';
import WithAuth from '../hoc/WithAuth';
import { UserType } from '../utilities/UserType';
import ErrorList from './ErrorList';

export interface IUsersProps {
}

export interface IUsersState {
	users: [],
	editModalOpen: boolean,
	createModalOpen: boolean,
	currentTypeValue: number,
	selectedUser: number,
	username: string,
	email: string,
	password: string,
	passwordRepeat: string,
	errors: [],
}

class Users extends React.Component<IUsersProps, IUsersState> {
	constructor(props: ISubMenuProps) {
		super(props);

		this.state = {
			users: userStore.getUsers(),
			editModalOpen: false,
			createModalOpen: false,
			currentTypeValue: 0,
			selectedUser: -1,
			username: "",
			password: "",
			passwordRepeat: "",
			email: "",
			errors: [],
		}

		this.handleCreationChange = this.handleCreationChange.bind(this);
		this.handleCreationSubmit = this.handleCreationSubmit.bind(this);
		this.updateUsersList = this.updateUsersList.bind(this);
		this.requestUpdate = this.requestUpdate.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleDelete = this.handleDelete.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleEdit = this.handleEdit.bind(this);
		this.handleFail = this.handleFail.bind(this);
		this.handleSuccess = this.handleSuccess.bind(this);
		this.resetCreationForm = this.resetCreationForm.bind(this);
	}

	handleFail() {
		this.setState({ errors: userStore.getErrors() });
	}

	handleSuccess() {
		this.setState({
			username: "",
			email: "",
			password: "",
			passwordRepeat: "",
			createModalOpen: false,
		});
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
		userStore.on(STORE_EVENTS.OP_SUCCESS, this.handleSuccess);
		userStore.on(STORE_EVENTS.OP_FAIL, this.handleFail);
		getUsers();
	}

	componentWillUnmount() {
		userStore.removeListener(STORE_EVENTS.UPDATED, this.updateUsersList);
		userStore.removeListener(STORE_EVENTS.UPDATE_REQUIRED, this.requestUpdate);
		userStore.removeListener(STORE_EVENTS.OP_SUCCESS, this.handleSuccess);
		userStore.removeListener(STORE_EVENTS.OP_FAIL, this.handleFail);
	}

	handleDelete(id: number, username: string) {
		openConfirmation("Are you sure?", `Delete user "${username}"?`, () => {
			deleteUser(id, username);
		});
	}

	handleSubmit() {
		changeRole(this.state.selectedUser, this.state.currentTypeValue);
		this.setState({ selectedUser: -1, currentTypeValue: 0, editModalOpen: false })
	}

	handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
		const value: any = event.target.value;
		this.setState({ currentTypeValue: value });
	}

	handleCreationChange(event: any) {
		if (Object.keys(this.state).includes(event.target.name)) {
			this.setState({ [event.target.name]: event.target.value } as Pick<IUsersState, keyof IUsersState>);
		}
	}

	handleEdit(id: number, type: number) {
		this.setState({
			selectedUser: id,
			currentTypeValue: type,
			editModalOpen: true,
		});
	}

	handleCreationSubmit(event: React.FormEvent) {
		event.preventDefault();;
		const { username, password, passwordRepeat, email } = this.state;
		createUser({ username, password, passwordRepeat, email });
		this.resetCreationForm();
	}

	resetCreationForm() {
		this.setState({
			errors: [],
			username: "",
			password: "",
			passwordRepeat: "",
			email: "",
		})
	}

	public render() {
		return (
			<section className="padding-from-nav table-section">
				<h1> Users </h1>
				<hr className="divider" />
				<ModalMinimal isOpen={this.state.createModalOpen}
					size={"medium"}
					open={() => this.setState({ createModalOpen: true })}
					close={() => { this.setState({ createModalOpen: false }); this.resetCreationForm() }}
					action={<button type="submit" form="create-user" className="btn btn-green font-medium"> ADD </button>}
					title="ADD USER"
					trigger={{ style: "btn btn-green font-medium", text: "ADD NEW USER", icon: "plus" }}
				>
					{this.state.errors.length > 0 && <ErrorList errors={this.state.errors} />}
					<form className="form" id="create-user" onSubmit={this.handleCreationSubmit}>
						<div className="form-input-inline">
							<label> Username </label>
							<input required type="text" name="username" onChange={this.handleCreationChange} value={this.state.username} />
						</div>
						<div className="form-input-inline">
							<label> Email </label>
							<input required type="email" name="email" onChange={this.handleCreationChange} value={this.state.email} />
						</div>
						<div className="form-input-inline">
							<label> Password </label>
							<input required type="password" name="password" onChange={this.handleCreationChange} value={this.state.password} />
						</div>
						<div className="form-input-inline">
							<label> Repeat password </label>
							<input required type="password" name="passwordRepeat" onChange={this.handleCreationChange} value={this.state.passwordRepeat} />
						</div>
						<div className="form-input-inline">
							<label> User type </label>
							<select style={{ display: "block" }} value={this.state.currentTypeValue} onChange={this.handleChange} className="dropdown">
								<option value={0}> Client </option>
								<option value={1}> Admin </option>
							</select>
						</div>
					</form>
				</ModalMinimal>
				<hr />
				<table className="table">
					<thead>
						<tr>
							<th> TYPE </th>
							<th> USERNAME </th>
							<th> EMAIL </th>
							<th> CREATED AT </th>
							<th> UPDATED AT </th>
							<th style={{ width: 70, textAlign: "center" }}> Actions </th>
						</tr>
					</thead>
					<tbody>
						{this.state.users.map((user: any) => (
							<tr key={uuid()}>
								<td style={{ width: 60 }}>
									<span className={`badge-${user.userType == 0 ? "green" : "blue"}`}>
										{user.userType == 0 ? "User" : "Admin"}
									</span>
								</td>
								<td> {user.username} </td>
								<td> {user.email} </td>
								<td> {new Date(user.createdAt).toLocaleString()}</td>
								<td> {new Date(user.updatedAt).toLocaleString()}</td>
								<td>
									<button className="btn btn-gray" onClick={() => this.handleEdit(user.id, user.userType)}>
										<i className="fas fa-pen color-green" />
									</button>

									<button className="btn btn-gray" onClick={() => this.handleDelete(user.id, user.username)}>
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
				<hr className="divider" />
				<Stepper size={10} />

				<ModalMinimal isOpen={this.state.editModalOpen}
					open={() => this.setState({ editModalOpen: true })}
					close={() => this.setState({ editModalOpen: false })}
					title={"Edit user"}
					action={<button className="btn btn-green" onClick={this.handleSubmit}> Save </button>}>
					<form onSubmit={this.handleSubmit}>
						<label> User type </label>
						<select className="dropdown" value={this.state.currentTypeValue} onChange={this.handleChange}>
							<option value={0}> Client </option>
							<option value={1}> Admin </option>
						</select>
					</form>
				</ModalMinimal>
			</section>
		);
	}
}

export default WithAuth(Users, UserType.Admin);