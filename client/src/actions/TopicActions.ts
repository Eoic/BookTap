import axios from "axios";
import dispatcher from "../utilities/Dispatcher";
import AuthUtils from "../utilities/AuthUtils";

const URL = {
    TOPICS: "/topics"
}

const config = {
    headers: { "Authorization": "Bearer " + AuthUtils.getToken() }
}

export const TOPIC_ACTIONS = {
    GET_TOPICS: 'TopicActions.GetTopics',
    ADD_TOPIC: 'TopicActions.AddTopic',
}

export function getTopics() {
    axios.get(URL.TOPICS, config).then((response) => {
        dispatcher.dispatch({
            value: response.data.topics,
            type: TOPIC_ACTIONS.GET_TOPICS,
        });
    });
}

export function addTopic(data: { title: string, description: string }) {
    axios.post(URL.TOPICS, data, config).then((response) => {
        dispatcher.dispatch({
            type: TOPIC_ACTIONS.ADD_TOPIC,
            value: response.data,
        });
    });
}