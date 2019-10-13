import * as React from 'react';
import { Link } from 'react-router-dom';

export interface ILoginProps {
}

export default class Login extends React.Component<ILoginProps> {
  public render() {
    return (
      <div className="form-wrapper">
        <form className="login-form" method="post">
          <h2> Welcome back! </h2>
          <p className="subtitle"> Enter your credentials to login </p>
          <input className="input" name="username" type="text" placeholder="Username" required></input>
          <input className="input" name="password" type="password" placeholder="Password" required></input>
          <button type="submit" className="btn btn-purple btn-form"> Login </button>
          <Link to="password-reset" className="login-form-link subtitle"> Forgot your password? </Link>
        </form>
      </div>
    );
  }
}
