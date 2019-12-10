import * as React from 'react';
import { bookStore, STORE_EVENTS } from '../stores/BookStore';
import { getBooksUnshelved } from '../actions/BookActions';
import Book from './Book';
import uuid from 'uuid';
import Stepper from './Stepper';

export interface IUnshelvedProps {
}

export interface IUnshelvedState {
	books: [],
}

export default class Unshelved extends React.Component<IUnshelvedProps, IUnshelvedState> {
	constructor(props: IUnshelvedProps) {
		super(props);

		this.state = {
			books: bookStore.getBooksUnshelved(),
		}

		this.updateBookList = this.updateBookList.bind(this);
		this.requestBookList = this.requestBookList.bind(this);
	}

	updateBookList() {
		this.setState({ books: bookStore.getBooksUnshelved() });
	}

	requestBookList() {
		getBooksUnshelved();
	}

	componentDidMount() {
		bookStore.on(STORE_EVENTS.UPDATED, this.updateBookList);
		bookStore.on(STORE_EVENTS.UPDATE_REQUIRED, this.requestBookList);
		getBooksUnshelved();
	}

	componentWillUnmount() {
		bookStore.removeListener(STORE_EVENTS.UPDATED, this.updateBookList);
		bookStore.removeListener(STORE_EVENTS.UPDATE_REQUIRED, this.requestBookList);
	}

	public render() {
		return (
			<>
				<h1 style={{ color: "#434343" }}> Unshelved books </h1>
				<hr className="divider" />
				<section className={`${(this.state.books.length > 0) ? "grid-list" : ""}`}>
					{this.state.books.map((book: any) => (
						<Book key={uuid()} book={book} />
					))}
					{this.state.books.length === 0 && <div style={{ textAlign: "center", width: "100%" }}>
						<i className="far fa-folder-open fa-5x color-gray" />
						<h4 className="color-gray"> No books are unshelved </h4>
					</div>}
				</section>
				<hr className="divider" />
				<Stepper size={50} />
			</>
		);
	}
}
