import { books } from "../books";
import { shelves } from "../shelves";
import { topics } from "../topics";
import { users } from "../users";

const routes = [
  ...shelves,
  ...books,
  ...topics,
  ...users,
];

export { routes };
