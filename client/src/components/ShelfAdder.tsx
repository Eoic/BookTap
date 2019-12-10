import * as React from 'react';
import { bookStore, STORE_EVENTS as BOOK_STORE_EVENTS } from "../stores/BookStore";
import { shelfStore, STORE_EVENTS as SHELF_STORE_EVENTS } from '../stores/ShelfStore';
import { getShelves } from '../actions/ShelfActions';
import { addToShelf } from "../actions/BookActions";

export interface IShelfAdderProps {
}

export interface IShelfAdderState {
    isOpen: boolean,
    shelves: [],
    shelfId: number,
    bookId: number,
}

export default class ShelfAdder extends React.Component<IShelfAdderProps, IShelfAdderState> {
    constructor(props: IShelfAdderProps) {
        super(props);

        this.state = {
            isOpen: false,
            shelves: [],
            shelfId: -1,
            bookId: -1,
        }

        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.updateShelfList = this.updateShelfList.bind(this);
        this.saveSelection = this.saveSelection.bind(this);
    }

    updateShelfList() {
        this.setState({ shelves: shelfStore.getShelves() });
    }

    open(idPair: any) {
        console.log(idPair);

        this.setState({
            isOpen: true,
            shelfId: idPair.shelfId,
            bookId: idPair.bookId,
        });

        getShelves();
    }

    close() {
        this.setState({ isOpen: false });
    }

    componentDidMount() {
        bookStore.on(BOOK_STORE_EVENTS.ADD_SHELF_READY, this.open);
        shelfStore.on(SHELF_STORE_EVENTS.UPDATED, this.updateShelfList);
    }

    componentWillUnmount() {
        bookStore.removeListener(BOOK_STORE_EVENTS.ADD_SHELF_READY, this.open);
        shelfStore.removeListener(SHELF_STORE_EVENTS.UPDATED, this.updateShelfList);
    }

    handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
        const value: any = event.target.value;
        this.setState({ shelfId: value });
    }

    handleSubmit() {
        addToShelf(this.state.bookId, this.state.shelfId);
    }

    saveSelection() {
        this.handleSubmit();
        this.close();
    }

    public render() {
        return (
            <>
                {
                    this.state.isOpen && <div className="modal-cover">
                        <div className="modal modal-small">
                            <div className="modal-header">
                                <h4 style={{ display: "inline", float: "left", margin: 0, paddingLeft: 15, paddingTop: 12 }}> Assign shelf </h4>
                                <button className="modal-btn" onClick={this.close}>
                                    <i className="fas fa-times" />
                                </button>
                                <div className="clearfix" />
                            </div>
                            <div className="modal-body">
                                <hr style={{ marginTop: -5 }} />
                                <label style={{ display: "block", marginBottom: 3 }} className="subtitle font-small"> Choose shelf from the list </label>
                                <select value={this.state.shelfId} className="select dropdown" name="shelfId" onChange={this.handleChange}>
                                    <option value="-1"> Unshelved </option>
                                    {this.state.shelves.map((shelf: any, index) => (
                                        <option value={shelf.id} key={index}> {shelf.title} </option>
                                    ))}
                                </select>
                                <hr />
                                <>
                                    <button className="btn btn-green font-medium" onClick={this.saveSelection}> Save </button>
                                    &nbsp;
                                    <button className="btn btn-red font-medium" onClick={this.close}> Cancel </button>
                                </>
                            </div>
                        </div>
                    </div>
                }
            </>
        );
    }
}
