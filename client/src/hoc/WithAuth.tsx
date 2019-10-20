import React, { Component } from 'react';
import AuthUtils from "../utilities/AuthUtils"

export default function WithAuth(ProtectedComponent: any) {
    return class AuthWrapper extends Component {
        state = {
            decoded: null,
            loaded: false
        };

        componentDidMount() {
            if (!AuthUtils.isLoggedIn()) {
                (this.props as any).history.replace("/login");
            } else {
                try {
                    const decoded = AuthUtils.getDecoded();
                    this.setState({
                        loaded: true,
                        decoded,
                    });
                } catch (err) {
                    AuthUtils.logout();
                    (this.props as any).history.replace("/login");
                }
            }
        }

        render() {
            if (this.state.loaded === true) {
                if (this.state.decoded) {
                    return (
                        <ProtectedComponent 
                            history={(this.props as any).history}
                            decoded={this.state.decoded}/>
                    )
                } else {
                    return null;
                }
            } else {
                return null;
            }
        }
    }
}
