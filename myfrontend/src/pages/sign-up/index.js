import React from "react";
import './styles.css'
import { Link } from 'react-router-dom';
import api from '../../api.js';

const SignUp = () => {


    async function verifyName(character) {
        if ((character.target.value.length > 60)) {
            document.getElementById("alert-name").style.display = "block"
            document.getElementById("button-simple").style.backgroundColor = "#ff51a8"
            document.getElementById("button-simple").style.cursor = "auto"
        } else {
            document.getElementById("alert-name").style.display = "none"
            document.getElementById("button-simple").style.backgroundColor = "#D30069"
            document.getElementById("button-simple").style.cursor = "pointer"
        }
    }

    async function verifyPass(character) {
        if (character.target.value != document.getElementById("password").value) {
            document.getElementById("alert-password").style.display = "block"
            document.getElementById("button-simple").style.backgroundColor = "#ff51a8"
            document.getElementById("button-simple").style.cursor = "auto"
        } else {
            document.getElementById("alert-password").style.display = "none"
            document.getElementById("button-simple").style.backgroundColor = "#D30069"
            document.getElementById("button-simple").style.cursor = "pointer"
        }

        if (character.target.value.length < 7) {
            document.getElementById("alert-password-caracters").style.display = "block"
            document.getElementById("button-simple").style.backgroundColor = "#ff51a8"
            document.getElementById("button-simple").style.cursor = "auto"
        } else {
            document.getElementById("alert-password-caracters").style.display = "none"
            document.getElementById("button-simple").style.backgroundColor = "#D30069"
            document.getElementById("button-simple").style.cursor = "pointer"
        }
    }

    async function testBorn(){
        console.log(document.getElementById('date-born').value)
    }

    async function newUser() {
        var full_name = document.getElementById('name').value
        var nickname = document.getElementById('username').value
        var bio_text = document.getElementById('user-bio').value
        var birth_date = document.getElementById('date-born').value
        var email = document.getElementById('email').value
        var password = document.getElementById('confirmPass').value

        const data = {
            "full_name": full_name,
            "nickname": nickname,
            "bio_text": bio_text,
            "birth_date": birth_date,
            "email": email,
            "super_reviewer": false,
            "password": password
          };
          
          api.post('/usuarios/', data, {
            headers: {
              'Content-Type': 'application/json'
            }
          })
          .then(response => {
            console.log('Usuário criado com sucesso!');
          })
          .catch(error => {
            console.log('Erro ao criar usuário:', error);
          });

    }


    return (
        <>
            <center>

                <div className="container">
                    <div className="content-box">
                        <p className="title-page">Cadastre-se</p>
                        <div className="space-input">
                            <input className="content-input" id="name" placeholder="Nome completo" type="text" onChange={verifyName} />
                            <p id="alert-name" className="alert-name">O Nome completo não mais de 60 caracteres</p>
                        </div>
                        <div className="space-input">
                            <input className="content-input" id="username" placeholder="Username" type="text" />
                            <p id="alert-username" className="alert-username">Esse Username já foi cadastrado</p>
                        </div>
                        <div className="space-input">
                            <input className="content-input" id="user-bio" placeholder="Sobre você" type="text" />
                        </div>
                        <div className="space-input">
                            <input className="content-input" id="email" placeholder="Email" type="text" />
                            <p id="alert-email" className="alert-email">Esse Email já foi cadastrado</p>
                        </div>
                        <div className="space-input">
                            <input className="content-input" id="date-born" type="date" />
                            <p id="alert-date" className="alert-date">Este site apenas maiore de 13 anos</p>
                        </div>
                        <div className="input-several">
                            <div className="password-side">
                                <input id="password" className="content-input-half" placeholder="Senha" type="password" />
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
                            <p>Já tem uma conta?</p><Link to="/login">Entrar aqui!</Link>
                        </div>

                    </div>
                </div>
            </center>
        </>
    )
}

export default SignUp;