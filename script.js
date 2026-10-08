/* Anjula, will you be my valentine? */
(function () {
    'use strict';

    const yesBtn = document.getElementById('yes-btn');
    const noBtn = document.getElementById('no-btn');
    const noSlot = document.getElementById('no-slot');
    const actions = document.getElementById('question');
    const answered = document.getElementById('answered');
    const teaserSection = document.getElementById('teaser-section');
    const successSection = document.getElementById('success-section');
    const nav = document.getElementById('nav');
    const navCta = document.getElementById('nav-cta');

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    // Kept exactly as in the original script.js
    const messages = [
        "No",
        "Are you sure?",
        "Think again",
        "Haha, nice try",
        "No escape",
        "You can not escape love",
        "You are trying my patience",
        "Nice try",
        "Still no? Really?",
        "Nope not happening",
        "Don't be like that!",
        "I'll be sad...",
        "Pretty please?",
        "You're breaking my heart 💔",
        "Last chance!",
        "Okay, I'll ask again...",
        "Please?",
        "Come on!",
        "You know you want to!",
        "Just click Yes!"
    ];

    let messageIndex = 1; // Start from 1 because 0 is "No" (initial)
    let lastDodge = 0;
    let hasAnswered = false;

    /* ------------------------------------------------------------------
       Scroll reveal
       ------------------------------------------------------------------ */
    const revealEls = document.querySelectorAll('.reveal');

    if (reduceMotion.matches || !('IntersectionObserver' in window)) {
        revealEls.forEach((el) => el.classList.add('is-visible'));
    } else {
        const io = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    io.unobserve(entry.target);
                }
            });
        }, { rootMargin: '0px 0px -8% 0px', threshold: 0 });
        revealEls.forEach((el) => io.observe(el));
    }

    /* ------------------------------------------------------------------
       The runaway No button
       ------------------------------------------------------------------ */
    const EDGE = 12; // keep this far from the viewport edges
    const MAX_ROT = 20; // degrees, like the original

    function viewportSize() {
        const vv = window.visualViewport;
        return {
            w: Math.min(document.documentElement.clientWidth, vv ? vv.width : Infinity),
            h: vv ? vv.height : window.innerHeight
        };
    }

    function overlaps(a, b) {
        return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
    }

    // Place the (fixed) No button somewhere random but fully on screen,
    // clear of the nav and the Yes button.
    function placeNoButton(keepRotation) {
        const { w: vw, h: vh } = viewportSize();
        const bw = noBtn.offsetWidth;
        const bh = noBtn.offsetHeight;
        const navH = nav.getBoundingClientRect().bottom;
        const minTop = Math.max(EDGE, navH + EDGE);

        const yes = yesBtn.getBoundingClientRect();
        const yesZone = { left: yes.left - 16, right: yes.right + 16, top: yes.top - 16, bottom: yes.bottom + 16 };
        const current = noBtn.getBoundingClientRect();
        const curCx = current.left + current.width / 2;
        const curCy = current.top + current.height / 2;

        let best = null;
        for (let i = 0; i < 30; i++) {
            let rot = keepRotation != null ? keepRotation : Math.floor(Math.random() * (MAX_ROT * 2 + 1)) - MAX_ROT;
            let rad = Math.abs(rot) * Math.PI / 180;
            // Bounding box of the rotated button
            let rw = bw * Math.cos(rad) + bh * Math.sin(rad);
            let rh = bw * Math.sin(rad) + bh * Math.cos(rad);
            if (rw > vw - EDGE * 2 || rh > vh - minTop - EDGE) {
                rot = 0; rw = bw; rh = bh;
            }

            const minCx = EDGE + rw / 2;
            const maxCx = Math.max(minCx, vw - EDGE - rw / 2);
            const minCy = minTop + rh / 2;
            const maxCy = Math.max(minCy, vh - EDGE - rh / 2);
            const cx = minCx + Math.random() * (maxCx - minCx);
            const cy = minCy + Math.random() * (maxCy - minCy);

            const box = { left: cx - rw / 2, right: cx + rw / 2, top: cy - rh / 2, bottom: cy + rh / 2 };
            const moved = Math.hypot(cx - curCx, cy - curCy);
            best = { cx, cy, rot };
            if (!overlaps(box, yesZone) && (keepRotation != null || moved > Math.min(vw, vh) * 0.2)) break;
        }

        noBtn.style.left = Math.round(best.cx - bw / 2) + 'px';
        noBtn.style.top = Math.round(best.cy - bh / 2) + 'px';
        noBtn.style.transform = `rotate(${best.rot}deg)`;
        noBtn.dataset.rot = best.rot;
    }

    function dodge() {
        if (hasAnswered) return;
        const now = performance.now();
        if (now - lastDodge < 120) return; // touchstart + click double-fire guard
        lastDodge = now;

        if (!noBtn.classList.contains('is-loose')) {
            // Hold its spot so the Yes button doesn't jump, then pin the button
            // where it is so the first move glides instead of teleporting.
            const r = noBtn.getBoundingClientRect();
            noSlot.style.width = r.width + 'px';
            noSlot.style.height = r.height + 'px';
            noBtn.style.left = r.left + 'px';
            noBtn.style.top = r.top + 'px';
            noBtn.classList.add('is-loose');
            void noBtn.offsetWidth; // flush styles so the transition starts from here
        }

        // Change text
        noBtn.textContent = messages[messageIndex];
        messageIndex = (messageIndex + 1) % messages.length;

        // Move button
        placeNoButton(null);
    }

    // Touch: move on touchstart so a tap can never "land" on No.
    noBtn.addEventListener('touchstart', (e) => {
        e.preventDefault(); // suppress the emulated mouse/click events
        dodge();
    }, { passive: false });

    // Mouse, pen and keyboard (Enter/Space) all arrive as click.
    noBtn.addEventListener('click', (e) => {
        e.preventDefault();
        dodge();
    });

    // Keep it on screen if the viewport changes (rotation, URL bar, resize).
    function keepInView() {
        if (noBtn.classList.contains('is-loose') && !hasAnswered) {
            placeNoButton(Number(noBtn.dataset.rot) || 0);
        }
    }
    window.addEventListener('resize', keepInView);
    if (window.visualViewport) window.visualViewport.addEventListener('resize', keepInView);

    /* ------------------------------------------------------------------
       Yes!
       ------------------------------------------------------------------ */
    const confettiColors = ['#ff4d6d', '#e11d48', '#ff8fa3', '#ffccd5', '#ffffff', '#f5c27a'];

    function fire(opts) {
        if (typeof window.confetti !== 'function') return;
        window.confetti(Object.assign({
            colors: confettiColors,
            zIndex: 100,
            disableForReducedMotion: true
        }, opts));
    }

    function triggerConfetti() {
        fire({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
    }

    function confettiLoop() {
        // More confetti loop (same timing and shape as the original)
        const duration = 5 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60 };

        function randomInOut(min, max) {
            return Math.random() * (max - min) + min;
        }

        const interval = setInterval(function () {
            const timeLeft = animationEnd - Date.now();
            if (timeLeft <= 0) {
                return clearInterval(interval);
            }
            const particleCount = 50 * (timeLeft / duration);
            // since particles fall down, start a bit higher than random
            fire(Object.assign({}, defaults, { particleCount, origin: { x: randomInOut(0.1, 0.3), y: Math.random() - 0.2 } }));
            fire(Object.assign({}, defaults, { particleCount, origin: { x: randomInOut(0.7, 0.9), y: Math.random() - 0.2 } }));
        }, 250);
    }

    yesBtn.addEventListener('click', () => {
        if (hasAnswered) return;
        hasAnswered = true;

        // Fire confetti
        triggerConfetti();
        confettiLoop();

        // Swap the question for the answer, unlock the plan
        document.body.classList.add('is-answered');
        noBtn.hidden = true;
        actions.hidden = true;
        answered.hidden = false;
        teaserSection.hidden = true;
        successSection.hidden = false;

        navCta.textContent = 'The plan';
        navCta.setAttribute('href', '#success-section');

        // Smooth scroll to the plan
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                successSection.scrollIntoView({
                    behavior: reduceMotion.matches ? 'auto' : 'smooth',
                    block: 'start'
                });
            });
        });
        updateNav();
    });

    /* ------------------------------------------------------------------
       Nav: "Answer" brings her back to the question; dark over dark section
       ------------------------------------------------------------------ */
    navCta.addEventListener('click', (e) => {
        if (hasAnswered) return; // default anchor behaviour to the plan
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: reduceMotion.matches ? 'auto' : 'smooth' });
        yesBtn.classList.remove('is-nudged');
        void yesBtn.offsetWidth;
        yesBtn.classList.add('is-nudged');
    });

    document.querySelectorAll('a[href="#top"]:not(#nav-cta)').forEach((a) => {
        a.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: reduceMotion.matches ? 'auto' : 'smooth' });
        });
    });

    let ticking = false;
    function updateNav() {
        ticking = false;
        const navBottom = nav.offsetHeight;
        let dark = false;
        if (!successSection.hidden) {
            const r = successSection.getBoundingClientRect();
            dark = r.top < navBottom / 2 && r.bottom > navBottom;
        }
        nav.classList.toggle('is-dark', dark);
    }
    window.addEventListener('scroll', () => {
        if (!ticking) {
            ticking = true;
            requestAnimationFrame(updateNav);
        }
    }, { passive: true });

})();
