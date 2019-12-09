import dispatcher from "../utilities/Dispatcher";
import { EventEmitter } from "events";
import * as UserActions from "../actions/UserActions";

export const STORE_EVENTS = {
    UPDATED: "StoreEvents.Updated",
    UPDATE_REQUIRED: "StoreEvents.UpdateRequired",
}

class UserStore extends EventEmitter {
    users: [];

    constructor() {
        super();
        this.users = [];
    }

    handleActions(action: unknown) {
        const typedAction = action as any;

        switch ((action as any).type) {
            case UserActions.USER_ACTIONS.GET_USERS: {
                this.users = typedAction.value;
                this.emit(STORE_EVENTS.UPDATED);
                break;
            }
        }
    }

    getUsers() {
        return this.users;
    }
}

const userStore = new UserStore();
dispatcher.register(userStore.handleActions.bind(userStore));
export { userStore };