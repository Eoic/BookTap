import * as React from 'react';
import { deleteBook, readBook, downloadBook } from "../actions/BookActions";
import { Link } from 'react-router-dom';
import { openConfirmation } from '../actions/AppActions';

export interface ISubMenuProps {
    id: number,
    isOpen: boolean,
    title: string,
    filename: string,
    hideMenu: () => void,
    setMenuHoverState: (isMenuHovered: boolean) => void,
}

export default class SubMenu extends React.Component<ISubMenuProps> {
    public render() {
        return (
            <div className={`${(this.props.isOpen) ? "visible" : "hidden"} sub-menu`} onMouseEnter={() => this.props.setMenuHoverState(true)} onMouseLeave={() => this.props.setMenuHoverState(false)} >
                <button onClick={() => { readBook(this.props.id); this.props.hideMenu() }}> Read </button>
                <button onClick={() => {
                    openConfirmation("Are you sure?", `You are about to delete book "${this.props.title}".`, () => {
                        deleteBook(this.props.id);
                        this.props.hideMenu();
                    })
                }}> Delete </button>
                <Link to={`/library/all-books/${this.props.id}`}>
                    <button className="sub-menu-item"> View info </button>
                </Link>
                <button onClick={() => { downloadBook(this.props.id, this.props.filename); this.props.hideMenu() }}> Download </button>
                <button onClick={() => console.log("Clicked")}> Add to shelf </button>
            </div>
        );
    }
}
