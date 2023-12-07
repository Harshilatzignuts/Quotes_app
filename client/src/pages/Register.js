import { useState } from "react";

import axios from "axios";
import { useNavigate } from "react-router-dom";
import { CardFooter, Input } from "@chakra-ui/react";
import { Button, FormControl, FormLabel } from "@chakra-ui/react";
import { Card, CardHeader, CardBody } from "@chakra-ui/react";
import "../App.css";
import "./Pages.style.css";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  async function registerUser(event) {
    event.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:1337/api/register",
        {
          name,
          email,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = response;
      console.log(data);

      if (data.status === 200) {
        console.log("andar aavyu");
        navigate("/login");
        localStorage.setItem("token", data.token);
      }
    } catch (error) {
      console.error("Error during registration:", error);
    }
  }

  return (
    <div className="app">
      <Card className="card">
        <CardHeader>Register</CardHeader>
        <CardBody>
          <form onSubmit={registerUser}>
            <FormControl>
              <FormLabel>Name</FormLabel>
              <Input
                type="text"
                placeholder="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </FormControl>
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
              <FormLabel>password</FormLabel>
              <Input
                type="password"
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormControl>
            <br />
            <Button colorScheme="blue" type="submit">
              Register
            </Button>

            <CardFooter>
              Already have an account?
              <br />
              <a href="/login">Login</a>
            </CardFooter>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}

export default Register;
