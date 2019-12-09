import * as React from 'react';
import { RouteComponentProps } from "react-router-dom";
import { shelfStore, STORE_EVENTS as SHELF_STORE_EVENTS } from "../stores/ShelfStore";
import { getShelfById, deleteShelf } from "../actions/ShelfActions";
import Book from './Book';
import uuid from 'uuid';
import Stepper from './Stepper';
import { openConfirmation } from '../actions/AppActions';
import EditableField from './EditableField';
import { bookStore, STORE_EVENTS as BOOK_STORE_EVENTS } from '../stores/BookStore';

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
		this.updateBookList = this.updateBookList.bind(this);
		this.requestBookList = this.requestBookList.bind(this);
	}

	handleUpdate() {
		const { title, description, books } = shelfStore.getShelfById();
		this.setState({ title, description, books });
	}

	componentDidMount() {
		shelfStore.on(SHELF_STORE_EVENTS.UPDATED_BY_ID, this.handleUpdate);
		bookStore.on(BOOK_STORE_EVENTS.UPDATED, this.updateBookList);
		bookStore.on(BOOK_STORE_EVENTS.UPDATE_REQUIRED, this.requestBookList);
		getShelfById((this.props.match.params as any).id);
	}

	componentWillUnmount() {
		shelfStore.removeListener(SHELF_STORE_EVENTS.UPDATED_BY_ID, this.handleUpdate);
		bookStore.removeListener(BOOK_STORE_EVENTS.UPDATED, this.updateBookList);
		bookStore.removeListener(BOOK_STORE_EVENTS.UPDATE_REQUIRED, this.requestBookList);
	}

	updateBookList() {
		this.setState({ books: shelfStore.getShelfById().books });
	}

	requestBookList() {
		getShelfById((this.props.match.params as any).id);
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
						openConfirmation(`Delete shelf "${this.state.title}"?`,
							"Books assigned to this shelf will not be deleted.", () => {
								deleteShelf(this.state.id);
								this.props.history.push("/library/unshelved");
							})}>
					<i className="fas fa-trash icon-fixed-width" />
				</button>
				<hr className="divider" />

				<EditableField text={this.state.title} tag="h3" name="title" />
				<EditableField text={this.state.description || "No description"} tag="p" name="description" />

				<hr className="divider" />
				<section className={`${(this.state.books.length > 0) ? "grid-list" : ""}`}>
					{this.state.books.map((book: any) => (
						<Book key={uuid()} book={book} />
					))}
					{this.state.books.length === 0 && <div style={{ textAlign: "center", width: "100%" }}>
						<i className="far fa-folder-open fa-5x color-gray" />
						<h4 className="color-gray"> This shelf has no books yet... </h4>
					</div>}
				</section>
				<hr />
				<Stepper size={50} />
			</section>
		);
	}
}
