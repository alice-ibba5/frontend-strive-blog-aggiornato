import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function useJwt() {
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(window.location.search);

  if (searchParams.get("authorId")) {
    localStorage.setItem("authorId", searchParams.get("authorId"));
  }

  if (searchParams.get("token")) {
    localStorage.setItem("token", searchParams.get("token"));
  }

  const authorData = {
    authorId: localStorage.getItem("authorId"),
    token: localStorage.getItem("token"),
  };

  useEffect(() => {
    if (!authorData.authorId || !authorData.token) {
      navigate("/");
    }

    if (window.location.search) {
      navigate(window.location.pathname);
    }
  }, [authorData.authorId, authorData.token, navigate]);

  return authorData;
}
