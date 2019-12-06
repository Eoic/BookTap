import axios from "axios";
import dispatcher from "../utilities/Dispatcher";
import AuthUtils from "../utilities/AuthUtils";
import { response } from "express";

const URL = {
    SHELVES: "/shelves"
}

const config = {
    headers: { "Authorization": "Bearer " + AuthUtils.getToken() }
}

export const SHELF_ACTIONS = {
    GET_SHELVES: 'ShelfActions.GetShelves',
    ADD_SHELF: 'ShelfActions.AddShelf',
}

export function getShelves() {
    axios.get(URL.SHELVES, config).then((response) => {
        dispatcher.dispatch({
            value: response.data.shelves,
            type: SHELF_ACTIONS.GET_SHELVES,
        });
    });
}

export function addShelf(data: { title: string, description: string }) {
    axios.post(URL.SHELVES, data, config).then((response) => {
        dispatcher.dispatch({
            type: SHELF_ACTIONS.ADD_SHELF,
            value: response.data,
        });
    });
}