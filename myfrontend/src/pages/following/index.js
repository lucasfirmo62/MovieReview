import React, { useState, useEffect } from "react";
import Menu from "../../components/menu";
import api from "../../api";
import Header from "../../components/header";

import CardFollower from "../../components/CardFollower";

import { MdArrowBack } from "react-icons/md";

import { Link, useNavigate, useParams } from "react-router-dom";

const Following = () => {
  const { id } = useParams();

  const [user, setUser] = useState([]);
  const [following, setFollowing] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const handlePopstate = () => {
      navigate.push("/profile");
    };

    window.addEventListener("popstate", handlePopstate);

    return () => {
      window.removeEventListener("popstate", handlePopstate);
    };
  }, [navigate]);

  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  var loginItem;

  if (localStorage.getItem("tokenUser")) {
    loginItem = localStorage
      .getItem("tokenUser")
      .substring(1, localStorage.getItem("tokenUser").length - 1);
  }

  var idUser = localStorage.getItem("idUser");

  useEffect(() => {
    async function userUtility() {
      const headers = {
        Authorization: `Bearer ${loginItem}`,
        "Content-type": "application/json",
      };

      await api.get(`/usuarios/${idUser}/`, { headers }).then((response) => {
        setUser(response.data);
      });

      await api.get(`/usuarios/following/`, { headers }).then((response) => {
        setFollowing(response.data);
      });
    }

    userUtility();
  }, [idUser, loginItem]);

  return (
    <>
      <Header />
      <div className="content-all">
        {windowSize.width < 680 ? (
          <Menu />
        ) : (
          <div className="left-content">
            <Menu />
          </div>
        )}

        <div className="content-box-profile">
          <div className="followers-info">
            <Link
              className="back-btn"
              to={`/profile`}
              style={{ textDecoration: "none", color: "#fff" }}
            >
              <MdArrowBack size={32} className="back-icon" />
            </Link>

            <h1>{user.nickname}</h1>
          </div>

          <div className="tabs-profile">
            <Link
              to={`/followers/${id}`}
              style={{ textDecoration: "none", color: "#fff" }}
            >
              <p className="tab-profile">Seguidores</p>
            </Link>

            <Link
              to={`/following/${id}`}
              style={{ textDecoration: "none", color: "#fff" }}
            >
              <p style={{backgroundColor: '#4b4949'}} className="tab-profile">Seguindo</p>
            </Link>
          </div>
          <div className="followers-info-content">
            {following.map((followingUser) => (
              <div key={followingUser.id}>
                <CardFollower
                  isFollower={true}
                  id={followingUser.id}
                  nickname={followingUser.nickname}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="right-content"></div>
      </div>
    </>
  );
};

export default Following;
