import React, { useLayoutEffect } from "react";
import Carrousel from "../components/Carrousel/carrousel";
import { playEnterFade } from "../animations/page-transition";

const PAGE_ID = "description";

function Description() {
    useLayoutEffect(() => {
        playEnterFade();
    }, []);

    return (
        <section
            className="page page--description"
            data-page={PAGE_ID}
            data-page-root
        >
            <div className="page-content" data-page-content>
                <Carrousel />
            </div>
        </section>
    );
}

export default Description;
