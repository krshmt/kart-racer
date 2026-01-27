import React, { useEffect, useRef } from "react";
import { FaFacebookSquare } from "react-icons/fa";
import { AiFillInstagram } from "react-icons/ai";
import "./styles.css";

const horaires = [
    { jour: "Lundi", heure: "16h-22h30" },
    { jour: "Mardi", heure: "17h-22h30" },
    { jour: "Mercredi", heure: "15h-22h30" },
    { jour: "Jeudi", heure: "17h-00h00" },
    { jour: "Vendredi", heure: "17h-01h00" },
    { jour: "Samedi", heure: "14h-02h00" },
    { jour: "Dimanche", heure: "14h-19h00" },
];

function Footer() {
    const shaderCanvasRef = useRef(null);

    useEffect(() => {
        const container = shaderCanvasRef.current;
        if (!container) return undefined;

        if (document.fonts && document.fonts.load) {
            document.fonts.load('400 16px "HafferXH-Bold"');
        }

        let scene;
        let camera;
        let renderer;
        let planeMesh;
        let animationId;
        let resizeObserver;
        let isCancelled = false;

        let easeFactor = 0.02;
        let mousePosition = { x: 0.5, y: 0.5 };
        let targetMousePosition = { x: 0.5, y: 0.5 };
        let prevPosition = { x: 0.5, y: 0.5 };

        const vertexShader = `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `;

        const fragmentShader = `
            varying vec2 vUv;
            uniform sampler2D u_texture;
            uniform vec2 u_mouse;
            uniform vec2 u_prevMouse;

            void main() {
                float gridSize = 260.0;
                vec2 gridUV = floor(vUv * vec2(gridSize, gridSize)) / vec2(gridSize, gridSize);
                vec2 centerOfPixel = gridUV + vec2(1.0/gridSize, 1.0/gridSize);

                vec2 mouseDirection = u_mouse - u_prevMouse;

                vec2 pixelToMouseDirection = centerOfPixel - u_mouse;
                float pixelDistanceToMouse = length(pixelToMouseDirection);
                float strength = smoothstep(0.2, 0.0, pixelDistanceToMouse);

                vec2 uvOffset = strength * -mouseDirection * 0.15;
                vec2 uv = vUv - uvOffset;

                vec4 color = texture2D(u_texture, uv);
                gl_FragColor = color;
            }
        `;

        const loadThree = () =>
            new Promise((resolve, reject) => {
                if (window.THREE) {
                    resolve(window.THREE);
                    return;
                }

                const script = document.createElement("script");
                script.src =
                    "https://cdnjs.cloudflare.com/ajax/libs/three.js/0.155.0/three.min.js";
                script.async = true;
                script.onload = () => resolve(window.THREE);
                script.onerror = () => reject(new Error("THREE_LOAD_FAILED"));
                document.body.appendChild(script);
            });

        const getContainerSize = () => {
            const rect = container.getBoundingClientRect();
            return {
                width: Math.max(1, rect.width),
                height: Math.max(1, rect.height),
            };
        };

        const createTextTexture = (
            THREE,
            text,
            font,
            size,
            color,
            fontWeight,
            width,
            height
        ) => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            const safeWidth = Math.max(width, window.innerWidth);
            const safeHeight = Math.max(height, window.innerHeight);
            const canvasWidth = Math.max(1, safeWidth) * 2;
            const canvasHeight = Math.max(1, safeHeight) * 2;

            canvas.width = canvasWidth;
            canvas.height = canvasHeight;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const fontSize = size || Math.floor(canvasWidth * 2);

            ctx.fillStyle = color || "#000000";
            ctx.font = `${fontWeight || "400"} ${fontSize}px "${font || "HafferXH-Bold"}"`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";

            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = "high";

            const displayText = String(text).toUpperCase();
            const textMetrics = ctx.measureText(displayText);
            const textWidth = textMetrics.width;

            const scaleFactor = Math.min(1, canvasWidth / textWidth);
            const aspectCorrection = canvasWidth / canvasHeight;

            ctx.setTransform(
                scaleFactor,
                0,
                0,
                scaleFactor / aspectCorrection,
                canvasWidth / 2,
                canvasHeight / 2
            );

            ctx.fillText(displayText, 0, 0);

            const texture = new THREE.CanvasTexture(canvas);
            texture.minFilter = THREE.LinearFilter;
            texture.magFilter = THREE.LinearFilter;
            texture.generateMipmaps = false;
            return texture;
        };

        const initScene = (THREE) => {
            const { width, height } = getContainerSize();

            scene = new THREE.Scene();

            const aspectRatio = width / height;
            camera = new THREE.OrthographicCamera(
                -1,
                1,
                1 / aspectRatio,
                -1 / aspectRatio,
                0.1,
                1000
            );
            camera.position.z = 1;

            const texture = createTextTexture(
                THREE,
                "kartracer",
                "HafferXH-Bold",
                null,
                "#000000",
                "400",
                width,
                height
            );

            const shaderUniforms = {
                u_mouse: { type: "v2", value: new THREE.Vector2() },
                u_prevMouse: { type: "v2", value: new THREE.Vector2() },
                u_texture: { type: "t", value: texture },
            };

            planeMesh = new THREE.Mesh(
                new THREE.PlaneGeometry(2, 2),
                new THREE.ShaderMaterial({
                    uniforms: shaderUniforms,
                    vertexShader,
                    fragmentShader,
                    transparent: true,
                })
            );

            scene.add(planeMesh);

            renderer = new THREE.WebGLRenderer({ antialias: true });
            renderer.setClearColor(0xffffff, 0);
            renderer.setSize(width, height);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

            container.innerHTML = "";
            container.appendChild(renderer.domElement);

            if (document.fonts && document.fonts.ready) {
                document.fonts.ready.then(() => {
                    if (!planeMesh) return;
                    const updatedTexture = createTextTexture(
                        THREE,
                        "kartracer",
                        "HafferXH-Bold",
                        null,
                        "#000000",
                        "400",
                        width,
                        height
                    );
                    planeMesh.material.uniforms.u_texture.value = updatedTexture;
                });
            }
        };

        const handleMouseMove = (event) => {
            easeFactor = 0.035;
            const rect = container.getBoundingClientRect();
            prevPosition = { ...targetMousePosition };

            targetMousePosition.x = (event.clientX - rect.left) / rect.width;
            targetMousePosition.y = (event.clientY - rect.top) / rect.height;
        };

        const handleMouseEnter = (event) => {
            easeFactor = 0.01;
            const rect = container.getBoundingClientRect();

            mousePosition.x = targetMousePosition.x =
                (event.clientX - rect.left) / rect.width;
            mousePosition.y = targetMousePosition.y =
                (event.clientY - rect.top) / rect.height;
        };

        const handleMouseLeave = () => {
            easeFactor = 0.01;
            targetMousePosition = { ...prevPosition };
        };

        const animateScene = () => {
            if (!renderer || !scene || !camera || !planeMesh) return;

            animationId = requestAnimationFrame(animateScene);

            mousePosition.x += (targetMousePosition.x - mousePosition.x) * easeFactor;
            mousePosition.y += (targetMousePosition.y - mousePosition.y) * easeFactor;

            planeMesh.material.uniforms.u_mouse.value.set(
                mousePosition.x,
                1.0 - mousePosition.y
            );

            planeMesh.material.uniforms.u_prevMouse.value.set(
                prevPosition.x,
                1.0 - prevPosition.y
            );

            renderer.render(scene, camera);
        };

        let onResize = () => {};

        loadThree()
            .then((THREE) => {
                if (isCancelled) return;
                initScene(THREE);

                container.addEventListener("mousemove", handleMouseMove);
                container.addEventListener("mouseenter", handleMouseEnter);
                container.addEventListener("mouseleave", handleMouseLeave);

                onResize = () => {
                    if (!renderer || !camera || !planeMesh) return;
                    const { width, height } = getContainerSize();
                    const aspectRatio = width / height;
                    camera.top = 1 / aspectRatio;
                    camera.bottom = -1 / aspectRatio;
                    camera.updateProjectionMatrix();
                    renderer.setSize(width, height);

                    const updatedTexture = createTextTexture(
                        THREE,
                        "kartracer",
                        "HafferXH-Bold",
                        null,
                        "#000000",
                        "400",
                        width,
                        height
                    );
                    planeMesh.material.uniforms.u_texture.value = updatedTexture;
                };

                window.addEventListener("resize", onResize);

                if (typeof ResizeObserver !== "undefined") {
                    resizeObserver = new ResizeObserver(() => onResize());
                    resizeObserver.observe(container);
                }

                animateScene();
            })
            .catch(() => {});

        return () => {
            isCancelled = true;

            if (animationId) {
                cancelAnimationFrame(animationId);
            }

            container.removeEventListener("mousemove", handleMouseMove);
            container.removeEventListener("mouseenter", handleMouseEnter);
            container.removeEventListener("mouseleave", handleMouseLeave);
            window.removeEventListener("resize", onResize);

            if (resizeObserver) {
                resizeObserver.disconnect();
            }

            if (planeMesh) {
                planeMesh.geometry.dispose();
                planeMesh.material.dispose();
            }

            if (renderer) {
                renderer.dispose();
            }

            if (renderer && renderer.domElement && renderer.domElement.parentNode) {
                renderer.domElement.parentNode.removeChild(renderer.domElement);
            }
        };
    }, []);

    return (
        <footer>
            <div className="footer-horaire-map">
                <div className="footer-horaire">
                    <div>
                        <h3>Prêt à tenter l'expérience</h3>
                        <p>Nous vous accueillons</p>
                        <div className="horaires-list">
                            {horaires.map(({ jour, heure }) => (
                                <div className="horaire" key={jour}>
                                    <p>{jour}</p>
                                    <span>{heure}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="footer-map">
                    <img src="/images/map.png" alt="" />
                </div>
            </div>
            <div className="footer-content-shader">
                <div className="footer-content">
                    <div>
                        <h4>Notre site</h4>
                        <p>Accueil</p>
                        <p>Notre complexe</p>
                        <p>Tarifs</p>
                        <p>Mentions légales</p>
                    </div>
                    <div>
                        <h4>Localisation</h4>
                        <p>Parc de loisirs - rue de la Tuilerie - 45770 Saran</p>
                    </div>
                    <div>
                        <h4>Contact</h4>
                        <p>contact@kartracer.fr</p>
                        <div className="reseaux">
                            <FaFacebookSquare />
                            <AiFillInstagram />
                        </div>
                    </div>
                </div>
                <div className="shader">
                    <div className="shader-canvas" ref={shaderCanvasRef}></div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
