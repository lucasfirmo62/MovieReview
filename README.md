# Rede Social

<img alt="license" src="https://img.shields.io/badge/license-not%20specified-blue">

O seguinte projeto é uma Rede Social proposta para a disciplina de Projeto Integrador e Engenharia de Software 1. 

# Backend

## Como executar o backend

Para executar o ambiente, você deve instalar as dependências, para isso crie um ambiente virtual e o acesse:

`python -m venv env`
`source env/bin/activate`

Para instalar as dependências listadas no arquivo requirements.txt:

`pip install -r requirements.txt`

Depois disso, é necessário executar o comando `python manage.py makemigrations` para criar as migrações do banco de dados e, em seguida, o comando `python manage.py migrate` para aplicar essas migrações ao banco de dados.

Crie um arquivo .env na raíz do projeto e adicione o id e o secret do cliente IMGUR:

`IMGUR_CLIENT_ID=f16556a543b91b9`

`IMGUR_CLIENT_SECRET=d7ea2c62ff008947fd20caec7c1cf6ddaa0b73db`

Para executar o backend:

`python manage.py runserver`

Para poder executar os testes do backend é utilizado o seguinte comando:

`python manage.py test`

# Frontend

## Como executar o frontend

Primeiro, entre na pasta do frontend.

`cd myfrontend`

Instale as dependências.

`npm install`

Crie um arquivo .env na raíz do projeto e adicione a chave da API do TMDB:

`REACT_APP_TMDB_API_KEY=91e9bea62105d3ed0765acbbd25020bd`

Por fim, execute o projeto.

`npm start`

## :mortar_board: Autores

<center>
<table><tr>

<td align="center"><a href="https://github.com/lucasfirmo62">
	<img style="border-radius: 50%;" src="https://avatars.githubusercontent.com/u/58527718?v=4" width="100px;" alt=""/>
<br />
	<b>Lucas Firmo</b></a>
<br />
	RA: 2171465

<td align="center"><a href="https://github.com/patriarka">
	<img style="border-radius: 50%;" src="https://avatars.githubusercontent.com/u/53534886?v=4" width="100px;" alt=""/>
<br />
	<b>Matheus Patriarca</b></a> 
<br />
	RA: 2171481

<td align="center"><a href="https://github.com/gustavofavaro">
	<img style="border-radius: 50%;" src="https://avatars.githubusercontent.com/u/54089418?v=4" width="100px;" alt=""/>
<br />
	<b>Gustavo Favaro</b></a> 
<br />
	RA: 2149354

<td align="center"><a href="https://github.com/matchur">
	<img style="border-radius: 50%;" src="https://avatars.githubusercontent.com/u/22385995?v=4" width="100px;" alt=""/>
<br />
	<b>Matheus Vinicius</b></a> 
<br />
	RA: 2216973

<td align="center"><a href="https://github.com/Mazner">
	<img style="border-radius: 50%;" src="https://avatars.githubusercontent.com/u/49240709?v=4" width="100px;" alt=""/>
<br />
	<b>Marcos Rampaso</b></a>
<br />
	RA: 2149435
</tr></table>

</center>
