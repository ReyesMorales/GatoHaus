// --- 1. NAVBAR RESPONSIVE ---
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

// --- 2. CARGAR HABITACIONES DINÁMICAMENTE ---
fetch('https://gatohaus-backend.onrender.com/api/rooms')
  .then(response => response.json())
  .then(rooms => {
    const roomsContainer = document.getElementById('rooms');
    roomsContainer.innerHTML = '';

    const tiposMostrados = new Set();

    const imagenesPorTipo = {
      deluxe: '/assets/Imagen_habitacion1.jpg',
      suite: '/assets/Imagen_habitacion2.jpg',
      cat: '/assets/Imagen_habitacion3.jpg'
    };

    rooms.forEach(room => {
      const tipo = room.tipo.toLowerCase();

      if (!tiposMostrados.has(tipo)) {
        const card = document.createElement('div');
        card.classList.add('card');

        card.innerHTML = `
          <h3>${room.tipo}</h3>
          <img src="${imagenesPorTipo[tipo] || '/assets/default.jpg'}" alt="${room.tipo}">
          <button class="ver-mas" data-habitacion="${tipo}">Ver más</button>
        `;

        roomsContainer.appendChild(card);
        tiposMostrados.add(tipo);
      }
    });
  })
  .catch(error => {
    console.error('Error al cargar las habitaciones:', error);
  });


// --- 3. MODAL + FUNCIONALIDAD DE "VER MÁS" ---
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

// Abrir el modal al hacer clic en "Ver más"
document.addEventListener('click', function (e) {
  if (e.target.classList.contains('ver-mas')) {
    const tipo = e.target.getAttribute('data-habitacion');
    const habitacion = habitacionesInfo[tipo];

    if (habitacion) {
      modalTitle.textContent = habitacion.title;
      modalDescription.textContent = habitacion.description;
      modal.style.display = 'block';

      //Limpiar formulario y calendario al abrir
      const formulario = document.getElementById('form-reserva');
      formulario.reset();

      const formularioReserva = document.getElementById('formulario-reserva');
      formularioReserva.style.display = 'none';

      const calendarioInput = document.getElementById('fecha-reserva');
      if (calendarioInput && calendarioInput._flatpickr) {
        calendarioInput._flatpickr.clear();
        calendarioInput._flatpickr.close();
      }
    }
  }
});

// Cerrar el modal
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

// --- 4 & 5. MOSTRAR FORMULARIO + CONFIGURAR FLATPICKR ---
document.addEventListener('DOMContentLoaded', () => {
  const reservarBtn = document.getElementById('reservar-button');
  const formularioReserva = document.getElementById('formulario-reserva');
  const calendarioInput = document.getElementById('fecha-reserva');

  if (reservarBtn && formularioReserva) {
    reservarBtn.addEventListener('click', () => {
      formularioReserva.style.display = 'block';
    });
  }

  if (calendarioInput) {
    const calendario = flatpickr(calendarioInput, {
      mode: "range",
      minDate: "today",
      dateFormat: "Y-m-d",
      locale: {
        firstDayOfWeek: 1,
        rangeSeparator: ' hasta ',
      },
    });

    // Abrir al hacer clic en el icono
    const iconoCalendario = document.querySelector('.icono-calendario');
    if (iconoCalendario) {
      iconoCalendario.addEventListener('click', () => {
        calendario.open();
      });
    }

    // También abrir al hacer clic en el input
    calendarioInput.addEventListener('click', () => {
      calendario.open();
    });
  }
});


// --- 6. ENVIAR FORMULARIO AL BACKEND ---
const formulario = document.getElementById('form-reserva');

if (formulario) {
  formulario.addEventListener('submit', function (e) {
    e.preventDefault();

    const habitacion = document.getElementById('habitacion-select').value;
    const nombreCliente = document.getElementById('nombre-cliente').value.trim();
    const fechas = document.getElementById('fecha-reserva').value;

    if (!habitacion || !nombreCliente || !fechas) {
      mostrarMensaje("Campos incompletos", "Por favor, completa todos los campos.", "error");
      return;
    }

    const [fechaInicio, fechaFin] = fechas.split(' hasta ');

    if (!fechaInicio || !fechaFin) {
      mostrarMensaje("Fechas inválidas", "Selecciona un rango de fechas válido.", "error");
      return;
    }

    fetch(`https://gatohaus-backend.onrender.com/api/rooms/${habitacion}/reserve`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        fecha_inicio: fechaInicio,
        fecha_fin: fechaFin,
        cliente: nombreCliente
      })
    })
    .then(response => response.json())
    .then(data => {
      if (data.message) {
        console.error("Error desde el backend:", data.message);
        mostrarMensaje("Error", data.message, "error");
      } else {
        const fechaFormateadaInicio = new Date(data.fecha_inicio).toISOString().split('T')[0];
        const fechaFormateadaFin = new Date(data.fecha_fin).toISOString().split('T')[0];

        const mensajeConfirmacion = document.createElement('div');
        mensajeConfirmacion.className = 'mensaje-confirmacion';
        mensajeConfirmacion.innerHTML = `
          <div class="mensaje-contenido">
            <h3>¡Reserva confirmada!</h3>
            <p>Cliente: ${data.cliente}</p>
            <p>Desde: ${fechaFormateadaInicio}</p>
            <p>Hasta: ${fechaFormateadaFin}</p>
            <button class="cerrar-mensaje">Aceptar</button>
          </div>
        `;

        document.body.appendChild(mensajeConfirmacion);

        setTimeout(() => {
          mensajeConfirmacion.classList.add('visible');
        }, 10);

        mensajeConfirmacion.querySelector('.cerrar-mensaje').addEventListener('click', () => {
          mensajeConfirmacion.classList.remove('visible');
          setTimeout(() => {
            document.body.removeChild(mensajeConfirmacion);

            // Limpieza completa después del mensaje de éxito
            formulario.reset();
            document.getElementById('formulario-reserva').style.display = 'none';

            const calendarioInput = document.getElementById('fecha-reserva');
            if (calendarioInput && calendarioInput._flatpickr) {
              calendarioInput._flatpickr.clear();
              calendarioInput._flatpickr.close();
            }
          }, 300);
        });
      }
    })
    .catch(error => {
      console.error("Error al enviar la reserva:", error);
      mostrarMensaje("Error de red", "Ocurrió un error al enviar la reserva.", "error");
    });
  });
}

// --- 7. FUNCIÓN DE MENSAJE REUTILIZABLE ---
function mostrarMensaje(titulo, mensaje, tipo = 'info') {
  const mensajeConfirmacion = document.createElement('div');
  mensajeConfirmacion.className = 'mensaje-confirmacion';

  const color = tipo === 'error' ? 'var(--caf-noir)' : 'var(--lion)';

  mensajeConfirmacion.innerHTML = `
    <div class="mensaje-contenido" style="border-left: 5px solid ${color};">
      <h3>${titulo}</h3>
      <p>${mensaje}</p>
      <button class="cerrar-mensaje">Aceptar</button>
    </div>
  `;

  document.body.appendChild(mensajeConfirmacion);

  setTimeout(() => {
    mensajeConfirmacion.classList.add('visible');
  }, 10);

  mensajeConfirmacion.querySelector('.cerrar-mensaje').addEventListener('click', () => {
    mensajeConfirmacion.classList.remove('visible');
    setTimeout(() => {
      document.body.removeChild(mensajeConfirmacion);
    }, 300);
  });
}
