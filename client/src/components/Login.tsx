import * as React from 'react';
import { Link } from 'react-router-dom';
import AuthUtils from '../utilities/AuthUtils';

export interface ILoginProps {
}

export interface ILoginState {
  username: string,
  password: string,
}

export default class Login extends React.Component<ILoginProps, ILoginState> {
  constructor(props: ILoginProps) {
    super(props);

    this.state = {
      username: "",
      password: "",
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (Object.keys(this.state).includes(event.target.name)) {
      this.setState({ [event.target.name]: event.target.value } as Pick<ILoginState, keyof ILoginState>);
    }
  }

  handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    AuthUtils.login(this.state.username, this.state.password).then((response) => {
      console.log(response);
    }).catch((err) => {
      console.log(err);
    });
  }

  public render() {
    return (
      <div className="form-wrapper">
        <form className="login-form" method="post" onSubmit={this.handleSubmit}>
          <h2> Welcome back! </h2>
          <p className="subtitle"> Enter your credentials to login </p>
          <input className="input" name="username" type="text" placeholder="Username" required onChange={this.handleChange} value={this.state.username}></input>
          <input className="input" name="password" type="password" placeholder="Password" required onChange={this.handleChange} value={this.state.password}></input>
          <button type="submit" className="btn btn-purple btn-form"> Login </button>
          <Link to="password-reset" className="login-form-link subtitle"> Forgot your password? </Link>
        </form>
      </div>
    );
  }
}
