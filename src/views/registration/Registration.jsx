import React, { useCallback, useState, useEffect } from "react";
import { Button, Container, Form, Spinner } from "react-bootstrap";
import { useParams } from "react-router-dom";
import "./styles.css";
import { ToastContainer, toast } from 'react-toastify'

const Registration = ({ blogPosts, setblogPosts }) => {
    const [blog, setBlog] = useState();
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [file, setFile] = useState(null);
    const [dateOfBirth, setDateOfBirth] = useState("");



    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const textData = {
            name: name,
            surname: surname,
            email: email,
            password: password,
            dateOfBirth: dateOfBirth
        };

        const formData = new FormData();
        formData.append("avatar", file, "avatar");

        try {
            let textResponse = await fetch(`${process.env.REACT_APP_BACKEND_ENDPOINT}/api/authors`, {
                headers: {
                    "Content-Type": "application/json",
                },
                method: "POST",
                body: JSON.stringify(textData),
            });

            if (textResponse.ok) {
                setBlog(textData)


                const data = await textResponse.json();
                const { _id } = data;

                const fileResponse = await fetch(`${process.env.REACT_APP_BACKEND_ENDPOINT}/api/authors/${_id}/avatar`, {

                    method: "PATCH",
                    body: formData,
                });

                if (fileResponse.ok) {

                    toast("Author registered successfully!", {
                        position: "bottom-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "dark",
                    });

                    const fileDataResponse = await fileResponse.json();
                    console.log(fileDataResponse)

                    setFile(formData)

                    console.log("textData:", textData);
                    try {
                        const response = await fetch(`${process.env.REACT_APP_BACKEND_ENDPOINT}/api/verifyEmail`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                email: textData.email,
                            }),
                        });

                        if (response.ok) {
                            const data = await response.json();
                            toast('Welcome email sent successfully', {
                                position: 'bottom-right',
                                autoClose: 5000,
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true,
                                progress: undefined,
                                theme: 'dark',
                            });
                        } else {
                            console.error('Failed to send welcome email:', response.statusText);
                        }
                    } catch (error) {
                        console.error('Error sending welcome email:', error);
                    }

                } else {
                    throw new Error(`HTTP error! Status: ${fileResponse.status}`);
                }
            }
        } catch (error) {
            console.log("Error fetching data:", error);

        } finally {
            setLoading(false);
        }

    };




    return loading ? (
        <div className="d-flex mt-5">
            <Spinner animation="border" variant="primary" className="mx-auto" />
        </div>
    ) : (
        <Container className="new-blog-container">
            <Form className="mt-5" onSubmit={handleSubmit}>
                <Form.Group controlId="blog-form" className="mt-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                        size="lg"
                        placeholder="Nome"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </Form.Group>

                <Form.Group controlId="blog-form" className="mt-3">
                    <Form.Label>Surname</Form.Label>
                    <Form.Control
                        size="lg"
                        placeholder="Cognome"
                        required
                        value={surname}
                        onChange={(e) => setSurname(e.target.value)}

                    />
                </Form.Group>

                <Form.Group className="mt-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        size="lg"
                        placeholder="Email Address"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </Form.Group>

                <Form.Group className="mt-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        size="lg"
                        placeholder="Password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </Form.Group>

                <Form.Group className="mt-3">
                    <Form.Label>Date of birth</Form.Label>
                    <Form.Control
                        size="lg"
                        placeholder="dd/mm/yyyy"
                        required
                        value={dateOfBirth}
                        onChange={(e) => setDateOfBirth(e.target.value)}
                    />
                </Form.Group>

                <Form.Group className="mt-3">
                    <Form.Label>Avatar</Form.Label>
                    <div>
                        <input type="file"
                            //value={file}
                            multiple={false}
                            onChange={e => setFile(e.target.files[0])} />
                    </div>
                </Form.Group>

                <Form.Group className="d-flex mt-3 justify-content-end">
                    <Button
                        type="reset"
                        size="lg"
                        variant="outline-dark">
                        Reset
                    </Button>
                    <Button
                        type="submit"
                        size="lg"
                        variant="dark"
                        style={{
                            marginLeft: "1em",
                        }}

                    >
                        Invia
                    </Button>
                </Form.Group>
            </Form>

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
    );
}


export default Registration;
