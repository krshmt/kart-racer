import React from "react";
import './styles.css';

function AdultCard(){
    return (
        <div className="card adult-card">
            <div className="adult-requirements">
                <span>un adulte</span>
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
                        <h4>20€</h4>
                    </div>
                </div>
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
                        <h4>20€</h4>
                    </div>
                </div>
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
                        <h4>20€</h4>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdultCard;