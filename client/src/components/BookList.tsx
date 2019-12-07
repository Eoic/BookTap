import * as React from 'react';
import BookFilter from './BookFilter';
import UploadModal from './UploadModal';
import Stepper from './Stepper';
import Book from './Book';
import { bookStore, STORE_EVENTS } from "../stores/BookStore";
import { getBooks } from "../actions/BookActions";
import uuid from 'uuid/v4';

export interface IBookListProps {
}

export interface IBookListState {
	books: [],
}

export default class BookList extends React.Component<IBookListProps, IBookListState> {
	constructor(props: IBookListProps) {
		super(props);
		this.state = { books: bookStore.getBooks() }
		this.updateBookList = this.updateBookList.bind(this);
		this.handleUpdateRequired = this.handleUpdateRequired.bind(this);
	}

	updateBookList() {
		this.setState({ books: bookStore.getBooks() });
	}

	handleUpdateRequired() {
		getBooks();
	}

	componentDidMount() {
		bookStore.on(STORE_EVENTS.UPDATED, this.updateBookList);
		bookStore.on(STORE_EVENTS.UPDATE_REQUIRED, this.handleUpdateRequired);
		getBooks();
	}

	componentWillUnmount() {
		bookStore.removeListener(STORE_EVENTS.UPDATED, this.updateBookList);
		bookStore.removeListener(STORE_EVENTS.UPDATE_REQUIRED, this.handleUpdateRequired);
	}

	public render() {
		return (
			<>
				<UploadModal />
				<BookFilter />
				<section className={`${(this.state.books.length > 0) ? "grid-list" : ""}`}>
					{this.state.books.map((book: any) => (
						<Book key={uuid()} book={book} />
					))}
					{this.state.books.length === 0 && <div style={{ textAlign: "center", width: "100%" }}>
						<i className="far fa-folder-open fa-5x color-gray" />
						<h4 className="color-gray"> No books uploaded yet... </h4>
					</div>}
				</section>
				<hr />
				<Stepper size={50} />
			</>
		);
	}
}
