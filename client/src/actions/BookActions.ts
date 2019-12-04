import axios, { AxiosResponse } from "axios";
import dispatcher from "../utilities/Dispatcher";
import AuthUtils from "../utilities/AuthUtils";
import FileDownload from "js-file-download";

const URL = {
    BOOKS: "/books"
}

const config = {
    headers: { "Authorization": "Bearer " + AuthUtils.getToken() }
}

export const BOOK_ACTIONS = {
    GET_BOOKS: 'BookActions.GetBooks',
    UPLOAD_BOOK: 'BookActions.UploadBook',
    UPDATE_BOOK: 'BookActions.UpdateBook',
    DELETE_BOOK: 'BookActions.DeleteBook',
    READ_BOOK: 'BookActions.ReadBook',
    ASSIGN_SHELF: "BookActions.AssignShelf",
    ASSIGN_TOPIC: "BookActions.AssignTopic",
    GET_COVER: "BookActions.GetCover",
}

export const getBooks = () => {
    axios.get(URL.BOOKS, config).then((response) => {
        dispatcher.dispatch({
            type: BOOK_ACTIONS.GET_BOOKS,
            value: response.data,
        });
    }).catch((err) => {
        console.log(err);
    });
}

export const deleteBook = (id: number) => {
    axios.delete(`${URL.BOOKS}/${id}`, config).then(() => {
        dispatcher.dispatch({
            type: BOOK_ACTIONS.DELETE_BOOK,
        });
    });
}

export const uploadBook = (files: any) => {
    files.forEach((file: File) => {
        const formData = new FormData();
        formData.append(file.name, file);

        axios.post(`${URL.BOOKS}/upload`, formData, {
            headers: {
                ...config.headers,
                "Content-Type": "multipart/form-data"
            },
        }).then((response) => {
            dispatcher.dispatch({
                type: BOOK_ACTIONS.UPLOAD_BOOK,
                value: response.status,
            });
        }).catch((err) => {
            dispatcher.dispatch({
                type: BOOK_ACTIONS.UPLOAD_BOOK,
                value: err.response.status,
            })
        })
    });
}

export const readBook = (id: number) => {
    axios.get(`${URL.BOOKS}/${id}/download`, config).then((response) => {
        dispatcher.dispatch({
            type: BOOK_ACTIONS.READ_BOOK,
            value: response.data,
        });
    }).catch((err) => {
        console.log(err);
    });
}

export const downloadBook = (id: number, filename: string) => {
    axios.get(`${URL.BOOKS}/${id}/download`, config).then((response) => {
        FileDownload(response.data, filename);
    }).catch((err) => {
        console.log(err);
    });
}

// NOT DISPATCHABLE
export const getCover = (id: number, callback: (data: AxiosResponse<any>) => void) => {
    axios.get(`${URL.BOOKS}/${id}/cover`, config).then((response) => {
        callback(response.data.image);
    });
}