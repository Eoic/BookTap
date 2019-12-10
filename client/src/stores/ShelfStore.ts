import dispatcher from "../utilities/Dispatcher";
import { EventEmitter } from "events";
import * as ShelfActions from "../actions/ShelfActions";
import * as BookActions from "../actions/BookActions";

export const STORE_EVENTS = {
    UPDATED: "StoreEvents.Updated",
    UPDATED_BY_ID: "StoreEvents.UpdatedById",
    UPDATE_REQUIRED: "StoreEvents.UpdateRequired",
    UPLOAD_SUCCESSFUL: "StoreEvents.UploadSuccessful",
    UPLOAD_FAILED: "StoreEvents.UploadFailed",
}

class ShelfStore extends EventEmitter {
    shelves: [];
    shelfById: any;

    constructor() {
        super();
        this.shelves = [];
        this.shelfById = {};
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

            case ShelfActions.SHELF_ACTIONS.GET_SHELF_BY_ID: {
                this.shelfById = typedAction.value;
                this.emit(STORE_EVENTS.UPDATED_BY_ID);
                break;
            }

            case ShelfActions.SHELF_ACTIONS.DELETE_SHELF: {
                this.emit(STORE_EVENTS.UPDATE_REQUIRED);
                break;
            }
        }
    }

    getShelves() {
        return this.shelves;
    }

    getShelfById() {
        return this.shelfById;
    }
}

const shelfStore = new ShelfStore();
dispatcher.register(shelfStore.handleActions.bind(shelfStore));
export { shelfStore };