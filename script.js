const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".nav-link");
const navbar = document.getElementById("navbar");

// Show/hide navbar background on scroll
window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
        navbar.style.background = "rgba(34, 34, 34, 0.9)";
    } else {
        navbar.style.background = "transparent";
    }
});

// IntersectionObserver to highlight current section
const options = {
    threshold: 0.5
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        // Hide all links first
        navLinks.forEach(link => {
            link.style.opacity = "0";
            link.style.transition = "opacity 0.5s";
            link.style.textDecoration = "none"; // remove underline
        });

        // Show active section link
        if(entry.isIntersecting) {
            const id = entry.target.getAttribute("id");
            const activeLink = document.querySelector(`a[href="#${id}"]`);
            if(activeLink){
                activeLink.style.opacity = "1";
                activeLink.style.textDecoration = "underline";
            }
        }
    });
}, options);

sections.forEach(section => {
    observer.observe(section);
});

// Smooth scrolling for nav links
navLinks.forEach(link => {
    link.addEventListener("click", (e) => {
        e.preventDefault();
        document.querySelector(link.getAttribute("href")).scrollIntoView({
            behavior: "smooth"
        });
    });
});
