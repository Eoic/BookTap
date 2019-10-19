import * as React from 'react';

export interface IMenuBurgerProps {
    handleClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
    isMenuOpen: boolean;
}   

export default class MenuBurger extends React.Component<IMenuBurgerProps> {
    public render() {
        return (
            <button className="menu-burger" onClick={this.props.handleClick}>
                <i className={`fas fa-${this.props.isMenuOpen ? "times" : "bars"}`}></i>
            </button>
        );
    }
}
