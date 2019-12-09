import axios from "axios";
import dispatcher from "../utilities/Dispatcher";
import AuthUtils from "../utilities/AuthUtils";

const URL = {
    USERS: "/users"
}

const getConfig = () => {
    return {
        headers: { "Authorization": "Bearer " + AuthUtils.getToken() }
    }
}

export const USER_ACTIONS = {
    GET_USERS: "UserActions.GetUsers",
    UPDATE_USERNAME: "UserActions.UpdateUsername",
    UPDATE_EMAIL: "UserActions.UpdateEmail",
    UPDATE_PASSWORD: "UserActions.UpdatePassword",
    DELETE_ACCOUNT: "UserActions.DeleteAccount",
}

export const getUsers = () => {
    axios.get(URL.USERS, getConfig()).then((response) => {
        dispatcher.dispatch({
            type: USER_ACTIONS.GET_USERS,
            value: response.data,
        });
    });
}