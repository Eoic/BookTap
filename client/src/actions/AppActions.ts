import dispatcher from "../utilities/Dispatcher";

export const APP_ACTIONS = {
    OPEN_CONFIRMATION_MODAL: "AppActions.OpenConfirmationModal",
    CLOSE_CONFIRMATION_MODAL: "AppActions.CloseConfirmationModal"
}

export function openConfirmation(title: string, message: string, action: () => void) {
    dispatcher.dispatch({
        type: APP_ACTIONS.OPEN_CONFIRMATION_MODAL,
        value: { title, action, message },
    });
}

export function closeConfirmation() {
    dispatcher.dispatch({
        type: APP_ACTIONS.CLOSE_CONFIRMATION_MODAL,
        value: "",
    });
}