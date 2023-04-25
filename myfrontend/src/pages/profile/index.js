import React from 'react';
import './styles.css'
import Menu from '../../components/menu'

const Profile = () => {

    return (
        <>
        <Menu/>
            <center>
                <div className="container">
                    <div className="content-box-profile">
                        <div className="profile-info">
                            <img className="image-user" src="https://i.imgur.com/piVx6dg.png" />
                            <p className="name-user">untitled name</p>
                        </div>
                        <div className="tabs-profile">
                            <p className="tab-profile">Followers</p>
                            <p className="tab-profile">Following</p>
                            <p className="tab-profile">Críticas</p>
                        </div>
                    </div>
                </div>
            </center>
        </>
    )
}

export default Profile;