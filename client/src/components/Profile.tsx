import * as React from 'react';
import AuthUtils from '../utilities/AuthUtils';

export interface IProfileProps {
}

export interface IProfileState {
    username: string,
    email: string,
    newPassword: "",
    newPasswordRepeat: "",
}

export default class Profile extends React.Component<IProfileProps, IProfileState> {
    constructor(props: IProfileProps) {
        const profileData = AuthUtils.getDecoded();
        super(props);
        this.state = {
            username: (profileData as any).username,
            email: (profileData as any).email,
            newPassword: "",
            newPasswordRepeat: "",
        }

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        if (Object.keys(this.state).includes(event.target.name)) {
            this.setState({ [event.target.name]: event.target.value } as Pick<IProfileState, keyof IProfileState>);
        }
    }

    public render() {
        return (
            <section className="profile">
                <h3> Edit profile </h3>
                <form className="form" id="profile-update">
                    <div className="form-input">
                        <label> Username </label>
                        <input type="text" name="username" value={this.state.username} onChange={this.handleChange}></input>
                    </div>
                    <div className="form-input">
                        <label> Email </label>
                        <input type="email" name="email" value={this.state.email} onChange={this.handleChange}></input>
                    </div>
                </form>
                <button form="profile-update" className="btn btn-green font-medium"> Update profile </button>

                <hr className="divider" />
                <h3> Change password </h3>
                <form className="form" id="password-update">
                    <div className="form-input">
                        <label> New password </label>
                        <input type="password" name="newPassword" value={this.state.newPassword} onChange={this.handleChange}></input>
                    </div>
                    <div className="form-input">
                        <label> Repeat new password </label>
                        <input type="password" name="newPasswordRepeat" value={this.state.newPasswordRepeat} onChange={this.handleChange}></input>
                    </div>
                </form>

                <button form="password-update" className="btn btn-green font-medium"> Change password </button>

                <hr className="divider" />
                <h3> Other actions </h3>
                <button className="btn btn-red font-medium"> Delete account </button>
                <hr className="divider" />
            </section>
        );
    }
}
