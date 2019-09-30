import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import { MainSection } from "./components/MainSection";
import Navigation from "./components/Navigation";
import "./styles/main.scss";
import Login from "./components/Login";
import Register from "./components/Register";
import Library from "./components/Library";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Navigation />
        <Route path="/" exact component={MainSection} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/library" component={Library} />
    </BrowserRouter>
  );
}

export default App;
