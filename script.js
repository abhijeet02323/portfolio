const navbar = document.querySelector('.navbar');
const motionOK = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

window.addEventListener('scroll', () => navbar.classList.toggle('scrolled', window.scrollY > 16), { passive: true });

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(({ isIntersecting, target }) => {
    if (isIntersecting) { target.classList.add('visible'); revealObserver.unobserve(target); }
  });
}, { threshold: .12 });
document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

if (motionOK) {
  document.querySelectorAll('.tilt-card').forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - .5;
      const y = (event.clientY - rect.top) / rect.height - .5;
      card.style.transform = `rotateX(${y * -7}deg) rotateY(${x * 8}deg) translateY(-5px)`;
    });
    card.addEventListener('pointerleave', () => { card.style.transform = ''; });
  });
}
