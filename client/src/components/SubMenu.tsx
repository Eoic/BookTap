import * as React from 'react';

export interface ISubMenuProps {
    isOpen: boolean,
}

export default class SubMenu extends React.Component<ISubMenuProps> {
    public render() {
        return (
            <div className={`${(this.props.isOpen) ? "visible" : "hidden"} sub-menu`}>
                <button className="sub-menu-item" onClick={() => console.log("Clicked")}> Read </button>
                <button className="sub-menu-item" onClick={() => console.log("Clicked")}> Delete </button>
                <button className="sub-menu-item" onClick={() => console.log("Clicked")}> View info </button>
                <button className="sub-menu-item" onClick={() => console.log("Clicked")}> Download </button>
                <button className="sub-menu-item" onClick={() => console.log("Clicked")}> Assign shelf </button>
                <button className="sub-menu-item" onClick={() => console.log("Clicked")}> Assign topic </button>
            </div>
        );
    }
}
