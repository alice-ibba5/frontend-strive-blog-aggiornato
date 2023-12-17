import React from "react";
import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import BlogItem from "../blog-item/BlogItem";

const BlogList = () => {

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getPosts = async () => {
      setLoading(true);
      try {
        let response = await fetch(`${process.env.REACT_APP_BACKEND_ENDPOINT}/api/blogposts`,
          {
            method: "GET",
            mode: "cors"
          }
        );

        if (response.ok) {
          let data = await response.json();
          setPosts(data)
          setLoading(false);
        } else {
          console.log("error");
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };
    if (posts.length == 0) {
      getPosts();
    }
  }, [posts]);



  return (
    <Row>
      {posts.map(
        (posts, i) => (
          <Col
            key={`item-${i}`}
            md={4}
            style={{
              marginBottom: 50,
            }}
          >
            <BlogItem key={posts.title} {...posts} loading={loading} />
          </Col>
        ))}
    </Row>
  );
};

export default BlogList;


