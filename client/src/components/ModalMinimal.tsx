import * as React from 'react';

export interface IModalMinimalProps {
    isOpen: boolean,
    open: () => void,
    close: () => void,
    action: React.ReactNode,
    title: string,
    trigger?: {
        style: string,
        text: string,
        icon?: string,
    },
    size?: string
}

export default class ModalMinimal extends React.Component<IModalMinimalProps> {
    public render() {
        return (
            <>
                {this.props.isOpen && <div className="modal-cover">
                    <div className={`modal ${(this.props.size) ? `modal-${this.props.size}` : "modal-small" }`}>
                        <div className="modal-header border-bottom">
                            <h4 style={{ display: "inline", float: "left", margin: 0, paddingLeft: 15, paddingTop: 12 }}> {this.props.title} </h4>
                            <button className="modal-btn" onClick={this.props.close}>
                                <i className="fas fa-times" />
                            </button>
                            <div className="clearfix" />
                        </div>
                        <div className="modal-body">
                            {this.props.children}
                            <div className="modal-footer">
                                {this.props.action}
                            </div>
                        </div>
                    </div>
                </div>}
                {this.props.trigger && <button className={this.props.trigger.style} onClick={this.props.open}>
                    {this.props.trigger.icon && <i className={`fas fa-${this.props.trigger.icon} icon-fixed-width`} />}
                    {this.props.trigger.text}
                </button>}
            </>
        );
    }
}
