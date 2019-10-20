import { books } from "../books";
import { login } from "../login";
import { register } from "../register";
import { shelves } from "../shelves";
import { topics } from "../topics";
import { users } from "../users";

const routes = [
  ...shelves,
  ...books,
  ...topics,
  ...users,
  ...register,
  ...login,
];

export { routes };
