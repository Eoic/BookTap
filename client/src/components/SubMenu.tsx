import * as React from 'react';
import { deleteBook, readBook, downloadBook, openShelfAdder, openStatusSelector } from "../actions/BookActions";
import { Link } from 'react-router-dom';
import { openConfirmation } from '../actions/AppActions';

export interface ISubMenuProps {
    id: number,
    shelfId: number,
    isOpen: boolean,
    title: string,
    filename: string,
    status: number,
    hideMenu: () => void,
    setMenuHoverState: (isMenuHovered: boolean) => void,
}

export default class SubMenu extends React.Component<ISubMenuProps> {
    constructor(props: ISubMenuProps) {
        super(props);
        this.assignShelf = this.assignShelf.bind(this);
        this.deleteBook = this.deleteBook.bind(this);
    }

    assignShelf() {
        openShelfAdder(this.props.id, this.props.shelfId);
        this.props.hideMenu();
    }

    deleteBook() {
        openConfirmation("Are you sure?", `You are about to delete book "${this.props.title}".`, () => {
            deleteBook(this.props.id);
        });
        this.props.hideMenu();
    }

    public render() {
        return (
            <div className={`${(this.props.isOpen) ? "visible" : "hidden"} sub-menu`} onMouseEnter={() => this.props.setMenuHoverState(true)} onMouseLeave={() => this.props.setMenuHoverState(false)} >
                <button onClick={() => { readBook(this.props.id); this.props.hideMenu() }}> Read </button>
                <button onClick={this.deleteBook}> Delete </button>
                <Link to={`/library/all-books/${this.props.id}`}>
                    <button className="sub-menu-item"> View info </button>
                </Link>
                <button onClick={() => { downloadBook(this.props.id, this.props.filename); this.props.hideMenu() }}> Download </button>
                <button onClick={() => { this.assignShelf() }}> Add to shelf </button>
                <button onClick={() => { openStatusSelector({ id: this.props.id, title: this.props.title, status: this.props.status }); this.props.hideMenu() }}> Set status </button>
            </div>
        );
    }
}
