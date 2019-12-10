import * as React from 'react';
import ModalMinimal from './ModalMinimal';
import { bookStore, STORE_EVENTS } from '../stores/BookStore';
import { setStatus } from '../actions/BookActions';

export interface IBookStatusAdderProps {
}

export interface IBookStatusAdderState {
    isOpen: boolean,
    id: number,
    title: string,
    currentStatus: number,
}

export default class BookStatusAdder extends React.Component<IBookStatusAdderProps, IBookStatusAdderState> {
    constructor(props: IBookStatusAdderProps) {
        super(props);

        this.state = {
            isOpen: false,
            id: -1,
            title: "",
            currentStatus: 0,
        }

        this.open = this.open.bind(this);
        this.submitSelection = this.submitSelection.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    submitSelection() {
        setStatus(this.state.id, this.state.currentStatus);
        this.setState({ isOpen: false })
    }

    open() {
        const { id, title, status } = bookStore.getStatusSelectorData();
        this.setState({ isOpen: true, id, title, currentStatus: status })
    }

    componentDidMount() {
        bookStore.on(STORE_EVENTS.STATUS_SELECTOR_READY, this.open);
    }

    componentWillUnmount() {
        bookStore.removeListener(STORE_EVENTS.STATUS_SELECTOR_READY, this.open);
    }

    handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
        const value: any = event.target.value;
        this.setState({ currentStatus: value });
    }

    public render() {
        return (
            <ModalMinimal isOpen={this.state.isOpen}
                title={`Set status for "${this.state.title}"`}
                action={<button className="btn btn-green font-medium" onClick={this.submitSelection}>
                    SAVE
                </button>}
                open={() => this.setState({ isOpen: true })}
                close={() => this.setState({ isOpen: false })}>
                <label style={{ display: "block", marginBottom: 3 }} className="subtitle font-small"> Select reading status from the list </label>
                <select value={this.state.currentStatus} className="select dropdown" name="shelfId" onChange={this.handleChange}>
                    <option value={0}> Not started </option>
                    <option value={1}> In progress </option>
                    <option value={2}> Done </option>
                </select>
            </ModalMinimal>
        );
    }
}
