import dispatcher from "../utilities/Dispatcher";
import { EventEmitter } from "events";
import * as BookActions from "../actions/BookActions";

export const STORE_EVENTS = {
    UPDATED: "StoreEvents.Updated",
    UPDATE_REQUIRED: "StoreEvents.UpdateRequired",
    UPLOAD_SUCCESSFUL: "StoreEvents.UploadSuccessful",
    UPLOAD_FAILED: "StoreEvents.UploadFailed",
}

class BookStore extends EventEmitter {
    books: [];

    constructor() {
        super();
        this.books = [];
    }

    handleActions(action: unknown) {
        const typedAction = action as any;

        switch ((action as any).type) {
            case BookActions.BOOK_ACTIONS.GET_BOOKS: {
                this.books = typedAction.value;
                this.emit(STORE_EVENTS.UPDATED);
                break;
            }

            case BookActions.BOOK_ACTIONS.DELETE_BOOK: {
                this.emit(STORE_EVENTS.UPDATE_REQUIRED);
                break;
            }

            case BookActions.BOOK_ACTIONS.UPLOAD_BOOK: {
                if (Number(typedAction.value) === 201) {
                    this.emit(STORE_EVENTS.UPLOAD_SUCCESSFUL);
                    this.emit(STORE_EVENTS.UPDATE_REQUIRED);
                } else this.emit(STORE_EVENTS.UPLOAD_FAILED);
            }
        }
    }

    getBooks() {
        return this.books;
    }
}

const bookStore = new BookStore();
dispatcher.register(bookStore.handleActions.bind(bookStore));
export { bookStore };