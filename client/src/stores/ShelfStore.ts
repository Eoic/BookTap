import dispatcher from "../utilities/Dispatcher";
import { EventEmitter } from "events";
import * as ShelfActions from "../actions/ShelfActions";

export const STORE_EVENTS = {
    UPDATED: "StoreEvents.Updated",
    UPDATE_REQUIRED: "StoreEvents.UpdateRequired",
    UPLOAD_SUCCESSFUL: "StoreEvents.UploadSuccessful",
    UPLOAD_FAILED: "StoreEvents.UploadFailed",
}

class ShelfStore extends EventEmitter {
    shelves: [];

    constructor() {
        super();
        this.shelves = [];
    }

    handleActions(action: unknown) {
        const typedAction = action as any;

        switch ((action as any).type) {
            case ShelfActions.SHELF_ACTIONS.GET_SHELVES: {
                this.shelves = typedAction.value;
                this.emit(STORE_EVENTS.UPDATED);
                break;
            }
            case ShelfActions.SHELF_ACTIONS.ADD_SHELF: {
                this.emit(STORE_EVENTS.UPDATE_REQUIRED);
                break;
            }
        }
    }

    getShelves() {
        return this.shelves;
    }
}

const shelfStore = new ShelfStore();
dispatcher.register(shelfStore.handleActions.bind(shelfStore));
export { shelfStore };