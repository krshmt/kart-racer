import React from "react";

function TeenagerCard(){
    return (
        <div className="card adult-card fond-dark">
            <div className="adult-requirements">
                <span>un enfant</span>
                <div className="requirements blue-bg">
                    <span>15 ans & 1.55m</span>
                    <span>Minimum</span>
                </div>
            </div>
            <div className="card-title">
                <h3>Sans la carte</h3>
            </div>
            <div className="prices">
                <div className="price">
                    <div className="duration">
                        <div className="duration-minute">
                            <span>8</span>
                            <span>Minutes</span>
                        </div>
                        <div className="line">
                            <div></div>
                        </div>
                    </div>
                    <div className="session-amount">
                        <h4>Une session</h4>
                        <h4>18€</h4>
                    </div>
                </div>
            </div>
            <div className="en-savoir-plus">
                <div className="savoir-title">
                    <span>En</span><span>savoir plus</span><span>Carte Accès Piste</span>
                </div>
                <h4>Pourquoi prendre l'accès piste ?</h4>
                <div className="avantages">
                    <div className="avantage">
                        <span>5€</span> <p>Pour un maximum d'avantages</p>
                    </div>
                    <div className="avantage">
                        <span>17€</span> <p>Pour une session de 8 minutes</p>
                    </div>
                    <div className="avantage">
                        <span>15€</span> <p>Disponible tout les lundis pour une session de 8 minutes</p>
                    </div>
                    <div className="avantage">
                        <span>Votre anniversaire</span> <p>1 session offerte pour une achetée</p>
                    </div>
                    <div className="avantage">
                        <span>Résultat</span> <p>par email</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TeenagerCard;