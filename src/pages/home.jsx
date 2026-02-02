import React from "react";
import Carrousel from "../components/Carrousel/carrousel";
import ScrollImage from "../components/scroll-image/scroll-image";

const PAGE_ID = "home";

function Home() {
    return (
        <section className="page page--home" data-page={PAGE_ID} data-page-root>
            <div className="page-content" data-page-content>
                <ScrollImage />
                <Carrousel />
            </div>
        </section>
    );
}

export default Home;
