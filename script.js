// Add a background to the navigation after the visitor begins scrolling.
const navbar = document.querySelector(".navbar");
const motionIsAllowed = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

window.addEventListener(
    "scroll",
    () => {
        navbar.classList.toggle("scrolled", window.scrollY > 16);
    },
    { passive: true }
);

// Reveal each section when it enters the viewport.
const revealObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            entry.target.classList.add("visible");
            revealObserver.unobserve(entry.target);
        });
    },
    { threshold: 0.12 }
);

document.querySelectorAll(".reveal").forEach((element) => {
    revealObserver.observe(element);
});

// Give cards a small 3D tilt on devices that do not prefer reduced motion.
if (motionIsAllowed) {
    document.querySelectorAll(".tilt-card").forEach((card) => {
        card.addEventListener("pointermove", (event) => {
            const cardBounds = card.getBoundingClientRect();
            const pointerX = (event.clientX - cardBounds.left) / cardBounds.width - 0.5;
            const pointerY = (event.clientY - cardBounds.top) / cardBounds.height - 0.5;

            card.style.transform = `rotateX(${pointerY * -7}deg) rotateY(${pointerX * 8}deg) translateY(-5px)`;
        });

        card.addEventListener("pointerleave", () => {
            card.style.transform = "";
        });
    });
}
