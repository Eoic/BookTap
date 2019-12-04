import axios from "axios";
import dispatcher from "../utilities/Dispatcher";
import AuthUtils from "../utilities/AuthUtils";

const URL = {
    BOOKS: "/books"
}

const config = {
    headers: { "Authorization": "Bearer " + AuthUtils.getToken() }
}

export const USER_ACTIONS = {
    UPDATE_USERNAME: "UserActions.UpdateUsername",
    UPDATE_EMAIL: "UserActions.UpdateEmail",
    UPDATE_PASSWORD: "UserActions.UpdatePassword",
    DELETE_ACCOUNT: "UserActions.DeleteAccount",
}