// --- 1. LÓGICA DEL OJO (Pestañeo y Pupila) ---
document.addEventListener('mousemove', (e) => {
    const ojoContenedor = document.getElementById('ojo-contenedor');
    const pupila = document.getElementById('pupila');
    if (!ojoContenedor || !pupila) return;

    const rect = ojoContenedor.getBoundingClientRect();
    const ojoCenterX = rect.left + rect.width / 2;
    const ojoCenterY = rect.top + rect.height / 2;

    const mouseX = e.clientX;
    const mouseY = e.clientY;

    const angulo = Math.atan2(mouseY - ojoCenterY, mouseX - ojoCenterX);
    const distanciaReal = Math.hypot(mouseX - ojoCenterX, mouseY - ojoCenterY);

    const radioInteraccion = 400; 
    let escala = 1 + (0.4 * (1 - Math.min(distanciaReal / radioInteraccion, 1)));

    const anchoPupilaOriginal = pupila.offsetWidth;
    const limiteMovimiento = (rect.width / 2) - ((anchoPupilaOriginal * escala) / 2) - 5;
    const distanciaFinal = Math.min(distanciaReal / 10, limiteMovimiento);

    const moverX = Math.cos(angulo) * distanciaFinal;
    const moverY = Math.sin(angulo) * distanciaFinal;

    pupila.style.transform = `translate(calc(-50% + ${moverX}px), calc(-50% + ${moverY}px)) scale(${escala})`;

   
    const botones = document.querySelectorAll('.btn');
    botones.forEach(btn => {
        const bRect = btn.getBoundingClientRect();
        const bCenterX = bRect.left + bRect.width / 2;
        const bCenterY = bRect.top + bRect.height / 2;
        const distBtn = Math.hypot(mouseX - bCenterX, mouseY - bCenterY);
        
       
        const umbral = 150;
        if (distBtn < umbral) {
            const factor = 1 + (0.3 * (1 - (distBtn / umbral))); 
            btn.style.transform = `scale(${factor})`;
        } else {
            btn.style.transform = `scale(1)`;
        }
    });

    

    actualizarNubes(mouseX, mouseY);
});

// --- SISTEMA DE NUBES (TRASERO Y FRONTAL) ---
const nubesBackground = document.getElementById('nubes-container');
const nubesForeground = document.getElementById('nubes-foreground');
const nubesArray = [];

function crearNubes(container, cantidad, esFrontal) {
    for (let i = 0; i < cantidad; i++) {
        const nube = document.createElement('div');
        const tipo = Math.floor(Math.random() * 3);
        const profundidad = esFrontal ? (Math.random() * 1.5 + 2) : (Math.random() * 2 + 0.5);
        
        nube.className = `nube tipo-${tipo} ${esFrontal ? 'nube-frontal' : ''}`;
        nube.style.left = Math.random() * 110 - 5 + '%';
        nube.style.top = Math.random() * 110 - 5 + '%';
        
        const escalaBase = esFrontal ? 0.6 : 0.9;
        nube.style.transform = `scale(${profundidad * escalaBase})`;

        container.appendChild(nube);
        nubesArray.push({ el: nube, depth: profundidad, scale: escalaBase });
    }
}
crearNubes(nubesBackground, 20, false);
crearNubes(nubesForeground, 8, true);

function actualizarNubes(mx, my) {
    const movX = (mx - window.innerWidth / 2) / (window.innerWidth / 2);
    const movY = (my - window.innerHeight / 2) / (window.innerHeight / 2);

    nubesArray.forEach(n => {
        const dX = movX * n.depth * 70; 
        const dY = movY * n.depth * 70;
        n.el.style.transform = `translate(${dX}px, ${dY}px) scale(${n.depth * n.scale})`;
    });
}

const parpado = document.getElementById('parpado');
function cerebroDelOjo() {
    parpado.classList.add('cerrado');
    setTimeout(() => {
        parpado.classList.remove('cerrado');
        if (Math.random() > 0.8) {
            setTimeout(() => {
                parpado.classList.add('cerrado');
                setTimeout(() => parpado.classList.remove('cerrado'), 150);
            }, 200);
        }
    }, 150);
    setTimeout(cerebroDelOjo, Math.random() * 5000 + 3000);
}
cerebroDelOjo();

// --- Efecto de atracción en botones sociales ---
document.addEventListener('mousemove', (e) => {
    const botones = document.querySelectorAll('.social-btn');
    botones.forEach(btn => {
        const rect = btn.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const dist = Math.hypot(e.clientX - centerX, e.clientY - centerY);

        if (dist < 150) { // Si el mouse está a menos de 150px
            const power = 1 - (dist / 150);
            btn.style.transform = `scale(${1 + power * 0.35})`;
        } else {
            btn.style.transform = `scale(1)`;
        }
    });
});

// --- Generador de nubes del susurro ---
function crearNubeSusurro() {
    const container = document.querySelector('.cara-wrapper');
    if (!container) return;

    const nube = document.createElement('div');
    nube.className = 'nube-susurro';
    
    // Ajusta estos valores según la posición de la boca en tu imagen
    nube.style.top = '70%'; 
    nube.style.right = '80%';
    
    const size = Math.random() * 10 + 5;
    nube.style.width = size + 60 + 'px';
    nube.style.height = size + 20 + 'px';
    
    container.appendChild(nube);
    setTimeout(() => nube.remove(), 5000);
}

// Crea una nube cada 800ms
setInterval(crearNubeSusurro, 800);