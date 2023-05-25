import React, { useState } from "react";
import "./styles.css";
import api from "../../api.js"
import { useNavigate } from "react-router-dom";
const SignUp = () => {
  const navigate = useNavigate();

  //Declaração das expressões regulares
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const data_nascimentoRegex = /^(19[1-9]\d|2000)-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,20}$/;

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
      errorMessage: "Insira uma data de nascimento válida, certifique-se de que a mesma está formatada de acordo",
      placeholder: "aaaa-mm-dd",
      label: "Data de Nascimento"
    },
    {
      id: 6,
      name: "senha",
      type: "password",
      errorMessage:
        "Sua senha precisa conter de 8 a 20 caracteres, e deve conter no mínimo um caractere especial, também como um caractere maiúsculo e um minúsculo",
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

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validação do formulário
    let isValid = true;

    const updatedValues = {};

    // Valida nome completo
    if (values.nome_completo.trim() === "") {
      isValid = false;
      updatedValues.nome_completo = "";
    }

    // Valida nome de usuário
    if (values.nome_de_usuario.trim() === "") {
      isValid = false;
      updatedValues.nome_de_usuario = "";
    }

    // Valida a bio
    if (values.bio.trim().length < 10 || values.bio.trim().length > 220) {
      isValid = false;
      updatedValues.bio = "";
    }

    // Valida o email
    if (values.email.trim() === "" || !emailRegex.test(values.email)) {
      isValid = false;
      updatedValues.email = "";
    }

    // Valida a data de nascimento
    if (values.data_nascimento.trim() === "" || !data_nascimentoRegex.test(values.data_nascimento)) {
      isValid = false;
      updatedValues.data_nascimento = "";
    }

    // Valida o campo de senha
    if (values.senha.trim() === "" || !passwordRegex.test(values.senha)) {
      isValid = false;
      updatedValues.senha = "";
    }
    //Validação se as senhas são iguais
    if (
      values.confirmar_senha.trim() === "" ||
      values.confirmar_senha !== values.senha
    ) {
      isValid = false;
      updatedValues.confirmar_senha = "";
    }

    if (isValid) {
      //colocar as informações
      //console.log(values)
      
      const data = {
        "full_name": values.nome_completo,
        "nickname": values.nome_de_usuario,
        "bio_text": values.bio,
        "birth_date": values.data_nascimento,
        "email": values.email,
        "password": values.senha,
        "super_reviewer": false
      }
      console.log(data)
      await api.post('/usuarios/', data, {
        headers: {
            'Content-Type': 'application/json'
        }
    });

    navigate('/login');

    } else {
      setSubmitted(true);
      setValues((prevValues) => ({
        ...prevValues,
        ...updatedValues
      }));
    }
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
              {submitted &&
                values[input.name].trim() === "" && (
                  <p className="alert-message">{input.errorMessage}</p>
                )}
              {submitted &&
                input.name === "email" &&
                (!emailRegex.test(values[input.name]) ||
                  values[input.name].trim() === "") && (
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