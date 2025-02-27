fetch('http://localhost:5000/api/rooms')
    .then(response => response.json())
    .then(rooms => {
        const roomsContainer = document.getElementById('rooms');
        rooms.forEach(room => {
            const roomElement = document.createElement('div');
            roomElement.classList.add('room');  // Clases personalizadas
            roomElement.innerHTML = `
                <h3>${room.name}</h3>
                <p>${room.available ? 'Available' : 'Not available'}</p>
            `;
            roomsContainer.appendChild(roomElement);
        });
    })
    .catch(error => {
        console.error('Error al cargar las habitaciones:', error);
    });
