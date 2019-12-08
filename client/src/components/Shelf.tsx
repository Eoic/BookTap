import * as React from 'react';
import { RouteComponentProps } from "react-router-dom";
import { shelfStore, STORE_EVENTS } from "../stores/ShelfStore";
import { getShelfById, deleteShelf } from "../actions/ShelfActions";
import Book from './Book';
import uuid from 'uuid';
import Stepper from './Stepper';
import { openConfirmation } from '../actions/AppActions';
import EditableField from './EditableField';

export interface IShelfProps extends RouteComponentProps {

}

export interface IShelfState {
	id: number,
	title: string,
	description: string,
	books: [],
}

export default class Shelf extends React.Component<IShelfProps, IShelfState> {
	constructor(props: IShelfProps) {
		const { title, description } = shelfStore.getShelfById();
		super(props);
		this.state = {
			id: (this.props.match.params as any).id,
			title,
			description,
			books: [],
		}
		this.handleUpdate = this.handleUpdate.bind(this);
	}

	handleUpdate() {
		const { title, description, books } = shelfStore.getShelfById();
		this.setState({ title, description, books });
	}

	componentDidMount() {
		shelfStore.on(STORE_EVENTS.UPDATED_BY_ID, this.handleUpdate);
		getShelfById((this.props.match.params as any).id);
	}

	componentWillUnmount() {
		shelfStore.removeListener(STORE_EVENTS.UPDATED_BY_ID, this.handleUpdate);
	}

	static getDerivedStateFromProps(nextProps: IShelfProps, prevState: IShelfState) {
		const id = (nextProps.match.params as any).id;

		if ((nextProps.match.params as any).id !== prevState.id) {
			getShelfById(id);
			return { id };
		}

		return null;
	}

	public render() {
		return (
			<section>
				<button className="btn btn-green font-medium">
					<i className="fas fa-plus icon-fixed-width" />
					ADD BOOKS
				</button>
				&nbsp;
				<button className="btn btn-blue font-medium">
					<i className="fas fa-broom icon-fixed-width" />
				</button>
				&nbsp;
				<button className="btn btn-red font-medium"
					onClick={() =>
						openConfirmation(`Are you sure you want to delete shelf "${this.state.title}"?`,
							"Books assigned to this shelf will not be deleted.", () => {
								deleteShelf(this.state.id);
								this.props.history.push("/library/unshelved");
							})}>
					<i className="fas fa-trash icon-fixed-width" />
				</button>
				<hr />

				<EditableField text={this.state.title} tag="h3" name="title" />
				<EditableField text={this.state.description || "No description"} tag="p" name="description" />

				<hr />
				{this.state.books.map((book: any) => (
					<Book key={uuid()} book={book} />
				))}
				{this.state.books.length === 0 && <div style={{ textAlign: "center", width: "100%" }}>
					<i className="far fa-folder-open fa-5x color-gray" />
					<h4 className="color-gray"> This shelf has no books yet... </h4>
				</div>}
				<hr />
				<Stepper size={50} />
			</section>
		);
	}
}
