import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import Navigation from "./Navigation";
import "../styles/main.scss";
import Login from "./Login";
import Register from "./Register";
import Library from "./Library";
import LandingPage from "./LandingPage";
import PasswordReset from "./PasswordReset";
import AuthUtils from "../utilities/AuthUtils";
import Logout from "./Logout";
import Users from "./Users";
import Profile from "./Profile";
import ConfirmationHandler from "./ConfirmationHandler";
import ShelfAdder from "./ShelfAdder";
import BookStatusAdder from "./BookStatusAdder";

export interface IAppProps {
}

export interface IAppState {
  isAuthenticated: boolean
}

export default class App extends React.Component<IAppProps, IAppState> {
  constructor(props: IAppProps) {
    super(props);
    this.state = { isAuthenticated: AuthUtils.isLoggedIn() }
    this.updateAuthState = this.updateAuthState.bind(this);
  }

  updateAuthState = (callback?: () => void): void => {
    this.setState({
      isAuthenticated: AuthUtils.isLoggedIn(),
    }, () => callback && callback());
  }

  public render() {
    return (
      <>
        <BrowserRouter>
          <Navigation isAuthenticated={this.state.isAuthenticated} />
          <Route path="/" exact component={LandingPage} />
          <Route path="/login" render={(props) => <Login {...props} updateAuthState={this.updateAuthState} />} />
          <Route path="/register" render={(props) => <Register {...props} updateAuthState={this.updateAuthState} />} />
          <Route path="/logout" render={(props) => <Logout {...props} updateAuthState={this.updateAuthState} />} />
          <Route path="/profile" component={Profile} />
          <Route path="/password-reset" component={PasswordReset} />
          <Route path="/library" component={Library} />
          <Route path="/users" component={Users} />
        </BrowserRouter>
        <ConfirmationHandler />
        <ShelfAdder />
        <BookStatusAdder />
      </>
    );
  }
}
