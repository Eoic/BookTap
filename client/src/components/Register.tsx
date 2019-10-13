import * as React from 'react';
import { Link } from 'react-router-dom';

export interface IRegisterProps {
}

export default class Register extends React.Component<IRegisterProps> {
  public render() {
    return (
      <div className="form-wrapper">
        <form className="login-form" method="post">
          <h2> Welcome! </h2>
          <p className="subtitle"> Create yout account by filling the form below   </p>
          <input className="input" name="username" type="text" placeholder="Username" required></input>
          <input className="input" name="email" type="email" placeholder="Email" required></input>
          <input className="input" name="password" type="password" placeholder="Password" required></input>
          <input className="input" name="repeatPassword" type="password" placeholder="Repeat password" required></input>
          <button type="submit" className="btn btn-purple btn-form"> Sign Up </button>
          <Link to='/login' className="login-form-link subtitle">
            Aleady have an account?
          </Link>
        </form>
      </div>
    );
  }
}
