import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import UserContext from "./Context/UserContext";
import "bootstrap/dist/css/bootstrap.min.css";
import Home from "./pages/Home";
import Item from "./pages/Item";
import Landing from "./pages/Landing";
import { Container } from "react-bootstrap";
import axios from "axios";
import Navigation from "./components/Navigation";

function App() {
  const [userData, setUserData] = useState({
    user: undefined,
    token: undefined,
  });

  const checkLoggedIn = async () => {
    let token = localStorage.getItem("auth-token");

    if (token === null) {
      localStorage.setItem("auth-token", "");
      token = "";
    }

    const tokenRes = await axios.post("/users/tokenIsValid", null, {
      headers: { "x-auth-token": token },
    });

    if (tokenRes.data) {
      const userRes = await axios.get("/users/", {
        headers: { "x-auth-token": token },
      });

      setUserData({
        token,
        user: userRes.data,
      });
    }
  };

  const logout = () => {
    setUserData({
      token: undefined,
      user: undefined,
    });

    localStorage.setItem("auth-token", "");
  };

  useEffect(() => {
    checkLoggedIn();
  }, []);

  return (
    <div className="App">
      <BrowserRouter>
        <Navigation userData={userData} logout={logout} />
        <Container>
          <UserContext.Provider value={{ userData, setUserData }}>
            <Switch>
              <Route path="/home" component={Home} />
              <Route path="/item/:id" component={Item} />
              <Route path="/" component={Landing} />
            </Switch>
          </UserContext.Provider>
        </Container>
      </BrowserRouter>
    </div>
  );
}

export default App;
