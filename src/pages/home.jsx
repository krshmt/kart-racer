import React from "react";
import Carrousel from "../components/Carrousel/carrousel";
import ScrollImage from "../components/scroll-image/scroll-image";
import Footer from "../components/Footer/footer";

function Home() {
    return (
        <>
            <ScrollImage />
            <Carrousel />
            <Footer />
        </>
    );
}

export default Home;