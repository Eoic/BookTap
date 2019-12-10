import * as React from 'react';

export interface IBookFilterProps {
	handleFilterInput: (event: React.ChangeEvent<HTMLInputElement>) => void,
}

export default class BookFilter extends React.Component<IBookFilterProps> {
	constructor(props: IBookFilterProps) {
		super(props);
	}

	public render() {
		return (
			<>
				<form method="POST" className="book-filter">
					<input type="text" placeholder="Title" name="title" onChange={this.props.handleFilterInput}></input>
					<input type="text" placeholder="Author" name="author" onChange={this.props.handleFilterInput}></input>
					<input type="text" placeholder="Description" name="description" onChange={this.props.handleFilterInput}></input>
					<input type="text" placeholder="Status"></input>
					<input type="text" placeholder="Publisher" name="publisher" onChange={this.props.handleFilterInput}></input>
					<input type="text" placeholder="Language" name="language" onChange={this.props.handleFilterInput}></input>
					<input type="text" placeholder="Shelf"></input>
					<input type="text" placeholder="Topic"></input>
				</form>
				<hr className="divider" />
			</>
		);
	}
}
