import * as React from 'react';

export interface IPasswordResetProps {
}

export default class PasswordReset extends React.Component<IPasswordResetProps> {
    public render() {
        return (
            <div className="form-wrapper">
                <form className="login-form" method="post">
                    <h2> Forgot password </h2>
                    <p className="subtitle"> Password recovery link will be sent to your email address </p>
                    <input className="input" name="email" type="email" placeholder="Email" required></input>
                    <button type="submit" className="btn btn-purple btn-form"> Recover password </button>
                </form>
            </div>
        );
    }
}
