document.addEventListener('DOMContentLoaded', function () {
    const canvas = document.getElementById('forcesCanvas');
    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    let scale = 10; // Initialer Skalierungsfaktor

    let kraft = []; // Array für die Kräfte
    let kraftWinkel = []; // Array für die Winkel

    // Hintergrundnetz zeichnen
    function drawGrid() {
        ctx.strokeStyle = '#ddd';
        ctx.lineWidth = 0.5;
        for (let x = 0; x < canvas.width; x += 20) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
        }
        for (let y = 0; y < canvas.height; y += 20) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }
    }

    // Pfeil zeichnen
    function drawArrow(startX, startY, endX, endY, color, label) {
        const headLength = 10; // Länge des Pfeilkopfs
        const dx = endX - startX;
        const dy = endY - startY;
        const angle = Math.atan2(dy, dx);

        // Pfeillinie
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Pfeilkopf
        ctx.beginPath();
        ctx.moveTo(endX, endY);
        ctx.lineTo(endX - headLength * Math.cos(angle - Math.PI / 6), endY - headLength * Math.sin(angle - Math.PI / 6));
        ctx.lineTo(endX - headLength * Math.cos(angle + Math.PI / 6), endY - headLength * Math.sin(angle + Math.PI / 6));
        ctx.lineTo(endX, endY);
        ctx.fillStyle = color;
        ctx.fill();

        // Label
        ctx.font = "12px Arial";
        ctx.fillStyle = color;
        ctx.fillText(label, endX + 5, endY - 5);
    }

    // Funktion zum Berechnen der optimalen Skalierung
    function calculateScale() {
        const maxForce = Math.max(...kraft, 1); // Größte Kraft ermitteln, Standardwert 1 vermeiden Div/0
        const maxCanvasDimension = Math.min(canvas.width, canvas.height) / 2; // Hälfte der Canvas-Abmessung
        const scaleFactor = maxCanvasDimension / maxForce; // Skalierung basierend auf Canvas-Größe
        return Math.min(scaleFactor, scale); // Skalierung auf Benutzerlimit begrenzen
    }

    // Funktion zum Zeichnen der Kräfte und der Resultierenden Kraft
    function drawForces() {
        // Canvas leeren
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Hintergrundnetz neu zeichnen
        drawGrid();

        let xGes = 0;
        let yGes = 0;

        // Dynamische Skalierung berechnen
        const dynamicScale = calculateScale();

        // Kräfte zeichnen und Berechnungen durchführen
        kraft.forEach((force, index) => {
            const angleRad = kraftWinkel[index] * (Math.PI / 180); // Winkel in Bogenmaß
            const x = force * Math.cos(angleRad) * dynamicScale; // X-Koordinate
            const y = force * Math.sin(angleRad) * dynamicScale; // Y-Koordinate

            drawArrow(centerX, centerY, centerX + x, centerY - y, 'blue', `Kraft ${index + 1}`);

            // Berechnung der Komponenten der resultierenden Kraft
            xGes += force * Math.cos(angleRad);
            yGes += force * Math.sin(angleRad);
        });

        // Resultierende Kraft zeichnen
        const resultX = xGes * dynamicScale;
        const resultY = yGes * dynamicScale;
        drawArrow(centerX, centerY, centerX + resultX, centerY - resultY, 'red', 'Resultierende Kraft');

        // Berechnungen im HTML anzeigen
        const outputSection = document.getElementById('output-section');
        outputSection.innerHTML =
            `<div class="results">
                <h3>Berechnetes Ergebnis</h3>
                <p>Summe der Kräfte in X: ${xGes.toFixed(2)} N</p>
                <p>Summe der Kräfte in Y: ${yGes.toFixed(2)} N</p>
                <p>Gesamtkraft: ${Math.sqrt(xGes * xGes + yGes * yGes).toFixed(2)} N</p>
                <p>Richtung der resultierenden Kraft: ${(Math.atan2(yGes, xGes) * (180 / Math.PI)).toFixed(2)}°</p>
            </div>`;

        // Einzelne Rechenergebnisse in der Tabelle anzeigen
        const detailedResultsBody = document.getElementById('detailed-results-body');
        detailedResultsBody.innerHTML = '';  // Tabelle leeren
        kraft.forEach((force, index) => {
            const angleRad = kraftWinkel[index] * (Math.PI / 180);
            const Fx = force * Math.cos(angleRad);
            const Fy = force * Math.sin(angleRad);

            const row = document.createElement('tr');
            row.innerHTML =
                `<td>${index + 1}</td>
                <td>${force.toFixed(2)}</td>
                <td>${kraftWinkel[index]}</td>
                <td>${Math.cos(angleRad).toFixed(2)}</td>
                <td>${Math.sin(angleRad).toFixed(2)}</td>
                <td>${Fx.toFixed(2)}</td>
                <td>${Fy.toFixed(2)}</td>`;
            detailedResultsBody.appendChild(row);
        });
    }

    // Event-Listener für das Hinzufügen von Zeilen
    document.getElementById('add-row').addEventListener('click', function () {
        const tableBody = document.getElementById('force-table-body');
        const row = document.createElement('tr');
        row.innerHTML =
            `<td>${tableBody.children.length + 1}</td>
            <td><input type="number" name="force" class="force-input" required></td>
            <td><input type="number" name="angle" class="angle-input" required></td>`;
        tableBody.appendChild(row);

        // Event-Listener hinzufügen, um Änderungen sofort zu verarbeiten
        row.querySelector('.force-input').addEventListener('input', updateData);
        row.querySelector('.angle-input').addEventListener('input', updateData);
    });

    // Event-Listener für das Entfernen von Zeilen
    document.getElementById('remove-row').addEventListener('click', function () {
        const tableBody = document.getElementById('force-table-body');
        if (tableBody.children.length > 0) {
            tableBody.removeChild(tableBody.lastChild);
        }
    });

    // Funktion, um Daten sofort zu aktualisieren
    function updateData() {
        kraft = [];
        kraftWinkel = [];
        const rows = document.querySelectorAll('#force-table-body tr');
        rows.forEach(row => {
            const force = parseFloat(row.querySelector('.force-input').value);
            const angle = parseFloat(row.querySelector('.angle-input').value);
            if (!isNaN(force) && !isNaN(angle)) {
                kraft.push(force);
                kraftWinkel.push(angle);
            }
        });
        drawForces(); // Zeichnen und Berechnung neu ausführen
    }

    // Event-Listener für den Zoom-Regler
    document.getElementById('zoom-slider').addEventListener('input', function (event) {
        scale = parseFloat(event.target.value); // Setze den Maßstab auf den Wert des Sliders
        drawForces(); // Zeichnen und Berechnung neu ausführen
    });
});