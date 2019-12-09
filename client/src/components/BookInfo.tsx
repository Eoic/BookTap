import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { bookStore } from '../stores/BookStore';
import { STORE_EVENTS } from '../stores/BookStore';
import { getBookById, updateBook } from '../actions/BookActions';

export interface IBookInfoState {
    book: any,
    title: string,
    description: string,
    author: string,
    publisher: string,
    language: string,
    year: string,
}

export interface IBookInfoProps {
}

const fieldKeys: string[] = [
    "title",
    "description",
    "author",
    "publisher",
    "language",
    "year"
];

export default class BookInfo extends React.Component<RouteComponentProps<{}> & IBookInfoProps, IBookInfoState> {
    constructor(props: RouteComponentProps<{}> & IBookInfoProps) {
        const cachedBook: any = bookStore.getBookById();
        console.log(cachedBook);
        super(props);

        this.state = {
            book: cachedBook,
            title: cachedBook.title || "",
            description: cachedBook.description || "",
            author: cachedBook.author || "",
            publisher: cachedBook.publisher || "",
            language: cachedBook.language || "",
            year: cachedBook.year || "",
        }

        this.updateBookInfo = this.updateBookInfo.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    updateBookInfo() {
        const book: any = bookStore.getBookById();

        const {
            title,
            description,
            author,
            publisher,
            language,
            year
        } = book;

        this.setState({
            book,
            title,
            description,
            author,
            publisher,
            language,
            year
        });
    }

    componentDidMount() {
        bookStore.on(STORE_EVENTS.UPDATED_BY_ID, this.updateBookInfo);
        getBookById((this.props.match.params as any).id);
    }

    componentWillUnmount() {
        bookStore.removeListener(STORE_EVENTS.UPDATED_BY_ID, this.updateBookInfo);
    }

    handleChange(event: any) {
        if (Object.keys(this.state).includes(event.target.name)) {
            this.setState({ [event.target.name]: event.target.value } as Pick<IBookInfoState, keyof IBookInfoState>);
        }
    }

    handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const id = (this.props.match.params as any).id
        const values: any = {}

        values["id"] = id;

        fieldKeys.forEach((key) => {
            values[key] = (this.state as any)[key];
        });

        updateBook(values);
    }

    public render() {
        return (
            <div style={{ padding: 10 }} className="book-info-grid">
                <img className="book-cover" src={`data:image/png;base64,${this.state.book.cover}`} />
                <form id="book-info" className="form" style={{ padding: 0, border: 0, margin: "unset", backgroundColor: "unset" }} onSubmit={this.handleSubmit}>
                    {fieldKeys.map((key, index) => (
                        <div className="form-input" key={index} >
                            <label style={{ float: "left", width: 100 }}> {key.substr(0, 1).toUpperCase() + key.substring(1)} </label>
                            {(key === "description") ?
                                <textarea value={(this.state as any)[key]} name={key} onChange={this.handleChange} /> :
                                <input type="text" value={(this.state as any)[key]} name={key} onChange={this.handleChange} />
                            }
                        </div>
                    ))}
                    <div className="form-input">
                        <label style={{ float: "left", width: 100 }} className="hide-on-collapse"> &nbsp; </label>
                        <button form="book-info" className="btn btn-green fonr-medium"> Save changes </button>
                    </div>
                </form>
            </div>
        );
    }
}
