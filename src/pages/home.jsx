import React from "react";
import Carrousel from "../components/Carrousel/carrousel";
import ScrollImage from "../components/scroll-image/scroll-image";

function Home() {
    return (
        <>
            <ScrollImage />
            <Carrousel />
            <div className="h-25"></div>
        </>
    );
}

export default Home;