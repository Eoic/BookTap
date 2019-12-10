import axios from "axios";
import dispatcher from "../utilities/Dispatcher";
import AuthUtils from "../utilities/AuthUtils";
import { response } from "express";

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
    CLOSE_ACCOUNT: "UserActions.DeleteAccount",
    DELETE_USER: "UserActions.DeleteUser",
    CHANGE_TYPE: "UserActions.ChangeType",
    CREATE_USER_SUCCESS: "UserActions.CreateUserSuccess",
    CREATE_USER_FAILED: "UserActions.CreateUserFailed",
}

export const getUsers = () => {
    axios.get(URL.USERS, getConfig()).then((response) => {
        dispatcher.dispatch({
            type: USER_ACTIONS.GET_USERS,
            value: response.data,
        });
    });
}

export const deleteUser = (id: number) => {
    axios.delete(`${URL.USERS}/${id}`, getConfig()).then((response) => {
        dispatcher.dispatch({
            type: USER_ACTIONS.DELETE_USER,
            value: response.data,
        });
    });
}

export const changeRole = (id: number, userType: number) => {
    axios.patch(`${URL.USERS}/${id}/role`, { userType }, getConfig()).then((response) => {
        dispatcher.dispatch({
            type: USER_ACTIONS.CHANGE_TYPE,
            value: response.data,
        });
    });
}

export const createUser = (data: any) => {
    axios.post('/register', data, getConfig()).then((response) => {
        dispatcher.dispatch({
            type: USER_ACTIONS.CREATE_USER_SUCCESS,
            value: response.data,
        })
    }).catch((err) => {
        dispatcher.dispatch({
            type: USER_ACTIONS.CREATE_USER_FAILED,
            value: err.response.data.errors,
        });
    });
}