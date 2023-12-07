import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import {
  FormControl,
  FormLabel,
  Input,
  Badge,
  Button,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerFooter,
  Avatar,
  Text,
  IconButton,
} from "@chakra-ui/react";
import {
  Card,
  CardHeader,
  CardBody,
  Flex,
  Box,
  Container,
  Image,
} from "@chakra-ui/react";
import "./Pages.style.css";
import QuotesImage from "../assets/quotes-bg.jpg";

import { ChatIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";

import ChakraCarousel from "./ChakraCarousel";

const Dashboard = () => {
  const navigate = useNavigate();

  const [quotes, setQuotes] = useState([]);

  const [tempQuote, setTempQuote] = useState("");

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [users, setUsers] = useState([]);

  const [selectedUserQuotes, setSelectedUserQuotes] = useState([]);

  const [selectedUser, setSelectedUser] = useState(null);

  const [openDropDown, setOpenDropDown] = useState(false);

  const btnRef = React.useRef();

  const currentUserEmail = localStorage.getItem("currentUser");

  const currentUser = JSON.parse(localStorage.getItem("currentUserData")).user;

  const [shouldOpenLink, setShouldOpenLink] = useState(false);

  const [whatsappUrl, setWhatsappUrl] = useState("");

  async function populateQuote() {
    const data = await fetch("http://localhost:1337/api/quote", {
      method: "GET",
      headers: {
        "x-access-token": localStorage.getItem("token"),
      },
    });

    const response = await data.json();

    if (response.status === "ok") {
      setQuotes(response.quotes);
    } else {
      alert(response.error);
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const user = jwtDecode(token);

      if (!user) {
        navigate("/login");
        localStorage.removeItem("token");
      } else {
        populateQuote();
      }
    } else {
      navigate("/login");
    }
  }, []);

  async function createQuote(event) {
    event.preventDefault();
    const newQuote = tempQuote.trim();

    // Check if the new quote already exists
    if (quotes.includes(newQuote)) {
      alert("Duplicate quote. Please enter a different quote.");
      return;
    }

    const data = await fetch("http://localhost:1337/api/quote", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({
        quote: newQuote,
      }),
    });

    const response = await data.json();

    if (response.status === "ok") {
      setTempQuote("");
      setQuotes([newQuote, ...quotes]); // Add the new quote to the beginning of the array
    } else {
      alert(response.error);
    }
  }

  async function editQuote(index) {
    const currentQuote = quotes[index];
    const newQuote = prompt("Enter new quote", currentQuote);

    if (newQuote !== null && newQuote.trim() !== "") {
      // Check if the edited quote already exists
      if (quotes.includes(newQuote)) {
        alert("Duplicate quote. Please enter a different quote.");
        return;
      }

      const updatedQuotes = [...quotes];
      updatedQuotes[index] = newQuote;

      // Move the edited quote to the front of the array
      updatedQuotes.unshift(updatedQuotes.splice(index, 1)[0]);

      // Make API request to update the quotes on the server
      const data = await fetch("http://localhost:1337/api/quote", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": localStorage.getItem("token"),
        },
        body: JSON.stringify({
          quotes: updatedQuotes,
        }),
      });

      const response = await data.json();
      if (response.status === "ok") {
        setQuotes(updatedQuotes);
      } else {
        alert(response.error);
      }
    } else if (newQuote !== null) {
      // Show an alert if the user entered an empty quote
      alert("Please enter a non-empty quote.");
    }
  }

  async function deleteQuote(index) {
    const updatedQuotes = [...quotes];
    updatedQuotes.splice(index, 1);

    // Make API request to update the quotes on the server
    const data = await fetch("http://localhost:1337/api/quote", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({
        quotes: updatedQuotes,
      }),
    });

    const response = await data.json();
    if (response.status === "ok") {
      setQuotes(updatedQuotes);
    } else {
      alert(response.error);
    }
  }

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  const property = {
    imageUrl: QuotesImage,
    imageAlt: quotes,
    imageWidth: "100%",
    title: quotes,
  };

  // find users

  useEffect(() => {
    async function fetchUsers() {
      const data = await fetch("http://localhost:1337/api/users", {
        method: "GET",
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      });

      const response = await data.json();

      if (response.status === "ok") {
        // Filter out the current user from the list of all users
        const filteredUsers = response.users.filter(
          (user) => user.email !== currentUserEmail
        );

        setUsers(filteredUsers);
      } else {
        alert(response.error);
      }
    }

    fetchUsers();
  }, []);

  async function fetchUserQuotes(user) {
    const data = await fetch(`http://localhost:1337/api/quote/${user.email}`, {
      method: "GET",
      headers: {
        "x-access-token": localStorage.getItem("token"),
      },
    });

    const response = await data.json();

    if (response.status === "ok") {
      setSelectedUserQuotes(response.quotes);
    } else {
      alert(response.error);
    }
  }

  function handleUserClick(user) {
    setSelectedUser(user);

    fetchUserQuotes(user);
  }

  function handleClose() {
    setSelectedUser("");
    setSelectedUserQuotes("");
  }

  function myQuotes() {
    setSelectedUser("");
    setSelectedUserQuotes("");
  }

  const handleShareViaWhatsApp = (quote) => {
    if (currentUser) {
      const message = `Check out this quote from ${currentUser.name}:\n${quote}`;
      const phoneNumber = "9427547066"; // Replace with the actual phone number

      const whatsappUrl = `https://web.whatsapp.com/send?text=${encodeURIComponent(
        message
      )}&phone=${encodeURIComponent(phoneNumber)}`;

      // Open the WhatsApp link only when the user clicks the button
      const newWindow = window.open(whatsappUrl, "_blank");

      // Check the flag before redirecting
      if (newWindow) {
        // Reset the WhatsApp URL
        setWhatsappUrl("");
      }
    }
  };

  return (
    <div>
      <div className="header_main">
        <Button ref={btnRef} colorScheme="teal" onClick={myQuotes}>
          My Quotes
        </Button>
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
                <li ref={btnRef} colorScheme="teal" onClick={onOpen}>
                  Other Users
                </li>
                <li onClick={(() => setOpenDropDown(false), handleLogout)}>
                  Logout
                </li>
              </ul>
            </div>
          )}
        </Flex>
      </div>
      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Other Users Quotes:</DrawerHeader>
          <DrawerBody>
            {users.map((user, index) => (
              <div key={index} onClick={() => handleUserClick(user)}>
                <Flex mb={4} key={index}>
                  <Avatar name={user.name} />
                  <Box ml="3">
                    <Text fontWeight="bold">
                      {user.name}
                      <Badge ml="1" colorScheme="green">
                        Quote : {user.quotes.length}
                      </Badge>
                    </Text>
                    <Text fontSize="sm">{user.email}</Text>
                  </Box>
                </Flex>
              </div>
            ))}
            {users.length === 0 && <p>No users found</p>}
          </DrawerBody>

          <DrawerFooter>
            <Button
              variant="outline"
              mr={3}
              onClick={() => {
                onClose();
                handleClose();
              }}
            >
              Cancel
            </Button>
            <Button colorScheme="blue">Save</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
      <Container maxW="6xl" color="white">
        {!selectedUser && (
          <div className="inner-page">
            <Card>
              <CardHeader>
                <div className="header">
                  <h1 style={{ color: "black" }}>Create Quote</h1>
                </div>
              </CardHeader>
              <CardBody pt={0}>
                <form onSubmit={createQuote}>
                  <FormControl>
                    <FormLabel>Quote</FormLabel>
                    <Input
                      type="text"
                      name="quote"
                      value={tempQuote}
                      onChange={(e) => setTempQuote(e.target.value)}
                      id="quote"
                      placeholder="Enter your quote"
                    />
                  </FormControl>
                  <Button
                    type="submit"
                    value="Get Quote"
                    mt={2}
                    alignItems={"center"}
                    justifyContent={"center"}
                    colorScheme="teal"
                  >
                    Get Quote
                  </Button>
                </form>
              </CardBody>
            </Card>
          </div>
        )}
        {selectedUser && selectedUserQuotes.length > 0 ? (
          <Card className="quotes-cards">
            <CardHeader>
              <h1>
                {selectedUser.name} Number of Quotes:{" "}
                {selectedUserQuotes.length}
              </h1>
            </CardHeader>
            <CardBody>
              <ChakraCarousel gap={32}>
                {selectedUserQuotes.map((quote, index) => (
                  <Flex
                    key={index}
                    boxShadow="rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px"
                    justifyContent="space-between"
                    flexDirection="column"
                    overflow="hidden"
                    bg="base.d100"
                    rounded={5}
                    flex={1}
                  >
                    <Box
                      maxW="100%"
                      borderWidth="1px"
                      borderRadius="lg"
                      overflow="hidden"
                      className="image-box"
                    >
                      <Image src={property.imageUrl} alt={quote} width="100%" />

                      <Box p="6" className="Quotes">
                        <Box
                          mt="1"
                          fontWeight="semibold"
                          as="h4"
                          lineHeight="tight"
                          noOfLines={3}
                        >
                          {quote}
                        </Box>
                      </Box>
                      <div className="btn-container">
                        <EditIcon
                          onClick={() => editQuote(index)}
                          w={8}
                          h={8}
                          color="teal.500"
                        />

                        <DeleteIcon
                          onClick={() => deleteQuote(index)}
                          w={8}
                          h={8}
                          color="teal.500"
                        />
                      </div>
                    </Box>
                  </Flex>
                ))}
              </ChakraCarousel>
            </CardBody>
          </Card>
        ) : (
          <Card className="quotes-cards">
            <CardHeader>
              <h1>Your Number of Quotes: {quotes.length}</h1>
            </CardHeader>
            <CardBody>
              <ChakraCarousel gap={32}>
                {quotes.map((quote, index) => (
                  <Flex
                    key={index}
                    boxShadow="rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px"
                    justifyContent="space-between"
                    flexDirection="column"
                    overflow="hidden"
                    bg="base.d100"
                    rounded={5}
                    flex={1}
                  >
                    <Box
                      maxW="100%"
                      borderWidth="1px"
                      borderRadius="lg"
                      overflow="hidden"
                      className="image-box"
                    >
                      <Image src={property.imageUrl} alt={quote} width="100%" />

                      <Box p="6" className="Quotes">
                        <Box
                          mt="1"
                          fontWeight="semibold"
                          as="h4"
                          lineHeight="tight"
                          noOfLines={3}
                        >
                          {quote}
                        </Box>
                      </Box>
                      <div className="btn-container">
                        <EditIcon
                          onClick={() => editQuote(index)}
                          w={8}
                          h={8}
                          color="teal.500"
                        />

                        <DeleteIcon
                          onClick={() => deleteQuote(index)}
                          w={8}
                          h={8}
                          color="teal.500"
                        />
                        <IconButton
                          aria-label="Share"
                          variant={"ghost"}
                          color="teal.500"
                          onClick={() => handleShareViaWhatsApp(quote)}
                          icon={<ChatIcon color="teal.500" w={8} h={8} />}
                        />
                      </div>
                    </Box>
                  </Flex>
                ))}
              </ChakraCarousel>
            </CardBody>
          </Card>
        )}
      </Container>
    </div>
  );
};

export default Dashboard;
