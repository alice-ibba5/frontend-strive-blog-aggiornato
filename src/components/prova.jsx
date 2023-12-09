import React from "react";
import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";

import BlogItem from "../blog-item/BlogItem";

function getBlogList() {
    const [post, setPost] = useState();


    useEffect(() => {
        const getPosts = async () => {

            try {
                let response = await fetch(
                    "http://localhost:3000/api/blogposts",

                );
                console.log(response);
                if (response.ok) {
                    let post = await response.json();
                    setPost(post);

                } else {
                    console.log("error");

                }
            } catch (error) {
                console.log(error);

            }
        };
        if (!post) {
            getBlogList();
        }
    }, [post]);


    return (
        <Row>
            {post?.map((post, i) => (
                <Col
                    key={`item-${i}`}
                    md={4}
                    style={{
                        marginBottom: 50,
                    }}
                >
                    <BlogItem key={post.title} {...post} />
                </Col>
            ))}
        </Row>
    );
};

export default getBlogList;
