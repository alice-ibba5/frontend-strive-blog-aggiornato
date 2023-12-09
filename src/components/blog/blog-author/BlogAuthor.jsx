import React from "react";
import { Col, Image, Row } from "react-bootstrap";
import "./styles.css";

const BlogAuthor = props => {
  const { name, avatar, surname } = props;
  return (
    <Row>
      <Col xs={"auto"} className="pe-0">
        <Image className="blog-author" src={avatar} roundedCircle />
      </Col>
      <Col className="d-flex align-items-center">
        <span className="me-2">di </span>
        <h6 className="mt-2">{name} {surname}</h6>
      </Col>
    </Row>
  );
};

export default BlogAuthor;
