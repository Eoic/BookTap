import * as React from 'react';
import { Link } from "react-router-dom";
import AuthUtils from '../utilities/AuthUtils';
import ErrorList from './ErrorList';

export interface IRegisterProps {
}

export interface IRegisterFieldsState {
  email: string,
  username: string,
  password: string,
  passwordRepeat: string,
}

export interface IRegisterState extends IRegisterFieldsState {
  errors: [string?]
}

export default class Register extends React.Component<IRegisterProps, IRegisterState> {
  constructor(props: IRegisterProps) {
    super(props);

    this.state = {
      username: "",
      email: "",
      password: "",
      passwordRepeat: "",
      errors: []
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (Object.keys(this.state).includes(event.target.name)) {
      this.setState({ [event.target.name]: event.target.value } as Pick<IRegisterFieldsState, keyof IRegisterFieldsState>);
    }
  }

  handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const { username, email, password, passwordRepeat } = this.state;

    AuthUtils.register(username, email, password, passwordRepeat).then((response) => {
      // Move to next page .. 
    }).catch((err) => {
      this.setState({ errors: err.response.data });
    });
  }

  public render() {
    return (
      <div className="form-wrapper">
        <form className="login-form" method="post" onSubmit={this.handleSubmit}>
          <h2> Welcome! </h2>
          <p className="subtitle"> Create yout account by filling the form below </p>
          {this.state.errors.length > 0 && <ErrorList errors={this.state.errors} />}
          <input className="input" name="username" type="text" placeholder="Username" required value={this.state.username} onChange={this.handleChange}></input>
          <input className="input" name="email" type="email" placeholder="Email" required value={this.state.email} onChange={this.handleChange}></input>
          <input className="input" name="password" type="password" placeholder="Password" required value={this.state.password} onChange={this.handleChange}></input>
          <input className="input" name="passwordRepeat" type="password" placeholder="Repeat password" required value={this.state.passwordRepeat} onChange={this.handleChange}></input>
          <button type="submit" className="btn btn-purple btn-form"> Sign Up </button>
          <Link to='/login' className="login-form-link subtitle">
            Aleady have an account?
          </Link>
        </form>
      </div>
    );
  }
}
