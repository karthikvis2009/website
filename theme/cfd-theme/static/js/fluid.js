(() => {

    const canvas = document.getElementById("fluidCanvas");
    const ball = document.getElementById("fluidBall");
    const container = document.querySelector(".hero-visual");

    if (!canvas || !ball || !container) {
        return;
    }

    const ctx = canvas.getContext("2d");

    /* ---------------------------------------------------------
       Simulation parameters
    --------------------------------------------------------- */

    const PARTICLE_COUNT = 900;

    const PARTICLE_RADIUS = 1.25;

    const BALL_RADIUS = 29;

    const FLOW_SPEED = 1.8;

    const FLOW_INFLUENCE = 150;

    const VORTEX_STRENGTH = 2.8;

    const PARTICLE_DRAG = 0.94;


    /* ---------------------------------------------------------
       Canvas state
    --------------------------------------------------------- */

    let width = 0;
    let height = 0;
    let dpr = 1;


    /* ---------------------------------------------------------
       Ball state
    --------------------------------------------------------- */

    let ballX = 0;
    let ballY = 0;

    let previousBallX = 0;
    let previousBallY = 0;

    let ballVelocityX = 0;
    let ballVelocityY = 0;

    let dragging = false;


    /* ---------------------------------------------------------
       Particles
    --------------------------------------------------------- */

    const particles = [];


    /* ---------------------------------------------------------
       Resize canvas
    --------------------------------------------------------- */

    function resize() {

        const rect =
            container.getBoundingClientRect();

        width =
            Math.max(1, rect.width);

        height =
            Math.max(1, rect.height);

        dpr =
            Math.min(
                window.devicePixelRatio || 1,
                2
            );


        canvas.width =
            Math.round(width * dpr);

        canvas.height =
            Math.round(height * dpr);


        canvas.style.width =
            `${width}px`;

        canvas.style.height =
            `${height}px`;


        ctx.setTransform(
            dpr,
            0,
            0,
            dpr,
            0,
            0
        );


        /*
         * Only initialize the ball position once.
         */
        if (
            ballX === 0 &&
            ballY === 0
        ) {

            ballX =
                width * 0.5;

            ballY =
                height * 0.5;

            previousBallX =
                ballX;

            previousBallY =
                ballY;
        }


        clampBall();

        positionBall();
    }


    /* ---------------------------------------------------------
       Keep ball inside the simulation
    --------------------------------------------------------- */

    function clampBall() {

        ballX =
            Math.max(
                BALL_RADIUS,
                Math.min(
                    width - BALL_RADIUS,
                    ballX
                )
            );


        ballY =
            Math.max(
                BALL_RADIUS,
                Math.min(
                    height - BALL_RADIUS,
                    ballY
                )
            );
    }


    /* ---------------------------------------------------------
       Position HTML ball
    --------------------------------------------------------- */

    function positionBall() {

        ball.style.left =
            `${ballX}px`;

        ball.style.top =
            `${ballY}px`;
    }


    /* ---------------------------------------------------------
       Reset / initialize particle
    --------------------------------------------------------- */

    function resetParticle(
        p,
        initial = false
    ) {

        if (initial) {

            /*
             * Initial particles are distributed
             * throughout the entire domain.
             *
             * This is important because resize()
             * must happen before this function is called.
             */

            p.x =
                Math.random() * width;

            p.y =
                Math.random() * height;

        } else {

            /*
             * Particles that leave the domain
             * are reintroduced from the inlet.
             */

            p.x =
                -Math.random() * 25;

            p.y =
                Math.random() * height;
        }


        /*
         * Initial velocity.
         */

        p.vx =
            FLOW_SPEED *
            (
                0.85 +
                Math.random() * 0.30
            );


        p.vy =
            (
                Math.random() - 0.5
            ) * 0.25;


        /*
         * Slightly randomized particle size.
         */

        p.size =
            PARTICLE_RADIUS *
            (
                0.7 +
                Math.random() * 0.8
            );


        /*
         * Particle opacity.
         */

        p.alpha =
            0.35 +
            Math.random() * 0.45;


        /*
         * Used to create subtle variation
         * in the flow field.
         */

        p.phase =
            Math.random() *
            Math.PI *
            2;
    }


    /* ---------------------------------------------------------
       Flow field
    --------------------------------------------------------- */

    function calculateVelocity(
        x,
        y,
        particle
    ) {

        /*
         * Base uniform flow:
         * left -> right
         */

        let vx =
            FLOW_SPEED;


        let vy =
            Math.sin(
                particle.phase +
                x * 0.012
            ) * 0.04;


        /*
         * Vector from ball to particle.
         */

        const dx =
            x - ballX;

        const dy =
            y - ballY;


        const distance =
            Math.sqrt(
                dx * dx +
                dy * dy
            );


        /* -----------------------------------------------------
           Flow around ball
        ----------------------------------------------------- */

        if (
            distance > 0.001 &&
            distance < FLOW_INFLUENCE
        ) {

            const nx =
                dx / distance;

            const ny =
                dy / distance;


            /*
             * Influence decreases smoothly
             * with distance from the ball.
             */

            const q =
                1 -
                distance /
                FLOW_INFLUENCE;


            /*
             * Radial displacement.
             */

            const repulsion =
                q * q * 4.5;


            vx +=
                nx *
                repulsion;

            vy +=
                ny *
                repulsion;


            /*
             * Tangential component creates
             * circulation around the ball.
             */

            const tangential =
                q *
                VORTEX_STRENGTH;


            vx +=
                -ny *
                tangential;

            vy +=
                nx *
                tangential;
        }


        /* -----------------------------------------------------
           Wake behind ball
        ----------------------------------------------------- */

        const downstream =
            x - ballX;


        if (
            downstream > 0 &&
            downstream < 260
        ) {

            const wakeLength =
                Math.exp(
                    -downstream / 130
                );


            const lateral =
                Math.exp(
                    -(
                        dy * dy
                    ) /
                    (
                        2 *
                        45 *
                        45
                    )
                );


            const wake =
                wakeLength *
                lateral;


            /*
             * Oscillating wake.
             */

            vy +=
                Math.sin(
                    downstream / 22
                ) *
                wake *
                2.2;


            /*
             * Slight velocity deficit.
             */

            vx -=
                wake *
                0.7;
        }


        /* -----------------------------------------------------
           Ball dragging influence
        ----------------------------------------------------- */

        if (dragging) {

            const distanceToBall =
                distance;


            if (
                distanceToBall <
                FLOW_INFLUENCE
            ) {

                const influence =
                    1 -
                    distanceToBall /
                    FLOW_INFLUENCE;


                vx +=
                    ballVelocityX *
                    influence *
                    0.65;


                vy +=
                    ballVelocityY *
                    influence *
                    0.65;
            }
        }


        return {
            x: vx,
            y: vy
        };
    }


    /* ---------------------------------------------------------
       Update particle
    --------------------------------------------------------- */

    function updateParticle(p) {

        const velocity =
            calculateVelocity(
                p.x,
                p.y,
                p
            );


        /*
         * Smoothly approach the velocity
         * prescribed by the flow field.
         */

        p.vx +=
            (
                velocity.x -
                p.vx
            ) * 0.12;


        p.vy +=
            (
                velocity.y -
                p.vy
            ) * 0.12;


        /*
         * Particle inertia / damping.
         */

        p.vx *=
            PARTICLE_DRAG;

        p.vy *=
            PARTICLE_DRAG;


        /*
         * Integrate position.
         */

        p.x +=
            p.vx;

        p.y +=
            p.vy;


        /* -----------------------------------------------------
           Collision with ball
        ----------------------------------------------------- */

        const dx =
            p.x - ballX;

        const dy =
            p.y - ballY;


        const distance =
            Math.sqrt(
                dx * dx +
                dy * dy
            );


        const minimumDistance =
            BALL_RADIUS +
            p.size;


        if (
            distance <
            minimumDistance &&
            distance > 0.001
        ) {

            const nx =
                dx / distance;

            const ny =
                dy / distance;


            /*
             * Push particle outside ball.
             */

            p.x =
                ballX +
                nx *
                minimumDistance;


            p.y =
                ballY +
                ny *
                minimumDistance;


            /*
             * Remove velocity directed
             * into the ball.
             */

            const normalVelocity =
                p.vx * nx +
                p.vy * ny;


            if (
                normalVelocity < 0
            ) {

                p.vx -=
                    normalVelocity *
                    nx;

                p.vy -=
                    normalVelocity *
                    ny;
            }


            /*
             * Small tangential deflection.
             */

            p.vx +=
                -ny *
                0.7;

            p.vy +=
                nx *
                0.7;
        }


        /* -----------------------------------------------------
           Particle recycling
        ----------------------------------------------------- */

        if (
            p.x > width + 20 ||
            p.y < -30 ||
            p.y > height + 30
        ) {

            resetParticle(
                p,
                false
            );
        }
    }


    /* ---------------------------------------------------------
       Draw particle
    --------------------------------------------------------- */

    function drawParticle(p) {

        const speed =
            Math.sqrt(
                p.vx * p.vx +
                p.vy * p.vy
            );


        /*
         * Longer trails at higher velocity.
         */

        const trail =
            Math.min(
                20,
                5 + speed * 4
            );


        const magnitude =
            Math.max(
                speed,
                0.001
            );


        const tailX =
            p.x -
            (
                p.vx /
                magnitude
            ) *
            trail;


        const tailY =
            p.y -
            (
                p.vy /
                magnitude
            ) *
            trail;


        ctx.beginPath();


        ctx.moveTo(
            tailX,
            tailY
        );


        ctx.lineTo(
            p.x,
            p.y
        );


        ctx.strokeStyle =
            `rgba(199,243,107,${p.alpha})`;


        ctx.lineWidth =
            p.size;


        ctx.stroke();
    }


    /* ---------------------------------------------------------
       Optional background flow lines
    --------------------------------------------------------- */

    function drawFlowLines() {

        ctx.strokeStyle =
            "rgba(199,243,107,0.055)";

        ctx.lineWidth = 1;


        for (
            let y = 15;
            y < height;
            y += 35
        ) {

            ctx.beginPath();

            ctx.moveTo(
                0,
                y
            );

            ctx.lineTo(
                width,
                y
            );

            ctx.stroke();
        }
    }


    /* ---------------------------------------------------------
       Render frame
    --------------------------------------------------------- */

    function render() {

        /*
         * Background.
         */

        ctx.fillStyle =
            "#111513";


        ctx.fillRect(
            0,
            0,
            width,
            height
        );


        /*
         * Subtle background flow lines.
         */

        drawFlowLines();


        /*
         * Update and draw particles.
         */

        for (
            const particle of particles
        ) {

            updateParticle(
                particle
            );

            drawParticle(
                particle
            );
        }


        /* -----------------------------------------------------
           Soft wake visualization
        ----------------------------------------------------- */

        const wakeGradient =
            ctx.createLinearGradient(
                ballX + BALL_RADIUS,
                ballY,
                width,
                ballY
            );


        wakeGradient.addColorStop(
            0,
            "rgba(199,243,107,0.10)"
        );


        wakeGradient.addColorStop(
            0.35,
            "rgba(199,243,107,0.025)"
        );


        wakeGradient.addColorStop(
            1,
            "rgba(199,243,107,0)"
        );


        ctx.fillStyle =
            wakeGradient;


        ctx.beginPath();


        ctx.ellipse(
            ballX + 100,
            ballY,
            150,
            65,
            0,
            0,
            Math.PI * 2
        );


        ctx.fill();
    }


    /* ---------------------------------------------------------
       Pointer interaction
    --------------------------------------------------------- */

    ball.addEventListener(
        "pointerdown",
        event => {

            event.preventDefault();

            dragging = true;


            ball.classList.add(
                "dragging"
            );


            ball.setPointerCapture(
                event.pointerId
            );
        }
    );


    ball.addEventListener(
        "pointermove",
        event => {

            if (!dragging) {
                return;
            }


            const rect =
                container.getBoundingClientRect();


            const newX =
                event.clientX -
                rect.left;


            const newY =
                event.clientY -
                rect.top;


            /*
             * Ball velocity.
             */

            ballVelocityX =
                newX -
                ballX;


            ballVelocityY =
                newY -
                ballY;


            /*
             * Move ball.
             */

            ballX =
                newX;

            ballY =
                newY;


            clampBall();

            positionBall();
        }
    );


    /* ---------------------------------------------------------
       Stop dragging
    --------------------------------------------------------- */

    function stopDragging(event) {

        dragging = false;


        ball.classList.remove(
            "dragging"
        );


        /*
         * Retain a small amount of momentum
         * after releasing the ball.
         */

        ballVelocityX *= 0.3;

        ballVelocityY *= 0.3;


        if (
            event &&
            ball.hasPointerCapture(
                event.pointerId
            )
        ) {

            ball.releasePointerCapture(
                event.pointerId
            );
        }
    }


    ball.addEventListener(
        "pointerup",
        stopDragging
    );


    ball.addEventListener(
        "pointercancel",
        stopDragging
    );


    /* ---------------------------------------------------------
       Animation loop
    --------------------------------------------------------- */

    function animate() {

        render();


        /*
         * Gradually dissipate ball momentum.
         */

        ballVelocityX *= 0.92;

        ballVelocityY *= 0.92;


        requestAnimationFrame(
            animate
        );
    }


    /* ---------------------------------------------------------
       INITIALIZATION
       
       IMPORTANT:
       resize() MUST happen before particles are created.
       Otherwise width/height are zero and all particles
       start at (0, 0).
    --------------------------------------------------------- */

    resize();


    /*
     * Now that width and height are valid,
     * distribute particles throughout the entire
     * simulation domain.
     */

    for (
        let i = 0;
        i < PARTICLE_COUNT;
        i++
    ) {

        const p = {};

        resetParticle(
            p,
            true
        );

        particles.push(p);
    }


    /*
     * Handle future window resizing.
     */

    window.addEventListener(
        "resize",
        resize
    );


    /*
     * Start simulation.
     */

    animate();

})();
