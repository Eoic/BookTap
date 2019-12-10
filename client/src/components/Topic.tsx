import * as React from 'react';
import { Link } from 'react-router-dom';
import { openConfirmation } from '../actions/AppActions';
import { deleteTopic } from "../actions/TopicActions";

export interface ITopicProps {
	topic: any,
	editHandler: (id: number, title: string, description: string) => void,
}

export interface ITopicState {
	title: string,
	description: string,
}

export default class Topic extends React.Component<ITopicProps, ITopicState> {
	constructor(props: ITopicProps) {
		super(props);
		this.handleDelete = this.handleDelete.bind(this);
	}

	handleDelete() {
		openConfirmation(`Delete topic "${this.props.topic.title}"?`, "Shelves assigned to this topic will not be deleted", () => {
			deleteTopic(this.props.topic.id, this.props.topic.title);
		});
	}

	public render() {
		const { id, title, description, createdAt } = this.props.topic;

		return (
			<tr>
				<td><Link to={`/library/topic/${id}`} className="topic">{title} </Link></td>
				<td>{description || "No description"}</td>
				<td> 0 </td>
				<td> 0 </td>
				<td> {new Date(createdAt).toLocaleString()}</td>
				<td>
					<button className="btn btn-gray" onClick={() => { this.props.editHandler(this.props.topic.id, this.props.topic.title, this.props.topic.description) }}>
						<i className="fas fa-pen color-green" />
					</button>

					<button className="btn btn-gray" onClick={this.handleDelete}>
						<i className="fas fa-trash color-red" />
					</button>
				</td>
			</tr>
		);
	}
}
