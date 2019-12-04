import * as React from 'react';
import { deleteBook, readBook, downloadBook } from "../actions/BookActions";

export interface ISubMenuProps {
    id: number,
    isOpen: boolean,
    filename: string,
    hideMenu: () => void,
    setMenuHoverState: (isMenuHovered: boolean) => void,
}

export default class SubMenu extends React.Component<ISubMenuProps> {
    public render() {
        return (
            <div className={`${(this.props.isOpen) ? "visible" : "hidden"} sub-menu`} onMouseEnter={() => this.props.setMenuHoverState(true)} onMouseLeave={() => this.props.setMenuHoverState(false)} >
                <button onClick={() => { readBook(this.props.id); this.props.hideMenu() }}> Read </button>
                <button onClick={() => { deleteBook(this.props.id); this.props.hideMenu(); }}> Delete </button>
                <button onClick={() => console.log("Clicked")}> View info </button>
                <button onClick={() => { downloadBook(this.props.id, this.props.filename); this.props.hideMenu() }}> Download </button>
                <button onClick={() => console.log("Clicked")}> Assign shelf </button>
                <button onClick={() => console.log("Clicked")}> Assign topic </button>
            </div>
        );
    }
}
