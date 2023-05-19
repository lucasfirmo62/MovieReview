import React, { useState, useEffect } from "react";
import Menu from "../../components/menu";
import api from "../../api";
import Header from "../../components/header";
import "./styles.css";

import CardFollower from "../../components/CardFollower";

import { MdArrowBack } from "react-icons/md";

import { Link, useNavigate } from "react-router-dom";

const Followers = () => {
  const [user, setUser] = useState([]);
  const [followers, setFollowers] = useState([]);
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

  useEffect(() => {
    async function userUtility() {
      var loginItem;

      if (localStorage.getItem("tokenUser")) {
        loginItem = localStorage
          .getItem("tokenUser")
          .substring(1, localStorage.getItem("tokenUser").length - 1);
      }

      var idUser = localStorage.getItem("idUser");

      const headers = {
        Authorization: `Bearer ${loginItem}`,
        "Content-type": "application/json",
      };

      try {
        const userResponse = await api.get(`/usuarios/${idUser}/`, { headers });
        const followersResponse = await api.get(`/usuarios/followers/`, {
          headers,
        });
        const followingResponse = await api.get(`/usuarios/following/`, {
          headers,
        });

        setUser(userResponse.data);
        setFollowers(followersResponse.data);
        setFollowing(followingResponse.data);
      } catch (error) {
        console.log(error);
      }
    }

    userUtility();
  }, []);

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
              to={`/followers`}
              style={{ textDecoration: "none", color: "#fff" }}
            >
              <p className="tab-profile">Seguidores</p>
            </Link>

            <Link
              to={`/following`}
              style={{ textDecoration: "none", color: "#fff" }}
            >
              <p className="tab-profile">Seguindo</p>
            </Link>
          </div>
          {followers.length > 0 && (
            <div className="followers-info-content">
              {followers.map((follower) => (
                <div key={follower.id}>
                  {console.log(
                    following,
                    following.some((user) => user.id === follower.id)
                  )}
                  <CardFollower
                    isFollower={following.some(
                      (user) => user.id === follower.id
                    )}
                    id={follower.id}
                    nickname={follower.nickname}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="right-content"></div>
      </div>
    </>
  );
};

export default Followers;
