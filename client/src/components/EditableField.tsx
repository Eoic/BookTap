import * as React from 'react';

export interface IEditableFieldProps {
	text: string,
	tag: string,
	name: string
}

export interface IEditableFieldState {
	editState: EditState,
	text: string,
}

enum EditState {
	Idle,
	Ready,
	Editing,
}

export default class EditableField extends React.Component<IEditableFieldProps, IEditableFieldState> {
	constructor(props: IEditableFieldProps) {
		super(props);
		this.state = {
			editState: EditState.Idle,
			text: this.props.text,
		}

		this.onEnter = this.onEnter.bind(this);
		this.onLeave = this.onLeave.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleSubmit() {

	}

	onEnter() {
		if (this.state.editState === EditState.Editing)
			return;

		this.setState({ editState: EditState.Ready });
	}

	onLeave() {
		if (this.state.editState === EditState.Editing)
			return;

		this.setState({ editState: EditState.Idle });
	}

	static getDerivedStateFromProps(nextProps: IEditableFieldProps, prevState: IEditableFieldState) {
		if (nextProps.text !== prevState.text) {
			return { text: nextProps.text };
		}

		return null;
	}

	public render() {
		const textTagProps = {
			style: {
				display: "inline-block",
				margin: "15px 0",
			}
		}

		return (
			<div onMouseEnter={this.onEnter} onMouseLeave={this.onLeave}>
				{(this.state.editState === EditState.Editing) && <input className="input my-15" style={{ display: "inline", width: 300 }} name={this.props.name} type="text" value={this.state.text} />}
				{!(this.state.editState === EditState.Editing) && React.createElement(this.props.tag, textTagProps, this.props.text)}
				{(this.state.editState === EditState.Ready) && <button className="btn btn-blue ml-10" onClick={() => this.setState({ editState: EditState.Editing })}>
					<i className="fas fa-pen" />
				</button>}
				{(this.state.editState === EditState.Editing) && <button className="btn btn-green ml-10" onClick={() => this.setState({ editState: EditState.Idle })}>
					<i className="fas fa-check" />
				</button>}
			</div>
		);
	}
}
