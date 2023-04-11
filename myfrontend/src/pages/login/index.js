import React, {useState} from "react";
import './styles.css'

import { Link } from 'react-router-dom';

const Login = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    async function handleSubmit(event) {
        event.preventDefault();
        
    }
    
    return (
        <>
            <center>
                <div className="container">
                    <div className="content-box">
                        <form onSubmit={handleSubmit}>

                            <p className="title-page">Entrar</p>

                            <div className="space-input">
                                <input
                                    className="content-input"
                                    placeholder="Email"
                                    type="text"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                />
                            </div>

                            <div className="space-input">
                                <input
                                    className="content-input"
                                    placeholder="Senha"
                                    type="password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                />
                            </div>

                            <div className="space-input">
                                <button type="submit" className="button-simple">
                                    <p>Criar Conta</p>
                                </button>
                            </div>

                            <div className="space-input">
                                <p>Não tem uma conta? <Link to="/signup">Se cadastre aqui!</Link></p>
                            </div>

                        </form>
                    </div>
                </div>
            </center>
        </>
    )
}

export default Login;