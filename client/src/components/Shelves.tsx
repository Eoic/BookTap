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

	public render() {
		return (
			<section>
			</section>
		);
	}
}
