import React, { useState } from "react";
import "./styles.css";
import { Link } from "react-router-dom";

const SignUp = () => {
  const [values, setValues] = useState({
    nome_completo: "",
    nome_de_usuario: "",
    bio: "",
    email: "",
    data_nascimento: "",
    senha: "",
    confirmar_senha: ""
  });

  const inputs = [
    {
      id: 1,
      name: "nome_completo",
      type: "text",
      errorMessage: "Por favor, inclua o seu nome completo.",
      placeholder: "Nome completo",
      label: "Nome completo"
    },
    {
      id: 2,
      name: "nome_de_usuario",
      type: "text",
      errorMessage:
        "O nome de usuário precisa ter entre 3 e 16 caracteres, sem conter caracteres especiais.",
      placeholder: "Nome de usuário",
      label: "Nome de usuário"
    },
    {
      id: 3,
      name: "bio",
      type: "text",
      errorMessage: "Sua bio deve ter entre 10 e 240 caracteres.",
      placeholder: "Sobre você",
      label: "Sobre você"
    },
    {
      id: 4,
      name: "email",
      type: "email",
      errorMessage: "Inclua um endereço de email válido.",
      placeholder: "Email",
      label: "Email"
    },
    {
      id: 5,
      name: "data_nascimento",
      type: "text",
      errorMessage: "Insira uma data de nascimento válida",
      placeholder: "Data de Nascimento",
      label: "Data de Nascimento"
    },
    {
      id: 6,
      name: "senha",
      type: "password",
      errorMessage:
        "Sua senha precisa conter de 8 à 20 caracteres, e deve conter no mínimo um caractere especial, também como um caractere maiúsculo e um minúsculo",
      placeholder: "Senha",
      label: "Senha"
    },
    {
      id: 7,
      name: "confirmar_senha",
      type: "password",
      errorMessage: "As senhas não conferem!",
      placeholder: "Confirme a senha",
      label: "Confirme a senha"
    }
  ];

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

  };

  return (
    <div className="container">
      <div className="content-box">
        <div className="img-block">
          <h1 className="title-page">Registre-se!</h1>
        </div>
        <form onSubmit={handleSubmit}>
          {inputs.map((input) => (
            <div className="input-row" key={input.id}>
              <label className="input-label">{input.label}</label>
              <input
                className="input-field"
                type={input.type}
                name={input.name}
                value={values[input.name]}
                onChange={handleChange}
                placeholder={input.placeholder}
              />
              {values[input.name] === "" && (
                <p className="alert-message">{input.errorMessage}</p>
              )}
            </div>
          ))}
          <button className="button-simple" type="submit">
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;