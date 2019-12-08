import dispatcher from "../utilities/Dispatcher";
import { EventEmitter } from "events";
import * as AppActions from "../actions/AppActions";

export const STORE_EVENTS = {
    CONFIRMATION_DATA_READY: "StoreEvents.ConfirmationDataReady",
    CONFIRMATION_DONE: "StoreEvents.ConfirmationDone",
}

class AppStore extends EventEmitter {
    confirmationTitle: string;
    confirmationMessage: string;
    confirmationAction: () => void;

    constructor() {
        super();
        this.confirmationTitle = "";
        this.confirmationMessage = "";
        this.confirmationAction = () => { };
    }

    handleActions(action: unknown) {
        const typedAction = action as any;

        switch (typedAction.type) {
            case AppActions.APP_ACTIONS.OPEN_CONFIRMATION_MODAL: {
                this.confirmationTitle = typedAction.value.title;
                this.confirmationAction = typedAction.value.action;
                this.confirmationMessage = typedAction.value.message;
                this.emit(STORE_EVENTS.CONFIRMATION_DATA_READY);
                break;
            }
            case AppActions.APP_ACTIONS.CLOSE_CONFIRMATION_MODAL: {
                this.emit(STORE_EVENTS.CONFIRMATION_DONE);
            }
        }
    }

    getConfirmationTitle() {
        return this.confirmationTitle;
    }

    getConfirmationAction() {
        return this.confirmationAction;
    }

    getConfirmationMessage() {
        return this.confirmationMessage;
    }
}

const appStore = new AppStore();
dispatcher.register(appStore.handleActions.bind(appStore));
export { appStore };