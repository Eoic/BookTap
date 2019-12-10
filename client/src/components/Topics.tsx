import * as React from 'react';
import Modal from './Modal';
import { topicStore, STORE_EVENTS } from "../stores/TopicStore";
import { getTopics, addTopic, editTopic } from "../actions/TopicActions";
import { getShelves } from "../actions/ShelfActions";
import { shelfStore, STORE_EVENTS as SHELF_STORE_EVENTS } from "../stores/ShelfStore";
import Topic from './Topic';
import uuid from 'uuid';
import ListSelector from './ListSelector';
import Stepper from './Stepper';
import { toast } from 'react-toastify';

export interface ITopicsProps {
}

export interface ITopicsState {
	title: string,
	description: string,
	topics: [],
	editing: boolean,
	creating: boolean,
	id: number,
	shelves: [],
	selectedShelves: Map<string, boolean>
}

export default class Topics extends React.Component<ITopicsProps, ITopicsState> {
	constructor(props: ITopicsProps) {
		super(props);

		this.state = {
			id: -1,
			title: "",
			description: "",
			editing: false,
			creating: false,
			topics: topicStore.getTopics(),
			shelves: shelfStore.getShelves(),
			selectedShelves: new Map<string, boolean>(),
		}

		this.createMockTable = this.createMockTable.bind(this);
		this.updateTopics = this.updateTopics.bind(this);
		this.fetchTopics = this.fetchTopics.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleEdit = this.handleEdit.bind(this);
		this.handleEditSave = this.handleEditSave.bind(this);
		this.updateShelves = this.updateShelves.bind(this);
		this.handleShelfSelection = this.handleShelfSelection.bind(this);
	}

	handleShelfSelection(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, checked } = event.target;

        this.setState(prevState => ({
            selectedShelves: prevState.selectedShelves.set(name, checked),
        }));
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
		shelfStore.on(SHELF_STORE_EVENTS.UPDATED, this.updateShelves);
		getTopics();
	}

	componentWillUnmount() {
		topicStore.removeListener(STORE_EVENTS.UPDATED, this.updateTopics);
		topicStore.removeListener(STORE_EVENTS.UPDATE_REQUIRED, this.fetchTopics);
		shelfStore.removeListener(STORE_EVENTS.UPDATED, this.updateShelves);
	}

	updateShelves() {
		const shelves = shelfStore.getShelves();
		const selectedShelves = this.state.selectedShelves;

		shelves.forEach((shelf: any) => {
			if (shelf.topic) {
				if (shelf.topic.id === this.state.id) {
					selectedShelves.set(String(shelf.id), true);
				}
			}
		});

		this.setState({ shelves, selectedShelves });
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

		this.setState({
			title: "",
			description: "",
			creating: false,
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

	handleEdit(id: number, title: string, description: string) {
		this.setState({ id, title, description, editing: true });
		getShelves();
	}

	handleEditSave() {
		if (this.state.title.trim().length > 0 && this.state.id >= 0) {
			editTopic(this.state.id, this.state.title, this.state.description, this.state.selectedShelves);
			this.setState({ editing: false, title: "", description: "", selectedShelves: new Map<string, boolean>() });
		} else {
			toast.error("Topic title cannot be empty!");
		}
	}

	public render() {
		return (
			<section>
				{/* Creating */}
				<button className="btn btn-green font-medium" onClick={() => this.setState({ creating: true })}>
					<i className="fas fa-plus icon-fixed-width" />
					ADD TOPIC
				</button>
				<Modal externalState={this.state.creating}
					action={<button className="btn btn-green font-medium" type="submit" onClick={this.handleSubmit} form="add-topic-form"> CREATE </button>}
					closeOnAction={false}
					onCloseEvent={() => (this.setState({ title: "", description: "", creating: false }))}
					title={"CREATE TOPIC"}>
					<form id="add-topic-form">
						<input className="input" required type="text" placeholder="Title" name="title" onChange={this.handleChange} value={this.state.title} />
						<textarea className="input" placeholder="Description" name="description" onChange={this.handleChange} value={this.state.description} />
					</form>
				</Modal>

				{/* Editing */}
				<Modal externalState={this.state.editing}
					action={
						<>
							<button className="btn btn-green" onClick={this.handleEditSave} type="submit" form="edit-topic-form"> Save </button>
							&nbsp;
							<button className="btn btn-red" onClick={() => this.setState({ editing: false, selectedShelves: new Map<string, boolean>() })}> Cancel </button>
						</>
					}
					title={`Edit topic`}
					onCloseEvent={() => this.setState({ editing: false })}>
					<form id="add-shelf-form">
						<input className="input" required type="text" placeholder="Title" name="title" onChange={this.handleChange} value={this.state.title} />
						<textarea className="input" placeholder="Description" name="description" onChange={this.handleChange} value={this.state.description} />
						<label className="subtitle font-small"> Select shelves to assign this topic </label>
						<ListSelector items={this.state.shelves} handleChange={this.handleShelfSelection} checkedItems={this.state.selectedShelves}  />
					</form>
				</Modal>
				<hr className="divider" />
				<section>
					<table className="table">
						<thead>
							<tr>
								<th> TITLE </th>
								<th> DESCRIPTION </th>
								<th> SHELVES </th>
								<th> BOOKS </th>
								<th> CREATED </th>
								<th style={{ width: 70, textAlign: "center" }}> Actions </th>
							</tr>
						</thead>
						<tbody>
							{this.state.topics.map((topic: any) => (
								<Topic topic={topic} key={uuid()} editHandler={this.handleEdit} />
							))}
							{this.state.topics.length === 0 && <tr>
								<td colSpan={6} style={{ textAlign: "center" }}> No topic added. </td>
							</tr>}
						</tbody>
					</table>
					<hr className="divider" />
					<Stepper size={10} />
				</section>
			</section>
		);
	}
}
