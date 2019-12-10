import dispatcher from "../utilities/Dispatcher";
import { EventEmitter } from "events";
import * as UserActions from "../actions/UserActions";

export const STORE_EVENTS = {
    UPDATED: "StoreEvents.Updated",
    UPDATE_REQUIRED: "StoreEvents.UpdateRequired",
    OP_SUCCESS: "StoreEvents.OpSuccess",
    OP_FAIL: "StoreEvents.OpFail",
}

class UserStore extends EventEmitter {
    users: [];
    errors: [];

    constructor() {
        super();
        this.users = [];
        this.errors = [];
    }

    handleActions(action: unknown) {
        const typedAction = action as any;

        switch ((action as any).type) {
            case UserActions.USER_ACTIONS.GET_USERS: {
                this.users = typedAction.value;
                this.emit(STORE_EVENTS.UPDATED);
                break;
            }

            case UserActions.USER_ACTIONS.DELETE_USER: {
                this.emit(STORE_EVENTS.UPDATE_REQUIRED);
                break;
            }

            case UserActions.USER_ACTIONS.CHANGE_TYPE: {
                this.emit(STORE_EVENTS.UPDATE_REQUIRED);
                break;
            }

            case UserActions.USER_ACTIONS.CREATE_USER_SUCCESS: {
                this.errors = [];
                this.emit(STORE_EVENTS.UPDATE_REQUIRED);
                this.emit(STORE_EVENTS.OP_SUCCESS);
                break;
            }

            case UserActions.USER_ACTIONS.CREATE_USER_FAILED: {
                this.errors = typedAction.value;
                this.emit(STORE_EVENTS.OP_FAIL);
                break;
            }
        }
    }

    getUsers() {
        return this.users;
    }

    getErrors() {
        return this.errors;
    }
}

const userStore = new UserStore();
dispatcher.register(userStore.handleActions.bind(userStore));
export { userStore };