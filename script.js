document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector('#contact-form');

    form.addEventListener('submit', async function (event) {
        event.preventDefault();

        const data = {
            name: document.getElementById('name').value.trim(),
            email: document.getElementById('email').value.trim(),
            location: document.getElementById('location').value.trim(),
            latitude: document.getElementById('latitude').value,
            longitude: document.getElementById('longitude').value,
            message: document.getElementById('message').value.trim()
        };

        try {
            const response = await fetch('/submit-request', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const result = await response.json();
            alert(result.message);
            if (response.ok) form.reset();
        } catch (error) {
            alert('Error submitting request.');
            console.error(error);
        }
    });

    window.initMap = function () {
        const map = new google.maps.Map(document.getElementById('map'), {
            center: { lat: 19.0760, lng: 72.8777 },
            zoom: 10
        });

        const marker = new google.maps.Marker({
            position: { lat: 19.0760, lng: 72.8777 },
            map: map,
            draggable: true
        });

        google.maps.event.addListener(marker, 'position_changed', function () {
            const position = marker.getPosition();
            document.getElementById('latitude').value = position.lat();
            document.getElementById('longitude').value = position.lng();
        });
    };
});
