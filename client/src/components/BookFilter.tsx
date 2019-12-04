import * as React from 'react';

export interface IBookFilterProps {
}

export default class BookFilter extends React.Component<IBookFilterProps> {
	public render() {
		return (
			<>
				<form method="POST" className="book-filter">
					<input type="text" placeholder="Title"></input>
					<input type="text" placeholder="Description"></input>
					<input type="text" placeholder="Status"></input>
					<input type="text" placeholder="Author"></input>
					<input type="text" placeholder="Publisher"></input>
					<input type="text" placeholder="Language"></input>
					<input type="text" placeholder="Shelf"></input>
				</form>
				<button type="submit" className="btn btn-blue font-medium" style={{ marginTop: 10 }}>
					<i className="fas fa-filter icon-fixed-width" />
					Apply
        		</button>
				<hr />
			</>
		);
	}
}
