import * as React from 'react';
import uuid from 'uuid';

export interface IStepperProps {
	size: number,
	action?: () => void,
}

export interface IStepperState {
	activeButton: number,
}

export default class Stepper extends React.Component<IStepperProps, IStepperState> {
	constructor(props: IStepperProps) {
		super(props);

		this.state = {
			activeButton: 1,
		}

		this.generateButtons = this.generateButtons.bind(this);
		this.setButtonActive = this.setButtonActive.bind(this);
		this.stepForward = this.stepForward.bind(this);
		this.stepBack = this.stepBack.bind(this);
	}

	generateButtons() {
		var current = this.state.activeButton,
			last = this.props.size,
			delta = 2,
			left = current - delta,
			right = current + delta + 1,
			range = [],
			rangeWithDots = [],
			l;

		for (let i = 1; i <= last; i++) {
			if (i == 1 || i == last || i >= left && i < right) {
				range.push(i);
			}
		}

		for (let i of range) {
			if (l) {
				if (i - l === 2) {
					rangeWithDots.push(l + 1);
				} else if (i - l !== 1) {
					rangeWithDots.push("...");
				}
			}

			rangeWithDots.push(i);
			l = i;
		}

		return rangeWithDots;
	}

	setButtonActive(value: number) {
		this.setState({ activeButton: value });
	}

	stepForward() {
		if (this.state.activeButton < this.props.size)
			this.setState({ activeButton: this.state.activeButton + 1 });
	}

	stepBack() {
		if (this.state.activeButton > 1)
			this.setState({ activeButton: this.state.activeButton - 1 });
	}

	public render() {
		return (
			<>
				<button className="btn-page font-small mr-10" style={{ padding: 6 }} onClick={() => this.stepBack()}>
					<i className="fas fa-arrow-left icon-fixed-width" />
				</button>
				{this.generateButtons().map((button: any) => {
					if (button === "...")
						return <i key={uuid()}> ... </i>
					else return <button key={uuid()} onClick={() => { this.setButtonActive(button) }} className={`btn-page btn-page-square ${this.state.activeButton === button && "btn-page-active"}`}> {button} </button>
				})}
				<button className="btn-page font-small ml-10 mr-20" style={{ padding: 6 }} onClick={() => this.stepForward()}>
					<i className="fas fa-arrow-right icon-fixed-width" />
				</button>
			</>
		);
	}
}
