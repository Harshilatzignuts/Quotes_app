import { useState } from "react";

import axios from "axios";
import { useNavigate } from "react-router-dom";
import { CardFooter, Input } from "@chakra-ui/react";
import { Button, FormControl, FormLabel } from "@chakra-ui/react";
import { Card, CardHeader, CardBody } from "@chakra-ui/react";
import "./Pages.style.css";
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  async function loginUser(event) {
    event.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:1337/api/login",
        {
          email,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.user.token) {
        localStorage.setItem("token", response.data.user.token);
        localStorage.setItem("currentUser", response.data.user.email);
        navigate("/dashboard");
      } else {
        alert("please check your credentials");
      }
      localStorage.setItem("currentUserData", JSON.stringify(response.data));
    } catch (error) {
      console.error("Error during registration:", error);
    }
  }

  return (
    <div className="app">
      <Card className="card">
        <CardHeader>Login</CardHeader>
        <CardBody>
          <form onSubmit={loginUser}>
            <FormControl>
              <FormLabel>Email address</FormLabel>
              <Input
                type="email"
                placeholder="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormControl>
            <br />
            <Button colorScheme="blue" type="submit">
              Login
            </Button>
          </form>
        </CardBody>
        <CardFooter>
          Don't have an account? <a href="/"> Register</a>
        </CardFooter>
      </Card>
    </div>
  );
}

export default Login;
