import React, { useState, useEffect } from "react";
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Flex,
  Text,
  Box,
  Avatar,
  useDisclosure,
  Container,
  Card,
  CardHeader,
  CardBody,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import "./Pages.style.css";
const EditProfile = () => {
  const [updatedName, setUpdatedName] = useState("");
  const [updatedEmail, setUpdatedEmail] = useState("");
  const [currentUser, setCurrentUser] = useState({ name: "", email: "" });
  const [openDropDown, setOpenDropDown] = useState(false);
  const { onOpen } = useDisclosure();
  const btnRef = React.useRef();
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the current user data and set it in the state
    const currentUserData = JSON.parse(localStorage.getItem("currentUserData"));
    if (currentUserData && currentUserData.user) {
      setCurrentUser(currentUserData.user);
      setUpdatedName(currentUserData.user.name);
      setUpdatedEmail(currentUserData.user.email);
    }
  }, []);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:1337/api/updateProfile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": localStorage.getItem("token"),
        },
        body: JSON.stringify({
          name: updatedName,
          email: updatedEmail,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      const data = await response.json();
      console.log(data);
      if (data.status === "ok") {
        alert("Profile updated successfully");
        navigate("/dashboard");
        // handle success if necessary
        localStorage.setItem("currentUserData", JSON.stringify(data));
      } else {
        alert("Failed to update profile");
      }
      // handle data if necessary
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };
  const handleEdit = () => {
    console.log("edit profile");
    navigate("/editprofile");
  };

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/login");
  }
  const handleCancelEdit = () => {
    setUpdatedName(currentUser.name);
    setUpdatedEmail(currentUser.email);
    navigate("/dashboard");
  };

  return (
    <>
      <div className="header_main">
        <Flex
          className="profile-head"
          onClick={() => {
            if (openDropDown) {
              setOpenDropDown(false);
            } else {
              setOpenDropDown(true);
            }
          }}
        >
          <Avatar name={currentUser.name} />
          <Box ml="3">
            <Text fontWeight="bold" fontSize="sm" color={"white"}>
              {currentUser.name}
            </Text>
            <Text fontWeight="bold" fontSize="sm" color={"white"}>
              {currentUser.email}
            </Text>
          </Box>
          {openDropDown && (
            <div className="logout">
              <ul>
                <li ref={btnRef} onClick={onOpen}>
                  Other Users
                </li>
                <li onClick={handleEdit}>Edit Profile</li>
                <li onClick={(() => setOpenDropDown(false), handleLogout)}>
                  Logout
                </li>
              </ul>
            </div>
          )}
        </Flex>
      </div>
      <Container maxW="6xl" color="white">
        <div className="inner-page">
          <Card>
            <CardHeader>
              <div className="header">
                <h1 style={{ color: "black" }}>Create Quote</h1>
              </div>
            </CardHeader>
            <CardBody pt={0}>
              <form onSubmit={handleSaveProfile}>
                <FormControl>
                  <FormLabel>Name</FormLabel>
                  <Input
                    type="text"
                    value={updatedName}
                    onChange={(e) => setUpdatedName(e.target.value)}
                  />
                </FormControl>

                <FormControl mt={4}>
                  <FormLabel>Email</FormLabel>
                  <Input
                    type="email"
                    value={updatedEmail}
                    onChange={(e) => setUpdatedEmail(e.target.value)}
                  />
                </FormControl>

                <div>
                  <Button
                    mt={4}
                    type="submit"
                    value="Get Quote"
                    alignItems={"center"}
                    justifyContent={"center"}
                    colorScheme="teal"
                  >
                    Save
                  </Button>
                  <Button mt={4} ml={4} onClick={handleCancelEdit}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardBody>
          </Card>
        </div>
      </Container>
    </>
  );
};

export default EditProfile;
