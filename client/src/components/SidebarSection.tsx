import * as React from 'react';

export interface ISidebarSectionProps {
    trigger: {
        text: string,
        style: string,
        iconLeft: string
    }
}

export interface ISidebarSectionState {
    isOpen: boolean
}

export default class SidebarSection extends React.Component<ISidebarSectionProps, ISidebarSectionState> {
    constructor(props: ISidebarSectionProps) {
        super(props);
        this.state = { isOpen: true }
    }

    public render() {
        const { style, text, iconLeft } = this.props.trigger;

        return (
            <>
                <button className={style} onClick={() => this.setState({ isOpen: !this.state.isOpen })}>
                    <i className={iconLeft}></i>
                    {text}
                    <i className={`fas fa-angle-${(this.state.isOpen) ? "right" : "down" } fl-right`} style={{ lineHeight: 1.3 }}></i>
                    <div className="clearfix" />
                </button>
                <ul className="menu-list pl-20" style={{ display: `${(this.state.isOpen) ? "block" : "none"}`} }>
                    {this.props.children}
                </ul>
            </>
        );
    }
}
