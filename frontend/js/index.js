// JavaScript para manejar el menú en dispositivos pequeños
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const navItems = document.querySelectorAll('.nav-links li');
const closeBtn = document.querySelector('.modal-close');


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
    const botonesVerMas = document.querySelectorAll('.ver-mas');
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modal-title');
    const modalDescription = document.getElementById('modal-description');
    const closeBtn = document.querySelector('.modal-close');

    // Información de las habitaciones
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

            modalTitle.textContent = habitacion.title;
            modalDescription.textContent = habitacion.description;
            modal.style.display = 'block';
        });
    });

    // Cerrar el modal cuando se haga clic en el botón de cierre
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

// Código para el manejo del calendario de reservas
document.addEventListener('DOMContentLoaded', function() {
    const reservarButton = document.getElementById('reservar-button');
    const calendarioContainer = document.getElementById('calendario-container');
    const confirmarReservaButton = document.getElementById('confirmar-reserva');
    
    if (reservarButton) {
        // Inicializar el calendario con Flatpickr
        const calendarioInput = document.getElementById('fecha-reserva');
        const calendarioInstance = flatpickr(calendarioInput, {
            mode: "range",
            minDate: "today",
            dateFormat: "Y-m-d",
            disable: [
                function(date) {
                    return false;
                }
            ],
            locale: {
                firstDayOfWeek: 1, // Lunes como primer día
                rangeSeparator: ' hasta '
            }
        });
        
        // Mostrar calendario al hacer clic en el botón reservar
        reservarButton.addEventListener('click', function() {
            if (calendarioContainer.style.display === 'none') {
                calendarioContainer.style.display = 'block';
                calendarioInstance.open();
            } else {
                calendarioContainer.style.display = 'none';
            }
        });
        
        // Manejar la confirmación de reserva
        confirmarReservaButton.addEventListener('click', function() {
            const fechasSeleccionadas = calendarioInput.value;
            
            if (fechasSeleccionadas) {
                const [fechaInicio, fechaFin] = fechasSeleccionadas.split(' hasta ');
                
                // Crear mensaje de confirmación estilizado
                const mensajeConfirmacion = document.createElement('div');
                mensajeConfirmacion.className = 'mensaje-confirmacion';
                mensajeConfirmacion.innerHTML = `
                    <div class="mensaje-contenido">
                        <h3>¡Reserva confirmada!</h3>
                        <p>Fecha de inicio: ${fechaInicio}</p>
                        <p>Fecha de fin: ${fechaFin || fechaInicio}</p>
                        <button class="cerrar-mensaje">Aceptar</button>
                    </div>
                `;
                
                // Añadir el mensaje al DOM
                document.body.appendChild(mensajeConfirmacion);
                
                // Animación de entrada
                setTimeout(() => {
                    mensajeConfirmacion.classList.add('visible');
                }, 10);
                
                // Cerrar mensaje al hacer clic en el botón
                mensajeConfirmacion.querySelector('.cerrar-mensaje').addEventListener('click', () => {
                    mensajeConfirmacion.classList.remove('visible');
                    setTimeout(() => {
                        document.body.removeChild(mensajeConfirmacion);
                    }, 300);
                });
                
                calendarioContainer.style.display = 'none';
            }
        });
    }
});