// JavaScript para manejar el menú en dispositivos pequeños
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const navItems = document.querySelectorAll('.nav-links li');

menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Cerrar el menú al hacer clic en un enlace
navItems.forEach(item => {
    item.addEventListener('click', () => {
        menuToggle.classList.remove('active'); 
        navLinks.classList.remove('active');  
    });
});

document.addEventListener("DOMContentLoaded", function() {
    // Seleccionar los botones de "Ver más" y el modal
    const botonesVerMas = document.querySelectorAll('.ver-mas');
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modal-title');
    const modalDescription = document.getElementById('modal-description');
    const closeBtn = document.querySelector('.close');

    // Información de las habitaciones (puedes agregar más detalles según necesites)
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

    // Función para abrir el modal y mostrar la información
    botonesVerMas.forEach(boton => {
        boton.addEventListener('click', function() {
            const habitacionId = boton.getAttribute('data-habitacion');
            const habitacion = habitacionesInfo[habitacionId];

            // Mostrar el modal con la información de la habitación
            modalTitle.textContent = habitacion.title;
            modalDescription.textContent = habitacion.description;
            modal.style.display = 'block';
        });
    });

    // Cerrar el modal cuando se hace clic en el botón de cerrar
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    // Cerrar el modal si se hace clic fuera de él
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
});
