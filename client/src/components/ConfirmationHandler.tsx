import * as React from 'react';
import { appStore, STORE_EVENTS } from "../stores/AppStore";
import Modal from './Modal';
import { closeConfirmation } from '../actions/AppActions';

export interface IConfirmationHandlerProps {

}

export interface IConfirmationHandlerState {
    title: string,
    action: () => void,
    isOpen: boolean,
    message: string,
}

export default class ConfirmationHandler extends React.Component<IConfirmationHandlerProps, IConfirmationHandlerState> {
    constructor(props: IConfirmationHandlerProps) {
        super(props);
        this.state = {
            title: appStore.getConfirmationTitle(),
            action: appStore.getConfirmationAction(),
            message: appStore.getConfirmationMessage(),
            isOpen: false,
        }
        this.updateConfirmationModal = this.updateConfirmationModal.bind(this);
        this.closeConfirmationModal = this.closeConfirmationModal.bind(this);
    }

    updateConfirmationModal() {
        this.setState({
            title: appStore.getConfirmationTitle(),
            action: appStore.getConfirmationAction(),
            message: appStore.getConfirmationMessage(),
            isOpen: true,
        });
    }

    closeConfirmationModal() {
        this.setState({ isOpen: false });
    }

    componentDidMount() {
        appStore.on(STORE_EVENTS.CONFIRMATION_DATA_READY, this.updateConfirmationModal);
        appStore.on(STORE_EVENTS.CONFIRMATION_DONE, this.closeConfirmationModal);
    }

    componentWillUnmount() {
        appStore.removeListener(STORE_EVENTS.CONFIRMATION_DATA_READY, this.updateConfirmationModal);
        appStore.removeListener(STORE_EVENTS.CONFIRMATION_DONE, this.closeConfirmationModal);
    }

    public render() {
        return (
            <Modal title={this.state.title} closeOnAction={true} onCloseEvent={closeConfirmation} externalState={this.state.isOpen} action={
                <>
                    <button className="btn btn-red font-medium"> Cancel </button>
                    &nbsp;
                    <button className="btn btn-green font-medium" onClick={() => { this.state.action(); this.setState({ isOpen: false }); }}> Confirm </button>
                </>
            }>
                <p> {this.state.message} </p>
                <hr/>
            </Modal>
        );
    }
}
