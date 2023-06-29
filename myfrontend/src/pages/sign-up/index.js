import React from "react";
import './styles.css'
import { Link } from 'react-router-dom';
import api from '../../api.js';

import { useNavigate } from 'react-router-dom';
import logotype from '../../assets/logotype.png';

const SignUp = () => {
    const navigate = useNavigate();

    async function verifyName(character) {
        if ((character.target.value.length > 240)) {
            document.getElementById("alert-name").innerHTML = "O campo precisa ter menos de 240 caracteres"
            document.getElementById("alert-name").style.display = "block"
            document.getElementById("button-simple").style.backgroundColor = "#ff51a8"
            document.getElementById("button-simple").style.cursor = "auto"
        } else {
            document.getElementById("alert-name").style.display = "none"
            document.getElementById("button-simple").style.backgroundColor = "#D30069"
            document.getElementById("button-simple").style.cursor = "pointer"
        }
    }

    async function verifyNickname(character) {
        if ((character.target.value.length > 55)) {
            document.getElementById("alert-username").innerHTML = "O campo precisa ter menos de 55 caracteres"
            document.getElementById("alert-username").style.display = "block"
            document.getElementById("button-simple").style.backgroundColor = "#ff51a8"
            document.getElementById("button-simple").style.cursor = "auto"
        } else {
            document.getElementById("alert-username").style.display = "none"
            document.getElementById("button-simple").style.backgroundColor = "#D30069"
            document.getElementById("button-simple").style.cursor = "pointer"
        }
    }

    async function verifyBio(character) {
        if ((character.target.value.length > 220)) {
            document.getElementById("alert-bio").innerHTML = "O campo precisa ter menos de 220 caracteres"
            document.getElementById("alert-bio").style.display = "block"
            document.getElementById("button-simple").style.backgroundColor = "#ff51a8"
            document.getElementById("button-simple").style.cursor = "auto"
        } else {
            document.getElementById("alert-bio").style.display = "none"
            document.getElementById("button-simple").style.backgroundColor = "#D30069"
            document.getElementById("button-simple").style.cursor = "pointer"
        }
    }

    async function verifyEmail(character) {
        if ((character.target.value.length > 100)) {
            document.getElementById("alert-email").innerHTML = "O campo precisa ter menos de 100 caracteres"
            document.getElementById("alert-email").style.display = "block"
            document.getElementById("button-simple").style.backgroundColor = "#ff51a8"
            document.getElementById("button-simple").style.cursor = "auto"
        } else {
            document.getElementById("alert-email").style.display = "none"
            document.getElementById("button-simple").style.backgroundColor = "#D30069"
            document.getElementById("button-simple").style.cursor = "pointer"
        }
    }

    async function verifyPass(character) {
        if (character.target.value != document.getElementById("confirmPass").value) {
            document.getElementById("alert-password").style.display = "block"
        } else {
            document.getElementById("alert-password").style.display = "none"
            document.getElementById("button-simple").style.backgroundColor = "#D30069"
            document.getElementById("button-simple").style.cursor = "pointer"
        }

        if (character.target.value.length < 7) {
            document.getElementById("alert-password-caracters").style.display = "block"
        } else {
            document.getElementById("alert-password-caracters").style.display = "none"
            document.getElementById("button-simple").style.backgroundColor = "#D30069"
            document.getElementById("button-simple").style.cursor = "pointer"
        }
    }

    // ele não pode enviar com os campos em branco 
    // nenhum campo pode passar do limite de caracteres
    // a verificação foi feita mas mesmo com erro ela passa e envia os dados e mesmo faltando campos.
    // campos required: full_name, nickname, birth_date, email e password

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return(emailRegex.test(email));
      };

    async function newUser() {
        const full_name = document.getElementById('name').value.trim();
        const nickname = document.getElementById('username').value.trim();
        const bio_text = document.getElementById('user-bio').value.trim();
        const birth_date = document.getElementById('date-born').value.trim();
        const email = document.getElementById('email').value.trim();
        const firstPassword = document.getElementById("firstPassword").value
        const password = document.getElementById('confirmPass').value

        document.getElementById("alert-name").style.display = "none"
        document.getElementById("alert-username").style.display = "none"
        document.getElementById("alert-date").style.display = "none"
        document.getElementById("alert-password").style.display = "none"
        document.getElementById("alert-email").style.display = "none"

        let errors = [];

        if (full_name === "") {
            errors.push("Preencha este campo com seu nome completo");
            document.getElementById("alert-name").innerHTML = "Preencha seu nome completo"
            document.getElementById("alert-name").style.display = "block"
        }
        if (nickname === "") {
            errors.push("Preencha este campo com um nome de usuário");
            document.getElementById("alert-username").innerHTML = "Preencha seu nome de usuário"
            document.getElementById("alert-username").style.display = "block"
        }
        if (birth_date === "") {
            errors.push("Preencha sua data de nascimento");
            document.getElementById("alert-date").innerHTML = "Preencha sua data de nascimento"
            document.getElementById("alert-date").style.display = "block"
        }
        if (password === "" || firstPassword === "") {
            errors.push("Senhas não coincidem");
            document.getElementById("alert-password").innerHTML = "Senhas não coincidem"
            document.getElementById("alert-password").style.display = "block"
        }
        if (password !== firstPassword) {
            errors.push("Senhas não coincidem");
            document.getElementById("alert-password").innerHTML = "Senhas não coincidem"
            document.getElementById("alert-password").style.display = "block"
        }
        if (validateEmail(email) === false) {
            errors.push("Digite um email válido");
            document.getElementById("alert-email").innerHTML = "Digite um email válido"
            document.getElementById("alert-email").style.display = "block"
        }
        if (full_name.length > 60 || nickname.length > 60 || email.length > 60 || password.length > 60) {
            errors.push("Alguns campos excederam o limite máximo de caracteres (60).");
        }
        if (password.length < 7) {
            errors.push("A senha deve ter no mínimo 7 caracteres.");
        }

        const currentDate = new Date();
        const selectedDate = new Date(birth_date);

        if (selectedDate > currentDate) {
            errors.push("A data de nascimento não pode ser maior que a data atual.");
            document.getElementById("alert-date").innerHTML = "Preencha uma data válida"
            document.getElementById("alert-date").style.display = "block"
        }

        if (errors.length > 0) {
            const errorMessage = errors.join("\n");
            alert(errorMessage);
            return;
        }

        const data = {
            "full_name": full_name,
            "nickname": nickname,
            "bio_text": bio_text,
            "birth_date": birth_date,
            "email": email,
            "super_reviewer": false,
            "password": password
        };

        try {
            await api.post('/usuarios/', data);

            navigate('/login');

        } catch (error) {
            if (error.response.data.email) {
                document.getElementById("alert-email").style.display = "block"
            }
            if (error.response.data.nickname) {
                document.getElementById("alert-username").style.display = "block"
            }
        }
    }

    return (
        <>
            <center>

                <div className="container">
                    <div className="content-box">
                        <div className="img-block">
                            <img src={logotype} className="initial-logo"/>
                            <p className="title-page">Cadastre-se</p>
                        </div>

                        <div className="space-input">
                            <input className="content-input" id="name" placeholder="Nome completo" type="text" onChange={verifyName} />
                            <p id="alert-name" className="alert-name">O Nome completo não pode ter mais de 60 caracteres</p>
                        </div>

                        <div className="space-input">
                            <input className="content-input" id="username" placeholder="Username" type="text" onChange={verifyNickname} />
                            <p id="alert-username" className="alert-username">O Username não pode ter mais de 60 caracteres</p>
                        </div>

                        <div className="space-input">
                            <input className="content-input" id="user-bio" placeholder="Sobre você" type="text" onChange={verifyBio}/>
                            <p className="alert-bio" id="alert-bio"></p>
                        </div>

                        <div className="space-input">
                            <input className="content-input" id="email" placeholder="Email" type="text" onChange={verifyEmail}/>
                            <p id="alert-email" className="alert-email">Esse Email já foi cadastrado</p>
                        </div>

                        <div className="space-input">
                            <input className="content-input" id="date-born" type="date" />
                            <p id="alert-date" className="alert-date"></p>
                        </div>

                        <div className="input-several">
                            <div className="password-side">
                                <input id="firstPassword" className="content-input-half" placeholder="Senha" type="password" />
                            </div>
                            <div className="password-side">
                                <input id="confirmPass" className="content-input-half" placeholder="Confirmar senha" type="password" onChange={verifyPass} />
                            </div>
                        </div>

                        <p id="alert-password" className="alert-password">Senhas não coincidem</p>
                        <p id="alert-password-caracters" className="alert-password-caracters">A senha precisa ter mais de 7 caracteres</p>

                        <div className="space-input">
                            <button id="button-simple" onClick={newUser} className="button-simple">
                                <p>Criar Conta</p>
                            </button>
                        </div>

                        <div className="space-input">
                            <p>Já tem uma conta? <Link className="initial-linker" to="/login">Entrar aqui!</Link></p>
                        </div>

                    </div>
                </div>
            </center>
        </>
    )
}

export default SignUp;