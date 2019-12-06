import dispatcher from "../utilities/Dispatcher";
import { EventEmitter } from "events";
import * as TopicActions from "../actions/TopicActions";

export const STORE_EVENTS = {
    UPDATED: "StoreEvents.Updated",
    UPDATE_REQUIRED: "StoreEvents.UpdateRequired",
}

class TopicStore extends EventEmitter {
    topics: [];

    constructor() {
        super();
        this.topics = [];
    }

    handleActions(action: unknown) {
        const typedAction = action as any;

        switch ((action as any).type) {
            case TopicActions.TOPIC_ACTIONS.GET_TOPICS: {
                this.topics = typedAction.value;
                this.emit(STORE_EVENTS.UPDATED);
                break;
            }
            case TopicActions.TOPIC_ACTIONS.ADD_TOPIC: {
                this.emit(STORE_EVENTS.UPDATE_REQUIRED);
                break;
            }
        }
    }

    getTopics() {
        return this.topics;
    }
}

const topicStore = new TopicStore();
dispatcher.register(topicStore.handleActions.bind(topicStore));
export { topicStore };