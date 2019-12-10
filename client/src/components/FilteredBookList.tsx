import * as React from 'react';
import Book from './Book';
import uuid from 'uuid';
import Stepper from './Stepper';
import { bookStore, STORE_EVENTS } from '../stores/BookStore';
import { RouteComponentProps } from 'react-router-dom';
import { getBooks } from '../actions/BookActions';

export interface IFilteredBookListProps {
	readingStatusFilter: number,
	emptyListMessage: string,
	title: string,
}

export interface IFilteredBookListState {
	books: any[],
}

const filter = (books: [], status: number): any[] => {
	return books.filter((book: any) => book.status === status);
}

export default class FilteredBookList extends React.Component<RouteComponentProps<{}> & IFilteredBookListProps, IFilteredBookListState> {
	constructor(props: RouteComponentProps<{}> & IFilteredBookListProps) {
		super(props);

		this.state = {
			books: filter(bookStore.getBooks(), this.props.readingStatusFilter),
		}

		this.updateBookList = this.updateBookList.bind(this);
		this.requestUpdate = this.requestUpdate.bind(this);
	}

	updateBookList() {
		this.setState({
			books: filter(bookStore.getBooks(), this.props.readingStatusFilter),
		});
	}

	requestUpdate() {
		getBooks();
	}

	componentDidMount() {
		bookStore.on(STORE_EVENTS.UPDATED, this.updateBookList);
		bookStore.on(STORE_EVENTS.UPDATE_REQUIRED, this.requestUpdate);
		getBooks();
	}

	componentWillUnmount() {
		bookStore.removeListener(STORE_EVENTS.UPDATED, this.updateBookList);
		bookStore.removeListener(STORE_EVENTS.UPDATE_REQUIRED, this.requestUpdate);
	}

	public render() {
		return (
			<>
				<h1> {this.props.title} </h1>
				<hr className="divider" />
				<section className={`${(this.state.books.length > 0) ? "grid-list" : ""}`}>
					{this.state.books.map((book: any) => (
						<Book key={uuid()} book={book} />
					))}
					{this.state.books.length === 0 && <div style={{ textAlign: "center", width: "100%" }}>
						<i className="far fa-folder-open fa-5x color-gray" />
						<h4 className="color-gray"> {this.props.emptyListMessage}  </h4>
					</div>}
				</section>
				<hr className="divider" />
				<Stepper size={50} />
			</>
		);
	}
}
