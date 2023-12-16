import React, { useCallback, useState, useEffect } from "react";
import { Button, Container, Form, Spinner } from "react-bootstrap";
import { useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./styles.css";
import { ToastContainer, toast } from 'react-toastify'

const NewBlogPost = ({ blogPosts, setblogPosts }) => {
  const [text, setText] = useState("");
  const [blog, setBlog] = useState();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("");
  const [readTime, setReadTime] = useState("");
  const [file, setFile] = useState(null);

  const handleChange = useCallback((value) => {
    setText(value);
    console.log(value)
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const textData = {
      readTime: {
        value: readTime,
      },
      author: author,
      category: category,
      title: title,
      content: text,
    };

    const formData = new FormData();
    formData.append("cover", file, "cover");

    try {
      let textResponse = await fetch("http://localhost:3030/api/blogposts", {
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

        const fileResponse = await fetch(`http://localhost:3030/api/blogposts/${_id}/cover`, {

          method: "PATCH",
          body: formData,
        });

        if (fileResponse.ok) {

          toast("Blogpost created successfully!", {
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




        } else {
          throw new Error(`HTTP error! Status: ${fileResponse.status}`);
        }
      }
    } catch (error) {
      console.log("Error fetching data:", error);

    } finally {
      setLoading(false);
    }
    // getPosts();
  };

  useEffect(() => {
    // Recupera il valore di 'authorId' dal localStorage al montaggio del componente
    const storedAuthorId = localStorage.getItem('authorId');
    if (storedAuthorId) {
      setAuthor(storedAuthorId);
    }
  }, []);



  return loading ? (
    <div className="d-flex mt-5">
      <Spinner animation="border" variant="primary" className="mx-auto" />
    </div>
  ) : (
    <Container className="new-blog-container">
      <Form className="mt-5" onSubmit={handleSubmit}>
        <Form.Group controlId="blog-form" className="mt-3">
          <Form.Label>Titolo</Form.Label>
          <Form.Control
            size="lg"
            placeholder="Title"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="blog-form" className="mt-3">
          <Form.Label>Author ID</Form.Label>
          <Form.Control
            size="lg"
            placeholder="2348762397429"
            required
            value={author}


          />
        </Form.Group>

        <Form.Group controlId="blog-category" className="mt-3">
          <Form.Label>Categoria</Form.Label>
          <Form.Control
            size="lg"
            as="select"
            required
            value={category}
            onChange={(e) => setCategory(e.target.value)}>
            <option>Categoria 1</option>
            <option>Categoria 2</option>
            <option>Categoria 3</option>
            <option>Categoria 4</option>
            <option>Categoria 5</option>
          </Form.Control>
        </Form.Group>

        <Form.Group className="mt-3">
          <Form.Label>Cover</Form.Label>
          <div>
            <input type="file"
              //value={file}
              multiple={false}
              onChange={e => setFile(e.target.files[0])} />
          </div>
        </Form.Group>

        <Form.Group className="mt-3">
          <Form.Label>Tempo di lettura</Form.Label>
          <div className="d-flex align-items-center">
            <Form.Control
              size="lg"
              placeholder="3"
              required
              value={readTime}
              onChange={(e) => setReadTime(e.target.value)}
              style={{
                width: 50,
              }}
            />
            <span className="ms-2">minuti</span>
          </div>
        </Form.Group>

        <Form.Group controlId="blog-content" className="mt-3">
          <Form.Label>Contenuto Blog</Form.Label>
          <ReactQuill value={text} onChange={handleChange} className="new-blog-content" />
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


export default NewBlogPost;
