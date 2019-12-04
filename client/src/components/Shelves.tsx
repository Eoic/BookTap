import * as React from 'react';
import Shelf from './Shelf';
import Modal from './Modal';

export interface IShelvesProps {
}

export interface IShelvesState {
	title: string,
	description: string,
}

export default class Shelves extends React.Component<IShelvesProps, IShelvesState> {
	constructor(props: IShelvesProps) {
		super(props);
		this.state = {
			title: "",
			description: "",
		}
		
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleChange(event: any) {
		if (Object.keys(this.state).includes(event.target.name)) {
			this.setState({ [event.target.name]: event.target.value } as Pick<IShelvesState, keyof IShelvesState>);
		}
	}

	handleSubmit(event: React.FormEvent) {
		event.preventDefault();
		console.log(this.state);
	}

	createMockList(itemCount: number) {
		let list = [];

		for (let i = 0; i < itemCount; i++) {
			list.push(<Shelf title="Shelf title" books={["A", "B", "C", "B", "C", "B", "C", "B", "C", "B", "C", "B", "C", "B", "C", "B", "C"]} />)
		}

		return list;
	}

	public render() {
		return (
			<section>
				<Modal trigger={{ style: "btn btn-green font-medium", icon: "plus", text: "ADD SHELF" }}
					action={<button className="btn btn-blue font-medium" type="submit" onClick={this.handleSubmit} form="add-shelf-form"> CREATE </button>}
					closeOnAction={false}
					title={"ADD NEW SHELF"}>
					<form id="add-shelf-form">
						<input className="input" required type="text" placeholder="Title" name="title" onChange={this.handleChange} value={this.state.title} />
						<textarea className="input" placeholder="Description" name="description" onChange={this.handleChange} value={this.state.description} />
					</form>
					<hr />
				</Modal>
				<hr />
				{this.createMockList(5).map((shelf) => shelf)}
			</section>
		);
	}
}
