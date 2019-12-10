import axios from "axios";
import dispatcher from "../utilities/Dispatcher";
import AuthUtils from "../utilities/AuthUtils";
import { response } from "express";
import { toast } from "react-toastify";

const URL = {
    TOPICS: "/topics"
}

const getConfig = () => {
    return {
        headers: { "Authorization": "Bearer " + AuthUtils.getToken() }
    }
}

export const TOPIC_ACTIONS = {
    GET_TOPICS: 'TopicActions.GetTopics',
    ADD_TOPIC: 'TopicActions.AddTopic',
    DELETE_TOPIC: 'TopicActions.DeleteTopic',
    EDIT_TOPIC: 'TopicActions.EditTopic',
}

export function getTopics() {
    axios.get(URL.TOPICS, getConfig()).then((response) => {
        dispatcher.dispatch({
            value: response.data.topics,
            type: TOPIC_ACTIONS.GET_TOPICS,
        });
    });
}

export function addTopic(data: { title: string, description: string }) {
    if (data.title.trim().length === 0) {
        toast.error("Topic title cannot be empty");
        return;
    }

    axios.post(URL.TOPICS, data, getConfig()).then((response) => {
        toast.success(`Added topic "${data.title}"`)
        dispatcher.dispatch({
            type: TOPIC_ACTIONS.ADD_TOPIC,
            value: response.data,
        });
    });
}

export function deleteTopic(id: number, title: string) {
    axios.delete(`${URL.TOPICS}/${id}`, getConfig()).then((response) => {
        toast.success(`Deleted topic "${title}"`)
        dispatcher.dispatch({
            type: TOPIC_ACTIONS.DELETE_TOPIC,
            value: response.data,
        });
    });
}

export function editTopic(id: number, title: string, description: string, selectedShelves: Map<string, boolean>) {
    axios.patch(`${URL.TOPICS}/${id}`, { title, description }, getConfig()).then((response) => {
        let selected: any[] = [];

        selectedShelves.forEach((value, key) => {
            if (value === true)
                selected.push(key);
        });

        axios.patch(`${URL.TOPICS}/${id}/shelves`, { shelves: selected }, getConfig()).then((response) => {
            toast.success(`Topic "${title}" was updated successfully`)
            dispatcher.dispatch({
                type: TOPIC_ACTIONS.EDIT_TOPIC,
                value: response.data,
            });
        });
    });
}