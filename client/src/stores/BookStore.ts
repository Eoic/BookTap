import dispatcher from "../utilities/Dispatcher";
import { EventEmitter } from "events";
import * as BookActions from "../actions/BookActions";

export const STORE_EVENTS = {
    UPDATED: "StoreEvents.Updated",
    UPDATED_BY_ID: "StoreEvents.UpdatedById",
    UPDATE_REQUIRED: "StoreEvents.UpdateRequired",
    UPLOAD_SUCCESSFUL: "StoreEvents.UploadSuccessful",
    UPLOAD_FAILED: "StoreEvents.UploadFailed",
    ADD_SHELF_READY: "StoreEvents.AddShelfReady",
    STATUS_SELECTOR_READY: "StoreEvents.StatusSelectorReady",
    SUMMARY_READY: "StoreEvents.SummaryReady",
}

class BookStore extends EventEmitter {
    books: [];
    unshelved: [];
    bookById: {};
    statusSelectorData: any;
    summary: { uploaded: number, inProgress: number, done: number, shelves: number, topics: number }

    constructor() {
        super();
        this.books = [];
        this.unshelved = [];
        this.bookById = {};
        this.statusSelectorData = {};
        this.summary = {
            uploaded: 0,
            inProgress: 0,
            done: 0,
            shelves: 0,
            topics: 0,
        }
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
                break;
            }

            case BookActions.BOOK_ACTIONS.GET_BOOK_BY_ID: {
                this.bookById = typedAction.value;
                this.emit(STORE_EVENTS.UPDATED_BY_ID);
                break;
            }

            case BookActions.BOOK_ACTIONS.ADD_TO_SHELF: {
                this.emit(STORE_EVENTS.ADD_SHELF_READY, typedAction.value);
                break;
            }

            case BookActions.BOOK_ACTIONS.GET_BOOKS_UNSHELVED: {
                this.unshelved = typedAction.value;
                this.emit(STORE_EVENTS.UPDATED);
                break;
            }
            
            case BookActions.BOOK_ACTIONS.ASSIGN_SHELF: {
                this.emit(STORE_EVENTS.UPDATE_REQUIRED);
                break;
            }

            case BookActions.BOOK_ACTIONS.OPEN_STATUS_SELECTOR: {
                this.statusSelectorData = typedAction.value;
                this.emit(STORE_EVENTS.STATUS_SELECTOR_READY);
                break;
            }

            case BookActions.BOOK_ACTIONS.SET_STATUS: {
                this.emit(STORE_EVENTS.UPDATE_REQUIRED);
                break;
            }

            case BookActions.BOOK_ACTIONS.GET_SUMMARY: {
                this.summary = typedAction.value;
                this.emit(STORE_EVENTS.SUMMARY_READY);
                break;
            }
        }
    }

    getBooks() {
        return this.books;
    }

    getBooksUnshelved() {
        return this.unshelved;
    }

    getBookById() {
        return this.bookById;
    }

    getStatusSelectorData() {
        return this.statusSelectorData;
    }

    getSummary() {
        return this.summary;
    }
}

const bookStore = new BookStore();
dispatcher.register(bookStore.handleActions.bind(bookStore));
export { bookStore };