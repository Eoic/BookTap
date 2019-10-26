import React from 'react';

interface IUserContext {
    type: number,
    username: string,
    updateUser(type: number, username: string): void,
}

export default React.createContext<IUserContext>({
    type: 0,
    username: "",
    updateUser: (type: number, username: string) => {
        throw new Error('Function updateUser(type, username) not implemented.');
    },
});