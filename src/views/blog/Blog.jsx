import React, { useEffect, useState } from "react";
import { Container, Image, Spinner, Col, Table, Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import BlogAuthor from "../../components/blog/blog-author/BlogAuthor";
import BlogLike from "../../components/likes/BlogLike";
import "./styles.css";

const Blog = (props) => {
  const { author, authorId } = props;
  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams();
  const [file, setFile] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const getPost = async () => {
    try {
      const response = await fetch(`http://localhost:3030/api/blogposts/${id}`);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setBlog(data);

      // Check se il localstorage contiene qualcosa o no
      const itemValue = localStorage.getItem(authorId);
      if (itemValue !== null) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPost();
  }, []);

  const getComments = async () => {
    try {
      const response = await fetch(`http://localhost:3030/api/blogposts/${id}/comments`);

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
      let fileResponse = await fetch(`http://localhost:3030/api/blogposts/${id}/cover`, {

        method: "PATCH",
        body: formData,
      })

      if (fileResponse.ok) {

        const fileDataResponse = await fileResponse.json();
        console.log(fileDataResponse)

        setFile(formData)
        alert("Cover changed successfully!")

      } else {
        throw new Error(`HTTP error! Status: ${fileResponse.status}`);
      }

    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };






  return (

    isLoggedIn, blog ? (
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
      !isLoggedIn, blog && <>
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

          </Container>
        </div>
      </>

    )
  )
};

export default Blog;
