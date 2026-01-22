import React from "react";

function FormuleCard(){
    return (
        <div className="card adult-card formule-card">
            <div className="adult-requirements">
                <span>un adulte</span>
                <div className="requirements blue-bg">
                    <span>Imprimer invitation</span>
                </div>
            </div>
            <div className="card-title">
                <h3>Seulement sur réservation</h3>
            </div>
            <div className="prices">
                <div className="price">
                    <div className="duration">
                        <div className="duration-minute">
                            <span>10 minutes de qualifications</span>
                            <span>Course sur 20 tours</span>
                            <span>8 pilotes minimum</span>
                        </div>
                        <div className="line">
                            <div></div>
                        </div>
                    </div>
                    <div className="session-amount">
                        <h4>Enterrement vie de garçon/fille</h4>
                        <h4>45€/pilote</h4>
                    </div>
                </div>
                <div className="price">
                    <div className="duration">
                        <div className="duration-minute">
                            <span>10 minutes de qualifications</span>
                            <span>Course sur 15 tours</span>
                            <span>5 pilotes minimum</span>
                        </div>
                        <div className="line">
                            <div></div>
                        </div>
                    </div>
                    <div className="session-amount">
                        <h4>Grand prix anniversaire enfant</h4>
                        <h4>35€/pilote</h4>
                    </div>
                </div>
                <div className="price">
                    <div className="duration">
                        <div className="duration-minute">
                            <span>10 minutes d'essais 10 minutes de qualifications</span>
                            <span>Course sur 15 tours</span>
                            <span>8 pilotes minimum</span>
                        </div>
                        <div className="line">
                            <div></div>
                        </div>
                    </div>
                    <div className="session-amount">
                        <h4>Formule grand prix</h4>
                        <h4>60€/pilote</h4>
                    </div>
                </div>
                <div className="price">
                    <div className="duration">
                        <div className="duration-minute">
                            <span>10 minutes de qualifications</span>
                            <span>Course de 40 minutes en équipe</span>
                            <span>12 pilotes minimum</span>
                        </div>
                        <div className="line">
                            <div></div>
                        </div>
                    </div>
                    <div className="session-amount">
                        <h4>Grand Endurance</h4>
                        <h4>62€/pilote</h4>
                    </div>
                </div>
            </div>
            <div className="en-savoir-plus">
                <div className="savoir-title">
                    <span>Bénéfices</span>
                </div>
                <div className="avantages">
                    <div className="avantage">
                        <span>Exclusivité</span> <p>de la piste</p>
                    </div>
                    <div className="avantage">
                        <span>Remise</span> <p>des médailles sur le podium</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FormuleCard;