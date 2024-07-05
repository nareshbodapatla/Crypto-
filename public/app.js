document.addEventListener('DOMContentLoaded', async () => {
    const response = await fetch('/api/crypto');
    const data = await response.json();

    const tableBody = document.querySelector('#crypto-table tbody');
    tableBody.innerHTML = '';

    data.forEach((crypto) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${crypto.name}</td>
            <td>${crypto.last}</td>
            <td>${crypto.buy}</td>
            <td>${crypto.sell}</td>
            <td>${crypto.volume}</td>
            <td>${crypto.base_unit}</td>
        `;
        tableBody.appendChild(row);
    });


    // Theme toggle button functionality
    const themeButton = document.getElementById('theme-button');
    themeButton.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
    });

    // Timer functionality
    let timer = 300; // 5 minutes in seconds
    const timerElement = document.getElementById('timer');

    const updateTimer = () => {
        const minutes = Math.floor(timer / 60);
        const seconds = timer % 60;
        timerElement.textContent = `${minutes}:${seconds < 5 ? '0' : ''}${seconds}`;
        if (timer > 0) {
            timer--;
        } else {
            timer = 300; // Reset timer to 5 minutes
        }
    };

    const timerInterval = setInterval(updateTimer, 1000);
    updateTimer(); // Initialize the timer display
});
