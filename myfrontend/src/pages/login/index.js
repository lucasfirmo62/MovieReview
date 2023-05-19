import React, { useState } from "react";
import './styles.css'
import api from '../../api'
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

import logotype from '../../assets/logotype.png';

const Login = () => {

    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginOption, setLoginOption] = useState(1);


    async function handleSubmit(event) {
        var loginError = false
        event.preventDefault();

        document.getElementById("alert-login-email").style.display = "none"
        document.getElementById("alert-login-pass").style.display = "none"


        if((document.getElementById('email-login').value.trim()) === ""){
            document.getElementById("alert-login-email").innerHTML = "Você não pode deixar o campo do email vazio"
            document.getElementById("alert-login-email").style.display = "block"
            loginError = true
        }

        if((document.getElementById('pass-login').value.trim()) === ""){
            document.getElementById("alert-login-pass").innerHTML = "Você não pode deixar o campo da senha vazio"
            document.getElementById("alert-login-pass").style.display = "block"
            loginError = true
        }

        if(loginError === true){
            return
        }

        switch (loginOption) {
            case '1':
                const data = {
                    email: email,
                    password: password
                }

                try {
                    const info_data = await api.post('/api/token/', data);
                    
                    localStorage.setItem('refreshTokenUser', JSON.stringify(info_data.data.refresh));
                    localStorage.setItem('tokenUser', JSON.stringify(info_data.data.access));
                    localStorage.setItem('idUser', JSON.stringify(info_data.data.id));
                    navigate(`/`)

                } catch (err) {
                    alert('Falha no login, tente novamente.');
                }
        }
    }

    return (
        <>
            <center>
                <div className="container">
                    <div className="content-box">
                        <form onSubmit={handleSubmit}>

                            <div className="img-block">
                                <img src={logotype} className="initial-logo"/>
                                <p className="title-page">Entrar</p>
                            </div>

                            <div className="space-input">
                                <input
                                    className="content-input"
                                    placeholder="Email"
                                    type="text"
                                    value={email}
                                    id="email-login"
                                    onChange={e => setEmail(e.target.value)}
                                />
                                <p className="alert-login-email" id="alert-login-email"></p>
                            </div>

                            <div className="space-input">
                                <input
                                    className="content-input"
                                    placeholder="Senha"
                                    type="password"
                                    value={password}
                                    id="pass-login"
                                    onChange={e => setPassword(e.target.value)}
                                />
                                <p className="alert-login-pass" id="alert-login-pass"></p>
                            </div>

                            <div className="space-input">
                                <button value={1} onClick={(e) => setLoginOption(e.currentTarget.value)} type="submit" className="button-simple">
                                    <p>Fazer Login</p>
                                </button>
                            </div>

                            <div className="space-input">
                                <p>Não tem uma conta? <Link className="initial-linker" to="/sign-up">Cadastre-se aqui!</Link></p>
                            </div>

                        </form>
                    </div>
                </div>
            </center>
        </>
    )
}

export default Login;