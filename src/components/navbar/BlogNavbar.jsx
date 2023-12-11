import React from "react";
import { Button, Container, Navbar, Dropdown, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import { PersonFill } from 'react-bootstrap-icons';
import logo from "../../assets/logo.png";
import "./styles.css";
import 'react-toastify/dist/ReactToastify.css';

const NavBar = props => {
  return (
    <Navbar expand="lg" className="blog-navbar" fixed="top">
      <Container className="justify-content-between">
        <Navbar.Brand as={Link} to="/">
          <img className="blog-navbar-brand" alt="logo" src={logo} />
        </Navbar.Brand>

        <div className="d-flex">
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
              <Form>
                <Form.Group className="my-3 mx-3" controlId="formBasicEmail">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control type="email" placeholder="Enter email" />
                </Form.Group>
                <Form.Group className="my-3 mx-3" controlId="formBasicPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control type="password" placeholder="Password" />
                </Form.Group>
                <Form.Group className="my-3 mx-3" controlId="formBasicCheckbox">
                  <Form.Check type="checkbox" label="Check me out" />
                </Form.Group>
                <div className="d-flex align-items-center">
                  <h6 className="mx-3">Nuovo?</h6> <Button as={Link} to="/register" variant="outline-info"><h6>Registrati</h6></Button>
                </div>
                <Button variant="primary" type="submit" className="my-3 mx-3">
                  Log In
                </Button>
              </Form>
            </Dropdown.Menu>
          </Dropdown>
        </div>

      </Container>
    </Navbar>
  );
};

export default NavBar;
