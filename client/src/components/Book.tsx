import * as React from 'react';
import SubMenu from './SubMenu';
import { getCover } from '../actions/BookActions';
import { any } from 'prop-types';
import uuid from "uuid/v4";

export interface IBookProps {
	id: number,
	title: string,
	author: string,
	filename: string,
}

export interface IBookState {
	isMenuOpen: boolean,
	isMenuHovered: boolean,
	cover: any,
}

export default class Book extends React.Component<IBookProps, IBookState> {
	constructor(props: IBookProps) {
		super(props);
		this.state = {
			isMenuOpen: false,
			isMenuHovered: false,
			cover: any,
		}

		this.toggleMenu = this.toggleMenu.bind(this);
		this.hideMenu = this.hideMenu.bind(this);
		this.setMenuHoverState = this.setMenuHoverState.bind(this);
		getCover(this.props.id, (data) => { this.setState({ cover: data }); });
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
				<img className="book-cover" src={`data:image/png;base64,${this.state.cover}`} />
				<div className="book-info">
					<div>
						<p title={this.props.title}>{this.props.title}</p>
						<p title={this.props.author} className="font-small">{this.props.author}</p>
					</div>
					<button className="btn" onClick={this.toggleMenu} onBlur={() => !this.state.isMenuHovered && this.hideMenu()}>
						<i className="fas fa-ellipsis-v" />
					</button>
					<div className="clearfix" />
					<SubMenu isOpen={this.state.isMenuOpen} setMenuHoverState={this.setMenuHoverState} hideMenu={this.hideMenu} id={this.props.id} filename={this.props.filename} />
				</div>
			</div>
		);
	}
}
