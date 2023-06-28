import React, { useState, useEffect } from "react";
import './styles.css';
import api from "../../api";
import { useNavigate } from "react-router-dom";


const UserGet = ({ idUSerComment, dateUserComment, userID, comment }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  let loginItem
  let datePublication;


  if (localStorage.getItem("tokenUser")) {
    loginItem = localStorage
      .getItem("tokenUser")
      .substring(1, localStorage.getItem("tokenUser").length - 1);
  }

  function timePubConcat(date) {

    const currentDate = new Date();
    const providedDate = new Date(date);
    const isToday = currentDate.toDateString() === providedDate.toDateString();
    const yesterday = new Date();
    yesterday.setDate(currentDate.getDate() - 1);
    const isYesterday = yesterday.toDateString() === providedDate.toDateString();
    const isOlderThanYesterday = providedDate < yesterday;
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(currentDate.getDate() - 7);
    const isOlderThanOneWeek = providedDate < oneWeekAgo;

    const time = date.substr([11])

    const hour = parseInt(time);

    const hourRt = hour - 3;

    if (isToday) {
      datePublication = `- Hoje às ${hourRt}:${time[3] + time[4]}`
    }

    if (isYesterday) {
      datePublication = `- Ontem às ${hourRt}:${time[3] + time[4]}`
    }

    if (isOlderThanYesterday) {
      const weekdays = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
      const dayOfWeek = weekdays[providedDate.getDay()];
      datePublication = `- ${dayOfWeek} às ${hourRt}:${time[3] + time[4]}`
    }
    if (isOlderThanOneWeek) {
      const formattedDate = providedDate.toLocaleDateString();
      const formattedTime = providedDate.toLocaleTimeString();
      datePublication = `- ${formattedDate} às ${hourRt}:${time[3] + time[4]}`
    }

    let verifyTimer = datePublication.substring(10)
    verifyTimer = parseInt(verifyTimer);

    let verifyTimerMin = datePublication.substring(13, 15)
    verifyTimerMin = parseInt(verifyTimerMin);

    if (verifyTimer < 0) {
      verifyTimer += 24;
      datePublication = datePublication.substring(0, 10)
      if (verifyTimerMin === 0) {
        datePublication = `${datePublication} ${verifyTimer}`
      } else {
        datePublication = `${datePublication} ${verifyTimer}:${verifyTimerMin}`
      }

    }


    return datePublication
  }


  useEffect(() => {
    async function fetchData() {
      try {
        const headers = {
          'Authorization': `Bearer ${loginItem}`,
          'Content-Type': 'application/json',
        };

        const response_user = await api.get(`usuarios/${idUSerComment}/`, { headers });
        setUser(response_user.data);
      } catch (error) {
        console.error(error);
      }
    }

    fetchData();
  }, [loginItem, userID, setUser]);

  var timeComment = timePubConcat(dateUserComment)

  async function handleProfileInside(profileUser) {
    navigate(`/user/${profileUser}`);
  }

  if (user) {
    return (
      <>
        <div className="content-conf-review-write">
          <img
            className="user-image"
            src={user.profile_image ? user.profile_image : "https://ibaseminario.com.br/novo/wp-content/uploads/2013/09/default-avatar.png"}
            alt="user-photo"
            style={{ objectFit: "cover" }}
          />
        </div>
        <div>
        <div className="user-insert-comment" onClick={() => handleProfileInside(idUSerComment)}>
          {user.nickname}
          <div className="date-release">{timeComment}</div>
        </div>
        <div className="comment-view">{comment}</div>
      </div >

      </>
    );
  } else {
  return null;
}
}

export default UserGet;






