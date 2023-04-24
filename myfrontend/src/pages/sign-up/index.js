import React from "react";
import './styles.css'

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


    return (
        <>
            <center>

                <div className="container">
                    <div className="content-box">
                        <p className="title-page">Cadastre-se</p>
                        <div className="space-input">
                            <input className="content-input" placeholder="Nome completo" type="text" onChange={verifyName} />
                            <p id="alert-name" className="alert-name">O Nome completo não mais de 60 caracteres</p>
                        </div>
                        <div className="space-input">
                            <input className="content-input" placeholder="Username" type="text" />
                            <p id="alert-username" className="alert-username">Esse Username já foi cadastrado</p>
                        </div>
                        <div className="space-input">
                            <input className="content-input" placeholder="Email" type="text" />
                            <p id="alert-email" className="alert-email">Esse Email já foi cadastrado</p>
                        </div>
                        <div className="space-input">
                            <input className="content-input" type="date" />
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
                            <div id="button-simple" className="button-simple">
                                <p>Criar Conta</p>
                            </div>
                        </div>

                    </div>
                </div>
            </center>
        </>
    )
}

export default SignUp;