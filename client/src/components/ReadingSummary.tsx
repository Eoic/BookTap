import * as React from 'react';
import SummaryCard from './SummaryCard';
import { getSummary } from '../actions/BookActions';
import { bookStore, STORE_EVENTS } from '../stores/BookStore';

export interface IReadingSummaryProps {
}

export interface IReadingSummaryState {
	uploaded: number,
	inProgress: number,
	done: number,
	shelves: number,
	topics: number,
}

export default class ReadingSummary extends React.Component<IReadingSummaryProps, IReadingSummaryState> {
	constructor(props: IReadingSummaryProps) {
		super(props);

		const { uploaded, inProgress, done, shelves, topics } = bookStore.getSummary();
		this.setState({ uploaded, inProgress, done, shelves, topics });

		this.state = {
			uploaded,
			inProgress,
			done,
			shelves,
			topics,
		}

		this.updateSummary = this.updateSummary.bind(this);
	}

	updateSummary() {
		const { uploaded, inProgress, done, shelves, topics } = bookStore.getSummary();
		this.setState({ uploaded, inProgress, done, shelves, topics });
	}

	componentDidMount() {
		bookStore.on(STORE_EVENTS.SUMMARY_READY, this.updateSummary);
		getSummary(null);
	}

	componentWillUnmount() {
		bookStore.removeListener(STORE_EVENTS.SUMMARY_READY, this.updateSummary);
	}

	public render() {
		const notStarted = this.state.uploaded - (this.state.done + this.state.inProgress);

		return (
			<div>
				<h1 style={{ color: "#434343" }}> Reading summary </h1>
				<hr className="divider" />
				<SummaryCard title="BOOKS" value="100">
					<div>
						<p style={{ float: "left" }}> UPLOADED </p>
						<p style={{ float: "right" }}>
							<span className="bold-value"> {this.state.uploaded} </span>
						</p>
						<div className="clearfix" />
					</div>
					<div>
						<p style={{ float: "left" }}> NOT STARTED </p>
						<p style={{ float: "right" }}>
							<span className="bold-value"> {notStarted} ({Math.round((notStarted * 100) / this.state.uploaded) || 0} %) </span>
						</p>
						<div className="clearfix" />
					</div>
					<div>
						<p style={{ float: "left" }}> CURRENTLY READING </p>
						<p style={{ float: "right" }}>
							<span className="bold-value"> {this.state.inProgress} ({Math.round((this.state.inProgress / this.state.uploaded) * 100) || 0}%) </span>
						</p>
						<div className="clearfix" />
					</div>
					<div style={{ lineHeight: 1 }}>
						<p style={{ float: "left" }}> FINISHED </p>
						<p style={{ float: "right" }}>
							<span className="bold-value"> {this.state.done} ({Math.round((this.state.done / this.state.uploaded) * 100) || 0}%) </span>
						</p>
						<div className="clearfix" />
					</div>
				</SummaryCard>
				<SummaryCard title="OTHER" value="100">
					<div>
						<p style={{ float: "left" }}> SHELVES </p>
						<p style={{ float: "right" }}>
							<span className="bold-value"> {this.state.shelves} </span>
						</p>
						<div className="clearfix" />
					</div>
					<div style={{ lineHeight: 1 }}>
						<p style={{ float: "left" }}> TOPICS </p>
						<p style={{ float: "right" }}>
							<span className="bold-value"> {this.state.topics} </span>
						</p>
						<div className="clearfix" />
					</div>
				</SummaryCard>
			</div>
		);
	}
}
