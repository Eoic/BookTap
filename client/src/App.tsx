import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import "./styles/main.scss";
import Login from "./components/Login";
import Register from "./components/Register";
import Library from "./components/Library";
import LandingPage from "./components/LandingPage";
import PasswordReset from "./components/PasswordReset";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Navigation />
        <Route path="/" exact component={LandingPage} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/password-reset" component={PasswordReset} />
        <Route path="/library" component={Library} />
    </BrowserRouter>
  );
}

export default App;
