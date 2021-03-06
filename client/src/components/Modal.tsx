import * as React from 'react';

export interface IModalProps {
    title: string,
    action: React.ReactNode,
    externalState?: boolean,
    trigger?: {
        style: string,
        text: string,
        icon?: string,
    },
    closeOnAction?: boolean,
    onCloseEvent?: () => void,
}

export interface IModalState {
    isOpen: boolean
}

export default class Modal extends React.Component<IModalProps, IModalState> {
    constructor(props: IModalProps) {
        super(props);
        this.state = {
            isOpen: false
        }
    }

    open = () => this.setState({ isOpen: true });
    close = () => {
        this.setState({ isOpen: false });
        this.props.onCloseEvent && this.props.onCloseEvent();
    }

    public render() {
        return (
            <>
                {(this.state.isOpen || ((typeof (this.props.externalState)) !== "undefined" ? this.props.externalState : this.state.isOpen)) && <div className="modal-cover">
                    <div className="modal modal-small">
                        <div className="modal-header border-bottom">
                            <h4 style={{ display: "inline", float: "left", margin: 0, paddingLeft: 15, paddingTop: 12 }}> {this.props.title} </h4>
                            <button className="modal-btn" onClick={this.close}>
                                <i className="fas fa-times" />
                            </button>
                            <div className="clearfix" />
                        </div>
                        <div className="modal-body">
                            {this.props.children}
                            <div className="modal-footer">
                                <div onClick={() => (this.props.closeOnAction) && this.close()} style={{ display: "inline" }}>
                                    {this.props.action || undefined}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>}
                {this.props.trigger && <button className={this.props.trigger.style} onClick={this.open}>
                    {this.props.trigger.icon && <i className={`fas fa-${this.props.trigger.icon} icon-fixed-width`} />}
                    {this.props.trigger.text}
                </button>}
            </>
        );
    }
}
