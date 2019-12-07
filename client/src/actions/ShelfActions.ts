import axios from "axios";
import dispatcher from "../utilities/Dispatcher";
import AuthUtils from "../utilities/AuthUtils";
import { response } from "express";

const URL = {
    SHELVES: "/shelves"
}

const getConfig = () => {
    return {
        headers: { "Authorization": "Bearer " + AuthUtils.getToken() }
    }
}

export const SHELF_ACTIONS = {
    GET_SHELVES: 'ShelfActions.GetShelves',
    ADD_SHELF: 'ShelfActions.AddShelf',
    GET_SHELF_BY_ID: 'ShelfActions.GetShelfById',
    DELETE_SHELF: 'ShelfActions.DeleteShelf',
}

export function getShelves() {
    axios.get(URL.SHELVES, getConfig()).then((response) => {
        dispatcher.dispatch({
            value: response.data.shelves,
            type: SHELF_ACTIONS.GET_SHELVES,
        });
    });
}

export function addShelf(data: { title: string, description: string }) {
    axios.post(URL.SHELVES, data, getConfig()).then((response) => {
        dispatcher.dispatch({
            type: SHELF_ACTIONS.ADD_SHELF,
            value: response.data,
        });
    });
}

export function getShelfById(id: number) {
    axios.get(`${URL.SHELVES}/${id}`, getConfig()).then((response) => {
        dispatcher.dispatch({
            type: SHELF_ACTIONS.GET_SHELF_BY_ID,
            value: response.data.shelf,
        });
    });
}

export function deleteShelf(id: number) {
    axios.delete(`${URL.SHELVES}/${id}`, getConfig()).then((response) => {
        dispatcher.dispatch({
            type: SHELF_ACTIONS.DELETE_SHELF,
            value: response.data,
        });
    });
}