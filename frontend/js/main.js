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
    });

    document.addEventListener('click', function (e) {
        if (e.target.classList.contains('ver-mas')) {
          const nombreHabitacion = e.target.getAttribute('data-habitacion');
      
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
      
          const habitacion = habitacionesInfo[nombreHabitacion];
          if (habitacion) {
            document.getElementById('modal-title').textContent = habitacion.title;
            document.getElementById('modal-description').textContent = habitacion.description;
            document.getElementById('modal').style.display = 'block';
          }
        }
      });