import React, { useLayoutEffect } from "react";
import StickyValue from "../components/StickyValue/sticky-value";
import ScrollShowcase from "../components/ScrollShowcase/scroll-showcase";
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
            <div className="h-20"></div>
            <div className="page-content" data-page-content>
                <StickyValue />
                <ScrollShowcase />
            </div>
        </section>
    );
}

export default Description;
