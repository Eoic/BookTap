import * as React from 'react';
import Modal from './Modal';
import { shelfStore, STORE_EVENTS } from "../stores/ShelfStore";
import { getShelves, addShelf } from "../actions/ShelfActions";
import { SidebarItem } from './Library';
import ModalMinimal from './ModalMinimal';

export interface IShelfListProps {
    setLinkActive: (path: string) => void,
    path: string,
}

export interface IShelfListState {
    shelfTitle: string,
    shelfDescription: string,
    shelfList: [],
    modalOpen: boolean,
}

export default class ShelfList extends React.Component<IShelfListProps, IShelfListState> {
    constructor(props: IShelfListProps) {
        super(props);

        this.state = {
            shelfTitle: "",
            shelfDescription: "",
            shelfList: shelfStore.getShelves(),
            modalOpen: false,
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.updateShelfList = this.updateShelfList.bind(this);
        this.fetchShelfList = this.fetchShelfList.bind(this);
    }

    handleChange(event: any) {
        if (Object.keys(this.state).includes(event.target.name)) {
            this.setState({ [event.target.name]: event.target.value } as Pick<IShelfListState, keyof IShelfListState>);
        }
    }

    handleSubmit(event: React.FormEvent) {
        event.preventDefault();

        const length = this.state.shelfTitle.trim().length;

        if (length >= 0 && length <= 30) {
            addShelf({
                title: this.state.shelfTitle,
                description: this.state.shelfDescription,
            });

            this.setState({ modalOpen: false, shelfTitle: "", shelfDescription: "" });
        }
    }

    updateShelfList() {
        this.setState({ shelfList: shelfStore.getShelves() });
    }

    fetchShelfList() {
        getShelves();
    }

    componentDidMount() {
        shelfStore.on(STORE_EVENTS.UPDATED, this.updateShelfList);
        shelfStore.on(STORE_EVENTS.UPDATE_REQUIRED, this.fetchShelfList);
        getShelves();
    }

    componentWillUnmount() {
        shelfStore.removeListener(STORE_EVENTS.UPDATED, this.updateShelfList);
        shelfStore.removeListener(STORE_EVENTS.UPDATE_REQUIRED, this.fetchShelfList);
    }

    public render() {
        return (
            <>
                <ModalMinimal isOpen={this.state.modalOpen} trigger={{ style: "btn btn-blue add-shelf-btn", icon: "plus", text: "ADD SHELF" }}
                    action={<button className="btn btn-green font-medium" type="submit" onClick={this.handleSubmit} form="add-shelf-form"> CREATE </button>}
                    title={"ADD NEW SHELF"} 
                    open={() => this.setState({ modalOpen: true })}
                    close={() => this.setState({ modalOpen: false, shelfTitle: "", shelfDescription: "" })}>
                    <div>
                        <form id="add-shelf-form">
                            <input className="input" required type="text" placeholder="Title" name="shelfTitle" onChange={this.handleChange} value={this.state.shelfTitle} />
                            <textarea className="input" placeholder="Description" name="shelfDescription" onChange={this.handleChange} value={this.state.shelfDescription} />
                        </form>
                    </div>
                </ModalMinimal>
                <li>
                    <SidebarItem text={"Not in shelves"}
                        icon={"caret-right"}
                        path={"unshelved"}
                        isActive={false}
                        onClick={() => { }} />
                </li>
                {this.state.shelfList.map((shelf, index) => (
                    <li key={index}>
                        <SidebarItem text={(shelf as any).title}
                            icon={"caret-right"}
                            path={`shelf/${(shelf as any).id}`}
                            isActive={false}
                            onClick={() => { this.props.setLinkActive(this.props.path) }} />
                    </li>
                ))}
            </>
        );
    }
}
