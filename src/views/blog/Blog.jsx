import React, { useEffect, useState } from "react";
import { Container, Image, Spinner, Col, Table, Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import BlogAuthor from "../../components/blog/blog-author/BlogAuthor";
import BlogLike from "../../components/likes/BlogLike";
import { ToastContainer, toast } from 'react-toastify'
import "./styles.css";

const Blog = (props) => {
  const { author, setAuthor, authorId } = props;
  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams();
  const [file, setFile] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const getPost = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_ENDPOINT}/api/blogposts/${id}`);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setBlog(data);


    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {

    }
  };


  useEffect(() => {
    getPost();
  }, []);

  const changeAvatar = async () => {

    // Check se il localstorage contiene qualcosa o no
    const itemValue = localStorage.getItem("authorId");
    if (itemValue !== null) {
      setIsLoggedIn(true);
      console.log(setIsLoggedIn)
    } else {
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    changeAvatar();
  }, []);

  const getComments = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_ENDPOINT}/api/blogposts/${id}/comments`);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getComments();
  }, []);

  const handleSendPic = async () => {

    const formData = new FormData();
    formData.append("cover", file, "cover");

    try {
      let fileResponse = await fetch(`${process.env.REACT_APP_BACKEND_ENDPOINT}/api/blogposts/${id}/cover`, {

        method: "PATCH",
        body: formData,
      })

      if (fileResponse.ok) {

        const fileDataResponse = await fileResponse.json();
        console.log(fileDataResponse)

        setFile(formData)
        toast("Cover changed successfully!", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });

        window.location.reload();

      } else {
        throw new Error(`HTTP error! Status: ${fileResponse.status}`);
      }

    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  return blog && (

    (isLoggedIn) ? (
      <div className="blog-details-root">
        <Container>
          <Image className="blog-details-cover" src={blog.cover} fluid />

          <div>
            <h5>Modifica la cover:</h5>
            <input type="file"
              //value={file}
              multiple={false}
              onChange={e => setFile(e.target.files[0])} />
            <Button
              type="submit"
              size="lg"
              variant="dark"
              style={{
                marginLeft: "1em",
              }}
              onClick={() => !!file && handleSendPic()}
            >Invia</Button>
          </div>

          <h1 className="blog-details-title">{blog.title}</h1>
          <div className="blog-details-container">
            <div className="blog-details-author">
              <BlogAuthor {...blog.author} />
            </div>
            <div className="blog-details-info">
              <div>{blog.createdAt}</div>
              <div>{`lettura da ${blog.readTime.value} ${blog.readTime.unit}`}</div>
              <div
                style={{
                  marginTop: 20,
                }}
              >
                <BlogLike defaultLikes={["123"]} onChange={console.log} />
              </div>
            </div>
          </div>

          <div
            dangerouslySetInnerHTML={{
              __html: blog.content,
            }}
          ></div>

          <h4 className="mt-3">Comments:</h4>

          <Col className="d-flex justify-content-between">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Author</th>
                  <th>Comment</th>
                </tr>
              </thead>
              <tbody>
                {comments.map((comment) =>
                  <tr>
                    <td>{`${comment.author.name} ${comment.author.surname}`}</td>
                    <td>{`${comment.text}`}</td>
                  </tr>)}
              </tbody>
            </Table>
          </Col>

        </Container>
      </div>
    ) : (
      <>
        <div className="blog-details-root">
          <Container>
            <Image className="blog-details-cover" src={blog.cover} fluid />

            <h1 className="blog-details-title">{blog.title}</h1>
            <div className="blog-details-container">
              <div className="blog-details-author">
                <BlogAuthor {...blog.author} />
              </div>
              <div className="blog-details-info">
                <div>{blog.createdAt}</div>
                <div>{`lettura da ${blog.readTime.value} ${blog.readTime.unit}`}</div>
                <div
                  style={{
                    marginTop: 20,
                  }}
                >
                  <BlogLike defaultLikes={["123"]} onChange={console.log} />
                </div>
              </div>
            </div>

            <div
              dangerouslySetInnerHTML={{
                __html: blog.content,
              }}
            ></div>

            <h4 className="mt-3">Comments:</h4>

            <Col className="d-flex justify-content-between">
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Author</th>
                    <th>Comment</th>
                  </tr>
                </thead>
                <tbody>
                  {comments.map((comment) =>
                    <tr>
                      <td>{`${comment.author.name} ${comment.author.surname}`}</td>
                      <td>{`${comment.text}`}</td>
                    </tr>)}
                </tbody>
              </Table>
            </Col>

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
        </div>
      </>

    )
  )
};

export default Blog;
