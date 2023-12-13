import React from "react";
import { Button, Container, Navbar, Dropdown, Form, Col, Image, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { PersonFill } from 'react-bootstrap-icons';
import logo from "../../assets/logo.png";
import "./styles.css";
import 'react-toastify/dist/ReactToastify.css';
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { ToastContainer, toast } from 'react-toastify'
import BlogAuthor from "../../components/blog/blog-author/BlogAuthor";

const NavBar = props => {

  const [author, setAuthor] = useState(null)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch("http://localhost:3030/api/authors/session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      })

      const data = await response.json()

      if (data.token) {
        localStorage.setItem("authorId", data.authorId)
        localStorage.setItem("token", data.token)
        setAuthor(true);
        toast("You are logged in!!", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      }

      const { token, authorId } = data;

      const responseGet = await fetch(`http://localhost:3030/api/authors/${authorId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          method: "GET",
        },
      });
      if (!responseGet.ok) {
        throw new Error(`HTTP error! Status: ${responseGet.status}`);
      } else {

        const data2 = await responseGet.json();
        setAuthor(data2);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
  console.log(author)



  return (
    <Navbar expand="lg" className="blog-navbar" fixed="top">
      <Container className="justify-content-between">
        <Navbar.Brand as={Link} to="/">
          <img className="blog-navbar-brand" alt="logo" src={logo} />
        </Navbar.Brand>

        <div className="d-flex">


          {!author ? (
            <Dropdown>
              <Dropdown.Toggle variant="dark" id="dropdown-basic">
                <PersonFill />
              </Dropdown.Toggle>

              <Dropdown.Menu className="login-menu" align="end">
                <Form onSubmit={handleLogin}>
                  <Form.Group className="my-3 mx-3" controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)} />
                  </Form.Group>
                  <Form.Group className="my-3 mx-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)} />
                  </Form.Group>
                  <Form.Group className="my-3 mx-3" controlId="formBasicCheckbox">
                    <Form.Check type="checkbox" label="Check me out" />
                  </Form.Group>
                  <div className="d-flex align-items-center">
                    <h6 className="mx-3">Nuovo?</h6> <Button as={Link} to="/register" variant="outline-info"><h6>Registrati</h6></Button>
                  </div>
                  <Button variant="primary" type="submit" className="my-3 mx-3" >
                    Log In
                  </Button>
                </Form>
              </Dropdown.Menu>
            </Dropdown>
          ) : (
            author && <>
              <Button as={Link} to="/new" className="blog-navbar-add-button bg-dark me-3" size="lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-plus-lg"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 0a1 1 0 0 1 1 1v6h6a1 1 0 1 1 0 2H9v6a1 1 0 1 1-2 0V9H1a1 1 0 0 1 0-2h6V1a1 1 0 0 1 1-1z" />
                </svg>
                Nuovo Articolo
              </Button>

              <Dropdown>
                <Dropdown.Toggle variant="dark" id="dropdown-basic">
                  <PersonFill />
                </Dropdown.Toggle>

                <Dropdown.Menu className="login-menu" align="end">
                  <div className="my-3 mx-3">
                    <Row>
                      <Col xs={"auto"} className="pe-0">
                        <Image className="blog-author" src={author.avatar} roundedCircle />
                      </Col>
                      <Col className="d-flex align-items-center">
                        <h6 className="mt-2">{author.name} {author.surname}</h6>
                      </Col>
                    </Row>
                  </div>
                  <Button variant="danger" className="my-3 mx-3"
                    onClick={() => {
                      navigate("/")
                      localStorage.clear()
                      setAuthor(false)
                      setEmail("")
                      setPassword("")
                    }}
                  >
                    Logout
                  </Button>

                </Dropdown.Menu>
              </Dropdown>
            </>)}
        </div>

        <ToastContainer
          position="bottom-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
      </Container>
    </Navbar>
  );
}

export default NavBar;
