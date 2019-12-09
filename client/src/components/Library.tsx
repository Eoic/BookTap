import * as React from 'react';
import Sidebar from './Sidebar';
import WithAuth from '../hoc/WithAuth';
import BookList from './BookList';
import { Link, Route, RouteComponentProps } from 'react-router-dom';
import Topics from './Topics';
import Shelves from './Shelves';
import ReadingSummary from './ReadingSummary';
import ReadingInProgress from './ReadingInProgress';
import ReadingFinished from './ReadingFinished';
import SidebarSection from './SidebarSection';
import ShelfList from './ShelfList';
import Topic from './Topic';
import Shelf from './Shelf';
import BookInfo from './BookInfo';
import Unshelved from './Unshelved';

const links = {
	browse: [
		{
			text: "All books",
			icon: "list-alt",
			path: "all-books"
		},
		{
			text: "Topics",
			icon: "comment-dots",
			path: "topics"
		},
	],
	readingLog: [
		{
			text: "Summary",
			icon: "newspaper",
			path: "reading-summary",
		},
		{
			text: "In progress",
			icon: "book-reader",
			path: "reading-in-progress",
		},
		{
			text: "Finished",
			icon: "check-square",
			path: "reading-finished",
		}
	]
}

export interface ILibraryProps extends RouteComponentProps {
	decoded: object,
}

export interface ILibraryState {
	activeRoute: string,
	shelfTitle: string,
	shelfDescription: string,
}

export interface ISidebarItemProps {
	icon: string,
	text: string,
	path?: string,
	isActive?: boolean,
	onClick?: () => void,
}

export const SidebarItem = (props: ISidebarItemProps) => {
	const getButton = () => (
		<button className={`btn btn-sidebar btn-fluid text-left ${(props.isActive) && "btn-active-purple"}`} onClick={props.onClick}>
			<i className={`fas fa-${props.icon} icon-fixed-width`}></i>
			{props.text}
		</button>
	);

	const getButtonAsLink = () => (
		<Link to={`/library/${props.path}`}>
			{getButton()}
		</Link>
	)

	return (props.path) ? getButtonAsLink() : getButton();
};

class Library extends React.Component<ILibraryProps, ILibraryState> {
	constructor(props: ILibraryProps) {
		super(props);
		this.state = {
			activeRoute: "all-books",
			shelfTitle: "",
			shelfDescription: "",
		}

		this.setActive = this.setActive.bind(this);
		this.createLinks = this.createLinks.bind(this);
	}

	setActive(routePath: string) {
		this.setState({ activeRoute: routePath });
	}

	createLinks(links: any[]): any {
		return links.map((link, index) => (
			<li key={index}>
				<SidebarItem text={link.text}
					icon={link.icon}
					path={link.path}
					isActive={this.state.activeRoute === link.path}
					onClick={() => this.setActive(link.path)} />
			</li>
		));
	}

	componentDidMount() {
		this.props.history.replace(`/library/${this.state.activeRoute}`)
	}

	public render() {
		return (
			<>
				<Sidebar>
					<h4 className="sidebar-header"> LIBRARY </h4>
					<button className="btn fl-right">
						<i className="fas fa-bars"></i>
					</button>
					<div className="clearfix" />
					<p className="subtitle"> Browse </p>
					<ul className="menu-list pl-0">
						{this.createLinks(links.browse)}
						<li>
							<SidebarSection trigger={{
								text: "Shelves",
								iconLeft: "fas fa-layer-group icon-fixed-width",
								style: "btn btn-sidebar btn-fluid text-left"
							}}>
								{<ShelfList setLinkActive={this.setActive} path={this.props.history.location.pathname} />}
							</SidebarSection>
						</li>
					</ul>
					<hr className="divider" />
					<p className="subtitle"> Your books </p>
					<ul className="menu-list pl-0">
						{/* Reading log */}
						<li>
							<SidebarSection trigger={{
								text: "Reading log",
								iconLeft: "fas fa-clipboard-list icon-fixed-width",
								style: "btn btn-sidebar btn-fluid text-left",
							}}>
								{this.createLinks(links.readingLog)}
							</SidebarSection>
						</li>
					</ul>
					<hr className="divider" />
				</Sidebar>
				<section className="lib-content">
					<Route exact path="/library/all-books" component={BookList} />
					<Route path="/library/topics" component={Topics} />
					<Route path="/library/topic/:id" component={Topic} />
					<Route path="/library/all-books/:id" render={(props) => <BookInfo {...props} />} />
					<Route path="/library/shelf/:id" render={(props) => <Shelf {...props} />} />
					<Route path="/library/unshelved" render={(props) => <Unshelved {...props} />} />
					<Route path="/library/reading-summary" component={ReadingSummary} />
					<Route path="/library/reading-in-progress" component={ReadingInProgress} />
					<Route path="/library/reading-finished" component={ReadingFinished} />
				</section>
			</>
		);
	}
}

export default WithAuth(Library);