import React from "react";
import './styles.css';

function AdultCard(){
    return (
        <div className="card adult-card fond-blue">
            <div className="adult-requirements">
                <span>un adulte</span>
                <div className="requirements blue-bg">
                    <span>15 ans & 1.55m</span>
                    <span>Minimum</span>
                </div>
            </div>
            <div className="card-title">
                <h3>Avec la carte</h3>
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
                        <h4>19€</h4>
                    </div>
                </div>
                <div className="price">
                    <div className="duration">
                        <div className="duration-minute">
                            <span>8x2</span>
                            <span>Minutes</span>
                            <span>Formule Qualification</span>
                        </div>
                        <div className="line">
                            <div></div>
                        </div>
                    </div>
                    <div className="session-amount">
                        <h4>Deux sessions</h4>
                        <h4>35€</h4>
                    </div>
                </div>
                <div className="price">
                    <div className="duration">
                        <div className="duration-minute">
                            <span>8x3</span>
                            <span>Minutes</span>
                            <span>Pro Kart</span>
                        </div>
                        <div className="line">
                            <div></div>
                        </div>
                    </div>
                    <div className="session-amount">
                        <h4>Trois sessions</h4>
                        <h4>49€</h4>
                    </div>
                </div>
                <div className="price">
                    <div className="duration">
                        <div className="duration-minute">
                            <span>8x5</span>
                            <span>Minutes</span>
                            <span>Marathon Kart</span>
                        </div>
                        <div className="line">
                            <div></div>
                        </div>
                    </div>
                    <div className="session-amount">
                        <h4>Cinq sessions</h4>
                        <h4>75€</h4>
                    </div>
                </div>
                <div className="price">
                    <div className="duration">
                        <div className="duration-minute">
                            <span>8</span>
                            <span>Minutes</span>
                            <span>Tarif réduit les lundis</span>
                        </div>
                        <div className="line">
                            <div></div>
                        </div>
                    </div>
                    <div className="session-amount">
                        <h4>Une session</h4>
                        <h4>15€</h4>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdultCard;