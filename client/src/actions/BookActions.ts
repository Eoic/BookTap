import axios, { AxiosResponse } from "axios";
import dispatcher from "../utilities/Dispatcher";
import AuthUtils from "../utilities/AuthUtils";
import FileDownload from "js-file-download";
import { SHELF_ACTIONS } from "./ShelfActions";
import { response } from "express";
import { toast } from 'react-toastify';

const URL = {
    BOOKS: "/books"
}

const getConfig = () => {
    return {
        headers: { "Authorization": "Bearer " + AuthUtils.getToken() }
    }
}

export const BOOK_ACTIONS = {
    GET_BOOKS: 'BookActions.GetBooks',
    GET_BOOK_BY_ID: "BookActions.GetBookById",
    UPLOAD_BOOK: 'BookActions.UploadBook',
    UPDATE_BOOK: 'BookActions.UpdateBook',
    DELETE_BOOK: 'BookActions.DeleteBook',
    READ_BOOK: 'BookActions.ReadBook',
    ASSIGN_SHELF: "BookActions.AssignShelf",
    ASSIGN_TOPIC: "BookActions.AssignTopic",
    GET_COVER: "BookActions.GetCover",
    ADD_TO_SHELF: "BookActions.AddToShelf",
    GET_BOOKS_UNSHELVED: "BookActions.GetBooksUnshelved",
    OPEN_STATUS_SELECTOR: "BookActions.OpenStatusSelector",
    SET_STATUS: "BookActions.SetStatus",
    GET_SUMMARY: "BookActions.GetSummary",
}

export const getBooks = () => {
    axios.get(URL.BOOKS, getConfig()).then((response) => {
        dispatcher.dispatch({
            type: BOOK_ACTIONS.GET_BOOKS,
            value: response.data,
        });
    }).catch((err) => {
        console.log(err);
    });
}

export const getBookById = (id: number) => {
    axios.get(`${URL.BOOKS}/${id}`, getConfig()).then((response) => {
        dispatcher.dispatch({
            type: BOOK_ACTIONS.GET_BOOK_BY_ID,
            value: response.data,
        })
    });
}

export const deleteBook = (id: number, topic: string) => {
    axios.delete(`${URL.BOOKS}/${id}`, getConfig()).then(() => {
        toast.success(`Deleted book "${topic}"`)
        dispatcher.dispatch({
            type: BOOK_ACTIONS.DELETE_BOOK,
        });
    });
}

export const uploadBook = (files: any) => {
    let toUpload = files.length;
    let processed = 0;

    files.forEach((file: File) => {
        const formData = new FormData();
        formData.append(file.name, file);

        axios.post(`${URL.BOOKS}/upload`, formData, {
            headers: {
                ...getConfig().headers,
                "Content-Type": "multipart/form-data"
            },
        }).then((response) => {
            processed++;

            if (processed === toUpload) {
                dispatcher.dispatch({
                    type: BOOK_ACTIONS.UPLOAD_BOOK,
                    value: response.status,
                });
            }
        }).catch((err) => {
            processed++;
            dispatcher.dispatch({
                type: BOOK_ACTIONS.UPLOAD_BOOK,
                value: err.response.status,
            })
        })
    });
}

export const readBook = (id: number) => {
    axios.get(`${URL.BOOKS}/${id}/download`, getConfig()).then((response) => {
        dispatcher.dispatch({
            type: BOOK_ACTIONS.READ_BOOK,
            value: response.data,
        });
    }).catch((err) => {
        console.log(err);
    });
}

export const downloadBook = (id: number, filename: string) => {
    axios.get(`${URL.BOOKS}/${id}/download`, {
        headers: {
            ...getConfig().headers,
            "Content-Type": "application/pdf",
        },
    }).then((response) => {
        FileDownload(response.data, filename);
    }).catch((err) => {
        console.log(err);
    });
}

export const updateBook = (values: any) => {
    if (values.title.length === 0) {
        toast.error("Book title cannot be empty");
        return;
    }

    axios.patch(`${URL.BOOKS}/${values.id}`, values, getConfig()).then((response) => {
        toast.success("Book info was sucessfully updated");
    });
}

export const openShelfAdder = (bookId: number, shelfId: number) => {
    if (bookId && shelfId) {
        dispatcher.dispatch({
            type: BOOK_ACTIONS.ADD_TO_SHELF,
            value: { bookId, shelfId },
        });
    }
}

export const addToShelf = (bookId: number, shelfId: number) => {
    axios.patch(`${URL.BOOKS}/${bookId}/shelf/${shelfId}`, {}, getConfig()).then((response) => {
        toast.success("Book was added to shelf successfully")
        dispatcher.dispatch({
            type: BOOK_ACTIONS.ASSIGN_SHELF,
            value: response.data,
        });
    });
}

export const getBooksUnshelved = () => {
    axios.get(`${URL.BOOKS}/unshelved`, getConfig()).then((response) => {
        dispatcher.dispatch({
            type: BOOK_ACTIONS.GET_BOOKS_UNSHELVED,
            value: response.data,
        })
    });
}

export const openStatusSelector = (data: any) => {
    dispatcher.dispatch({
        type: BOOK_ACTIONS.OPEN_STATUS_SELECTOR,
        value: data,
    });
}

export const setStatus = (id: number, status: number) => {
    axios.patch(`${URL.BOOKS}/${id}/status`, { status }, getConfig()).then((response) => {
        let statusText = (status == 0) ? "Not started" : (status == 1) ? "In progress" : "Done"; 
        toast.success(`Book reading status changed to "${statusText}"`);

        dispatcher.dispatch({
            type: BOOK_ACTIONS.SET_STATUS,
            value: response.data,
        })
    });
}

export const getSummary = (callback: any) => {
    axios.get(`${URL.BOOKS}/summary`, getConfig()).then((response) => {
        dispatcher.dispatch({
            type: BOOK_ACTIONS.GET_SUMMARY,
            value: response.data,
        })
    });
}

// Deprecated
export const getCover = (id: number, callback: (data: AxiosResponse<any>) => void) => {
    axios.get(`${URL.BOOKS}/${id}/cover`, getConfig()).then((response) => {
        callback(response.data.image);
    });
}