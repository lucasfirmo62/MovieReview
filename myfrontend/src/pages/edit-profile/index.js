import './styles.css'
import Menu from '../../components/menu'
import Header from '../../components/header'

const EditProfile = () => {


    return (
        <>
            <Header />
            <div className="content-all">
                <div className="left-content">
                    <Menu />
                </div>
                <div className="content-box-profile">
                    <div className='content-edit-space'>
                        <div className="profile-info">
                            <img className="image-user" alt='user' src="https://i.imgur.com/piVx6dg.png" />
                            <p className="name-user">untitled name</p>
                        </div>
                        <h2>Editar Perfil</h2>
                        <div className="conf-profile">
                            <div className='row'>
                                <p>Seu nome</p>
                                <input placeholder='untitled name' id='name' className="content-input-edit" />
                            </div>
                            <div className='row'>
                                <p>Seu username</p>
                                <input placeholder='untitled username' id='username' className="content-input-edit" />
                            </div>
                            <div className='row'>
                                <p>Sobre você</p>
                                <textarea placeholder="about user" id="w3review" rows="4" cols="50" className="content-input-edit"> </textarea>
                            </div>
                        </div>
                        <button className='button-simple'><p>Concluir alterações</p></button>
                    </div>
                </div>
                <div className="right-content">

                </div>
            </div>
        </>
    )
}

export default EditProfile;