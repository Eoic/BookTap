import * as React from 'react';

export interface IFavouriteProps {
	isMarked: boolean,
	bookId: number,
}

export interface IFavouriteState {
	isMarked: boolean
}

export default class Favourite extends React.Component<IFavouriteProps, IFavouriteState> {
	constructor(props: IFavouriteProps) {
		super(props);
		this.state = {
			isMarked: this.props.isMarked,
		}
		this.toggleMark = this.toggleMark.bind(this);
	}

	toggleMark() {
		this.setState({
			isMarked: !this.state.isMarked,
		})
	}

	public render() {
		return (
			<div className="favourite-mark" onClick={this.toggleMark} title={"Mark as favourite"}>
				<i className={`fa${(this.state.isMarked) ? "s" : "r"} fa-bookmark`} />
			</div>
		);
	}
}
