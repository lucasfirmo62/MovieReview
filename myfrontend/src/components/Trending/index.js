import React from "react";
import './styles.css';

const Trending = () => {

    return(
        <>
            <div className="trending-content">
                <h2>Super Críticos</h2>
                <div className="trending-item">
                    <img className="image-user" alt="user" src={"https://i.pinimg.com/550x/ef/f3/db/eff3dbf3ddb97b7232e742a97206cc93.jpg"} />
                    <p>Lucas Lima</p>
                </div>
                <div className="trending-item">
                    <img className="image-user" alt="user" src={"https://i.pinimg.com/550x/ef/f3/db/eff3dbf3ddb97b7232e742a97206cc93.jpg"} />
                    <p>Diego Alves</p>
                </div>
                <div className="trending-item">
                    <img className="image-user" alt="user" src={"https://i.pinimg.com/550x/ef/f3/db/eff3dbf3ddb97b7232e742a97206cc93.jpg"} />
                    <p>Neymar Junior</p>
                </div>
                <div className="trending-item">
                    <img className="image-user" alt="user" src={"https://i.pinimg.com/736x/fd/fc/ef/fdfcefc24e58a4e3ed4dd6099d530353.jpg"} />
                    <p>Diego Alves</p>
                </div>
                <div className="trending-item">
                    <img className="image-user" alt="user" src={"https://i.pinimg.com/736x/fd/fc/ef/fdfcefc24e58a4e3ed4dd6099d530353.jpg"} />
                    <p>Neymar Junior</p>
                </div>
                <div className="trending-item final">
                    <p>Ver mais...</p>
                </div>
            </div>
        </>
    )
}

export default Trending;