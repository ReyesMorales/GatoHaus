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
fetch('http://localhost:5000/api/rooms')
  .then(response => response.json())
  .then(rooms => {
    const roomsContainer = document.getElementById('rooms');
    roomsContainer.innerHTML = ''; 

    rooms.forEach(room => {
      const card = document.createElement('div');
      card.classList.add('card');

      card.innerHTML = `
        <h3>${room.tipo} ${room.room_number}</h3>
        <img src="/assets/Imagen_habitacion1.jpg" alt="${room.tipo}">
        <button class="ver-mas" data-habitacion="${room.tipo.toLowerCase()}">Ver más</button>
      `;

      roomsContainer.appendChild(card);
    });
  })
  .catch(error => {
    console.error('Error al cargar las habitaciones:', error);
    mostrarMensaje("Error", "No se pudieron cargar las habitaciones.", "error");
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

// --- 4. MOSTRAR FORMULARIO AL CLIC EN "RESERVAR" ---
document.addEventListener('DOMContentLoaded', () => {
  const reservarBtn = document.getElementById('reservar-button');
  const formularioReserva = document.getElementById('formulario-reserva');
  const calendarioInput = document.getElementById('fecha-reserva');

  if (reservarBtn && formularioReserva) {
    reservarBtn.addEventListener('click', () => {
      formularioReserva.style.display = 'block';
      calendarioInput._flatpickr?.open();
    });
  }

  // --- 5. CONFIGURAR FLATPICKR ---
  if (calendarioInput) {
    flatpickr(calendarioInput, {
      mode: "range",
      minDate: "today",
      dateFormat: "Y-m-d",
      locale: {
        firstDayOfWeek: 1,
        rangeSeparator: ' hasta ',
      },
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

    fetch(`http://localhost:5000/api/rooms/${habitacion}/reserve`, {
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
