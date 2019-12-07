import * as React from 'react';
import SubMenu from './SubMenu';
import Favourite from './Favourite';
import uuid from 'uuid';

export interface IBookProps {
	book: any,
}

export interface IBookState {
	isMenuOpen: boolean,
	isMenuHovered: boolean,
}

export default class Book extends React.Component<IBookProps, IBookState> {
	constructor(props: IBookProps) {
		super(props);
		this.state = {
			isMenuOpen: false,
			isMenuHovered: false,
		}

		this.toggleMenu = this.toggleMenu.bind(this);
		this.hideMenu = this.hideMenu.bind(this);
		this.setMenuHoverState = this.setMenuHoverState.bind(this);
	}

	toggleMenu() {
		this.setState({ isMenuOpen: !this.state.isMenuOpen });
	}

	hideMenu() {
		this.setState({ isMenuOpen: false })
	}

	setMenuHoverState(isMenuHovered: boolean) {
		this.setState({ isMenuHovered });
	}

	public render() {
		return (
			<div className="book-grid-item">
				<Favourite bookId={this.props.book.id} isMarked={this.props.book.isFavourite} />
				<img className="book-cover" src={`data:image/png;base64,${this.props.book.cover}`} />

				<div className="book-info">
					<div>
						<p title={this.props.book.title}>{this.props.book.title}</p>
						<p title={this.props.book.author} className="font-small">{this.props.book.author}</p>
					</div>
					<button className="btn" onClick={this.toggleMenu} onBlur={() => !this.state.isMenuHovered && this.hideMenu()}>
						<i className="fas fa-ellipsis-v" />
					</button>
					<div className="clearfix" />
					<SubMenu isOpen={this.state.isMenuOpen} setMenuHoverState={this.setMenuHoverState} hideMenu={this.hideMenu} id={this.props.book.id} filename={this.props.book.originalFilename} />
				</div>
			</div>
		);
	}
}
