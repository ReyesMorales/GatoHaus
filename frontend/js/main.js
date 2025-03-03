fetch('http://localhost:5000/api/rooms')
    .then(response => response.json())
    .then(rooms => {
        const roomsContainer = document.getElementById('rooms');
        rooms.forEach(room => {
            const roomElement = document.createElement('div');
            roomElement.classList.add('room'); 

            // Si la habitación está reservada, le añadimos la clase 'reserved'
            if (!room.available) {
                roomElement.classList.add('reserved');
            }

            roomElement.innerHTML = `
                <h3>${room.name}</h3>
                <p>${room.available ? 'Available' : 'Not available'}</p>
                <button class="reserve-btn" ${!room.available ? 'disabled' : ''}>Reserve</button>
            `;

            // Agregar el evento de reserva
            const reserveButton = roomElement.querySelector('.reserve-btn');
            reserveButton.addEventListener('click', () => {
                // Enviar la solicitud al backend para reservar la habitación
                fetch(`http://localhost:5000/api/rooms/${encodeURIComponent(room.name)}/reserve`, {
                    method: 'PUT',
                })
                .then(response => response.json())
                .then(updatedRoom => {
                    alert(`¡Reserva confirmada para ${updatedRoom.name}!`);
                    // Actualizar la vista en el frontend
                    roomElement.querySelector('p').textContent = 'Not available';
                    roomElement.classList.add('reserved');  // Añadir la clase reservada
                    reserveButton.disabled = true;  
                })
                .catch(error => {
                    console.error('Error al hacer la reserva:', error);
                });
            });
            roomsContainer.appendChild(roomElement);
        });
    })
    .catch(error => {
        console.error('Error al cargar las habitaciones:', error);
    });
