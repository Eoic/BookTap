import * as React from 'react';
import Modal from './Modal';
import { topicStore, STORE_EVENTS } from "../stores/TopicStore";
import { getTopics, addTopic } from "../actions/TopicActions";
import { Link } from 'react-router-dom';

export interface ITopicsProps {
}

export interface ITopicsState {
	title: string,
	description: string,
	topics: [],
}

export default class Topics extends React.Component<ITopicsProps, ITopicsState> {
	constructor(props: ITopicsProps) {
		super(props);
		this.state = {
			title: "",
			description: "",
			topics: topicStore.getTopics(),
		}
		this.createMockTable = this.createMockTable.bind(this);
		this.updateTopics = this.updateTopics.bind(this);
		this.fetchTopics = this.fetchTopics.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	updateTopics() {
		this.setState({ topics: topicStore.getTopics() });
	}

	fetchTopics() {
		getTopics();
	}

	componentDidMount() {
		topicStore.on(STORE_EVENTS.UPDATED, this.updateTopics);
		topicStore.on(STORE_EVENTS.UPDATE_REQUIRED, this.fetchTopics);
		getTopics();
	}

	componentWillUnmount() {
		topicStore.removeListener(STORE_EVENTS.UPDATED, this.updateTopics);
		topicStore.removeListener(STORE_EVENTS.UPDATE_REQUIRED, this.fetchTopics);
	}

	handleChange(event: any) {
		if (Object.keys(this.state).includes(event.target.name)) {
			this.setState({ [event.target.name]: event.target.value } as Pick<ITopicsState, keyof ITopicsState>);
		}
	}

	handleSubmit(event: React.FormEvent) {
		event.preventDefault();
		addTopic({
			title: this.state.title,
			description: this.state.description
		});
	}

	createMockTable(count: number) {
		var rows = [];

		for (var i = 0; i < count; i++) {
			rows.push(<tr>
				<th> <input type="checkbox" /></th>
				<td> <a className="topic" href="#"> Some title </a> </td>
				<td> Some very long description aboout title </td>
				<th> 2 </th>
				<th> {i} </th>
				<th> {new Date().toLocaleDateString("lt-LT")} </th>
			</tr>)
		}

		return rows;
	}

	public render() {
		return (
			<section>
				<Modal trigger={{ style: "btn btn-green font-medium", icon: "plus", text: "ADD TOPIC" }}
					action={<button className="btn btn-blue font-medium" type="submit" onClick={this.handleSubmit} form="add-shelf-form"> CREATE </button>}
					closeOnAction={false}
					onCloseEvent={() => (this.setState({ title: "", description: "" }))}
					title={"CREATE TOPIC"}>
					<form id="add-shelf-form">
						<input className="input" required type="text" placeholder="Title" name="title" onChange={this.handleChange} value={this.state.title} />
						<textarea className="input" placeholder="Description" name="description" onChange={this.handleChange} value={this.state.description} />
					</form>
					<hr />
				</Modal>
				<hr />
				<section>
					<table className="table">
						<thead>
							<tr>
								<th style={{ width: 30 }}> </th>
								<th> TITLE </th>
								<th> DESCRIPTION </th>
								<th> SHELVES </th>
								<th> BOOKS </th>
								<th> CREATED </th>
							</tr>
						</thead>
						<tbody>
							{/*this.createMockTable(15).map((row) => row)*/}
							{this.state.topics.map((topic: any, index) => (
								<tr key={index}>
									<td>
										<input type="checkbox" />
									</td>
									<td><Link to={`/library/topic/${topic.id}`} className="topic">{topic.title} </Link></td>
									<td>{topic.description}</td>
									<td> 0 </td>
									<td> 0 </td>
									<td> {topic.createdAt}</td>
								</tr>
							))}
						</tbody>
					</table>
				</section>
			</section>
		);
	}
}
