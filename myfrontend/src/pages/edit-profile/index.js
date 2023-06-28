import React, { useState, useEffect } from 'react'
import './styles.css'
import Menu from '../../components/menu'
import Header from '../../components/header'
import HeaderDesktop from "../../components/headerDesktop";
import ImageUpload from '../../components/ImageUpload';

import api from '../../api';

import { useNavigate } from 'react-router-dom';

import { FaCheck } from 'react-icons/fa';

const EditProfile = () => {
    const navigate = useNavigate()

    const [selectedFile, setSelectedFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [minLoadingTimePassed, setMinLoadingTimePassed] = useState(true);
    const [showConfirmation, setShowConfirmation] = useState(false);

    const [user, setUser] = useState({
        full_name: '',
        nickname: '',
        bio_text: ''
    });

    useEffect(() => {
        let id = localStorage.getItem('idUser')

        id = id.substring(1, id.length - 1)

        const fetchUser = async () => {
            try {
                const response = await api.get(`/usuarios/${id}/`);

                setUser({
                    full_name: response.data.full_name,
                    nickname: response.data.nickname,
                    bio_text: response.data.bio_text,
                    profile_image: response.data.profile_image
                });

            } catch (error) {
                console.error('Erro ao carregar os dados do usuário:', error);
            }
        };
        fetchUser();
    }, [])

    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function handleSaveChanges() {
        let id = localStorage.getItem('idUser')
        let token = localStorage.getItem('tokenUser')

        id = id.substring(1, id.length - 1)
        token = token.substring(1, token.length - 1)

        const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' };

        if (!user.full_name || !user.nickname || !user.bio_text) {
            alert("Por favor, preencha todos os campos");
            return;
        }

        const formData = new FormData();

        setIsLoading(true);

        formData.append('profile_image', selectedFile);

        Object.entries(user).forEach(([key, value]) => {
            console.log(key, value)
            if (key !== "profile_image")
                formData.append(key, value);
        });

        try {
            api.patch(`/usuarios/${id}/`, formData, { headers })

            setMinLoadingTimePassed(false);

            await delay(2000);

            setMinLoadingTimePassed(true);

            setIsLoading(false);
            setShowConfirmation(true);

            await delay(2000);

            setShowConfirmation(false);

            navigate('/profile')
        } catch (error) {
            console.error('Erro ao atualizar os dados do usuário:', error);

        }          
    };

return (
    <>
        {(window.innerWidth > 760) ?
            <HeaderDesktop />
            :

            <Header />
        }
        <div className="content-all">
            {(isLoading || !minLoadingTimePassed) ? (
                <div className="loading-overlay">
                    <div className="loading-indicator"></div>
                </div>
            ) : showConfirmation ? (
                <div className="confirmation-overlay">
                    <div className="confirmation-icon">
                        <FaCheck size={32} color="green" />
                    </div>
                </div>
            ) : null}

            <div className="left-content">
                <Menu />
            </div>
            <div className="content-box-profile">
                <div className='content-edit-space'>
                    <h2>Editar Perfil</h2>

                    <div className="conf-profile">
                        <div className='row'>
                            <p>Seu nome</p>
                            <input maxLength={240} placeholder={user.full_name} id='name' className="content-input-edit" value={user.full_name} onChange={(event) => setUser({ ...user, full_name: event.target.value })} />
                        </div>
                        <div className='row'>
                            <p>Seu username</p>
                            <input maxLength={55} placeholder={user.nickname} id='username' className="content-input-edit" value={user.nickname} onChange={(event) => setUser({ ...user, nickname: event.target.value })} />
                        </div>
                        <div className='row'>
                            <p>Sobre você</p>
                            <textarea maxLength={220} placeholder={user.bio_text} id="w3review" rows="4" cols="50" className="content-input-edit" value={user.bio_text} onChange={(event) => setUser({ ...user, bio_text: event.target.value })}> </textarea>
                        </div>
                        <div className='row image-field'>
                            <div className='image-block'>
                                <p>Alterar Avatar</p>
                                {!selectedFile && (<img className="image-user" alt='image-user' src={user?.profile_image ? user?.profile_image : "https://i.imgur.com/piVx6dg.png"} style={{ objectFit: "cover" }} />)}
                            </div>

                            <ImageUpload
                                selectedFile={selectedFile}
                                setSelectedFile={setSelectedFile}
                            />
                        </div>
                    </div>
                    <button className='button-simple' onClick={handleSaveChanges}><p>Concluir alterações</p></button>
                </div>
            </div>
            <div className="right-content">

            </div>
        </div>
    </>
)
}

export default EditProfile;