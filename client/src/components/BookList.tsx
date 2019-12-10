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

export interface IBookListFilter {
	title: string,
	description: string,
	author: string,
	language: string,
	publisher: string,
}

export interface IBookListState extends IBookListFilter {
	books: [],
}

const filterKeys = ["title", "title", "author", "description", "publisher", "language"];

export default class BookList extends React.Component<IBookListProps, IBookListState> {
	constructor(props: IBookListProps) {
		super(props);
		this.state = {
			books: bookStore.getBooks(),
			title: "",
			author: "",
			description: "",
			publisher: "",
			language: "",
		}
		this.updateBookList = this.updateBookList.bind(this);
		this.handleUpdateRequired = this.handleUpdateRequired.bind(this);
		this.handleFilterInput = this.handleFilterInput.bind(this);
		this.filterWrapper = this.filterWrapper.bind(this);
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

	handleFilterInput(event: React.ChangeEvent<HTMLInputElement>) {
		if (Object.keys(this.state).includes(event.target.name)) {
			this.setState({ [event.target.name]: event.target.value } as Pick<IBookListFilter, keyof IBookListFilter>);
		}
	}

	filterWrapper() {
		let filteredBooks: any[] = this.state.books;

		filterKeys.forEach((key) => {
			const value = (this.state as any)[key].trim();

			if (value.length > 0) {
				filteredBooks = this.state.books.filter((book: any) => String(book[key]).toUpperCase().includes((this.state as any)[key].toUpperCase()));
			}
		});

		return filteredBooks;
	}

	public render() {
		const filtered = this.filterWrapper();

		return (
			<>
				<UploadModal />
				<BookFilter handleFilterInput={this.handleFilterInput} />
				<section className={`${(this.state.books.length > 0) ? "grid-list" : ""}`}>
					{filtered.map((book: any) => (
						<Book key={uuid()} book={book} />
					))}
				</section>
				{filtered.length === 0 && <div style={{ textAlign: "center", width: "100%" }}>
					<i className="far fa-folder-open fa-5x color-gray" />
					<h4 className="color-gray"> No books uploaded yet... </h4>
				</div>}
				<hr className="divider" />
				<Stepper size={50} />
			</>
		);
	}
}
