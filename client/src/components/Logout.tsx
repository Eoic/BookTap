import * as React from 'react';
import AuthUtils from '../utilities/AuthUtils';
import { RouteComponentProps } from 'react-router';

export interface ILogoutProps extends RouteComponentProps {
    updateAuthState: () => void
}

export default class Logout extends React.Component<ILogoutProps> {
    componentDidMount() {
        AuthUtils.logout();
        this.props.updateAuthState();
        this.props.history.push("/");
    }

    public render() {
        return (
            <div>
                <p> Logging out...</p>
            </div>
        );
    }
}
