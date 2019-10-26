import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import AuthUtils from '../utilities/AuthUtils';
import ErrorList from './ErrorList';
import UserContext from '../context/UserContext';

export interface ILoginProps extends RouteComponentProps { }

export interface ILoginFieldsState {
  username: string,
  password: string,
}

export interface ILoginState extends ILoginFieldsState {
  errors: [string?]
}

export default class Login extends React.Component<ILoginProps, ILoginState> {
  constructor(props: ILoginProps) {
    super(props);

    this.state = {
      username: "",
      password: "",
      errors: [],
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (Object.keys(this.state).includes(event.target.name)) {
      this.setState({ [event.target.name]: event.target.value } as Pick<ILoginFieldsState, keyof ILoginFieldsState>);
    }
  }

  handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    AuthUtils.login(this.state.username, this.state.password).then((response) => {
      if (typeof response.data.token !== "undefined") {
        AuthUtils.setToken(response.data.token);
      }
      this.props.history.push('/');
    }).catch((err) => {
      this.setState({ errors: err.response.data.errors });
    });
  }

  public render() {
    return (
        <div className="form-wrapper">
          <form className="login-form" method="post" onSubmit={this.handleSubmit}>
            <h2> Welcome back! </h2>
            <p className="subtitle"> Enter your credentials to login </p>
            {this.state.errors.length > 0 && <ErrorList errors={this.state.errors} />}
            <input className="input" name="username" type="text" placeholder="Username" required onChange={this.handleChange} value={this.state.username}></input>
            <input className="input" name="password" type="password" placeholder="Password" required onChange={this.handleChange} value={this.state.password}></input>
            <button type="submit" className="btn btn-purple btn-form"> Login </button>
            <Link to="password-reset" className="login-form-link subtitle"> Forgot your password? </Link>
          </form>
        </div>
    );
  }
}
