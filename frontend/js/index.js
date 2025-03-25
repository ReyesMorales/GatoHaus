// --- NAVBAR RESPONSIVE ---
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const navItems = document.querySelectorAll('.nav-links li');

if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
  });

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      menuToggle.classList.remove('active');
      navLinks.classList.remove('active');
    });
  });
}

// --- MODAL + FUNCIONALIDAD DE VER MÁS ---
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modal-title');
const modalDescription = document.getElementById('modal-description');
const closeBtn = document.querySelector('.modal-close');

const habitacionesInfo = {
  deluxe: {
    title: "Habitación Deluxe",
    description: "Una habitación lujosa con todas las comodidades para tu gato."
  },
  suite: {
    title: "Habitación Suite",
    description: "La mejor opción para gatos exigentes, con vistas espectaculares."
  },
  cat: {
    title: "Habitación Cat",
    description: "Una habitación cómoda y acogedora, perfecta para descansar."
  }
};

// Delegación de eventos para botones dinámicos
document.addEventListener('click', function (e) {
  if (e.target.classList.contains('ver-mas')) {
    const tipo = e.target.getAttribute('data-habitacion');
    const habitacion = habitacionesInfo[tipo];

    if (habitacion) {
      modalTitle.textContent = habitacion.title;
      modalDescription.textContent = habitacion.description;
      modal.style.display = 'block';
    }
  }
});

// Cerrar modal
if (closeBtn && modal) {
  closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  window.addEventListener('click', function (event) {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  });
}
