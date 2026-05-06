// VARIABLES GLOBALES
const nubesArray =[];
const nubesBackground = document.getElementById('nubes-container');
const nubesForeground = document.getElementById('nubes-foreground');

// --- 1. GENERADOR DE NUBES 3D (PARALLAX + FLOTAR) ---
function crearNubes(container, cantidad, esFrontal) {
    for (let i = 0; i < cantidad; i++) {
    
        const wrapper = document.createElement('div');
        wrapper.className = 'nube-wrapper';
        wrapper.style.left = Math.random() * 110 - 5 + '%';
        wrapper.style.top = Math.random() * 110 - 5 + '%';
        
        // Nube interior para el CSS (Flotar)
        const nube = document.createElement('div');
        const tipo = Math.floor(Math.random() * 3);
        nube.className = `nube tipo-${tipo} ${esFrontal ? 'nube-frontal' : ''}`;
        nube.style.animationDelay = `-${Math.random() * 6}s`; // Desfase natural
        
        const profundidad = esFrontal ? (Math.random() * 1.5 + 2) : (Math.random() * 2 + 0.5);
        const escalaBase = esFrontal ? 0.3 : 0.6;
        
        wrapper.style.transform = `scale(${profundidad * escalaBase})`;

        wrapper.appendChild(nube);
        container.appendChild(wrapper);
        
        nubesArray.push({ 
            el: wrapper, 
            depth: profundidad, 
            scale: escalaBase,
            direccion: esFrontal ? 1 : -1 
        });
    }
}
crearNubes(nubesBackground, 20, false);
crearNubes(nubesForeground, 8, true);


// --- 2. LÓGICA PRINCIPAL DEL MOUSE (Ojo, Botones y Parallax) ---
document.addEventListener('mousemove', (e) => {
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    const movX = (mouseX - window.innerWidth / 2) / (window.innerWidth / 2);
    const movY = (mouseY - window.innerHeight / 2) / (window.innerHeight / 2);

    nubesArray.forEach(n => {
        const dX = movX * n.depth * 80 * n.direccion; 
        const dY = movY * n.depth * 80 * n.direccion;
        n.el.style.transform = `translate(${dX}px, ${dY}px) scale(${n.depth * n.scale})`;
    });
    const textosHero = document.querySelectorAll('.hero h1, .hero p');
    textosHero.forEach(txt => {
        const rect = txt.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const distTxt = Math.hypot(mouseX - centerX, mouseY - centerY);
    
        const umbralTxt = 250; 
        if (distTxt < umbralTxt) {
        
            const factorTxt = 1 + (0.05 * (1 - (distTxt / umbralTxt))); 
            txt.style.transform = `scale(${factorTxt})`;
        } else {
            txt.style.transform = `scale(1)`;
        }
    });

     // B) EFECTO PARALLAX EN EL TEXTO (HERO) - Sutil y 3D
    const hero = document.querySelector('.hero');
    if (hero) {
        const heroX = movX * -5; 
        const heroY = movY * -5;
        
        const rotX = movY * 2; 
        const rotY = movX * -1.5; 
        
        hero.style.transform = `translate(${heroX}px, ${heroY}px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
    }
    
// D) EFECTO PARALLAX SUTIL EN LA SILUETA (CARA NEGRA)
    const caraWrapper = document.querySelector('.cara-wrapper');
    if (caraWrapper) {
    
        const caraX = movX * 0;
        const caraY = movY * -5;
   
        caraWrapper.style.transform = `translate(${caraX}px, ${caraY}px) scale(1.02)`;
    }


    // B) MOVIMIENTO DE LA PUPILA
    const ojoContenedor = document.getElementById('ojo-contenedor');
    const pupila = document.getElementById('pupila');
    if (ojoContenedor && pupila) {
        const rect = ojoContenedor.getBoundingClientRect();
        const ojoCenterX = rect.left + rect.width / 2;
        const ojoCenterY = rect.top + rect.height / 2;

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
    }

    const botones = document.querySelectorAll('.social-btn');
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
            
            if(!btn.classList.contains('susurrado')) {
                btn.style.transform = `scale(1)`;
            }
        }
    });
});


// --- 3. PESTAÑEO DEL OJO ---
const parpado = document.getElementById('parpado');
function cerebroDelOjo() {
    if(!parpado) return;
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


function crearNubeSusurro() {
    const caraWrapper = document.querySelector('.cara-wrapper');
    if (!caraWrapper) return;
    
    // Coordenadas de la boca
    const caraRect = caraWrapper.getBoundingClientRect();
    const bocaX = caraRect.left + (caraRect.width * 0.15); 
    const bocaY = caraRect.top + (caraRect.height * 0.70);

    // Seleccionar botón destino al azar
    const botones = document.querySelectorAll('.hero .btn');
    if (botones.length === 0) return;
    const targetBtn = botones[Math.floor(Math.random() * botones.length)];
    const btnRect = targetBtn.getBoundingClientRect();

    // Centro del botón destino
    const destinoX = btnRect.left + (btnRect.width / 2); 
    const destinoY = btnRect.top + (btnRect.height / 2);

    // Crear la nube
    const nube = document.createElement('div');
    nube.className = 'nube-susurro';
    
    const size = Math.random() * 10 + 15;
    nube.style.width = (size * 1.5) + 'px';
    nube.style.height = size + 'px';
    nube.style.left = `${bocaX}px`;
    nube.style.top = `${bocaY}px`;
    
    document.body.appendChild(nube); 

    const tiempoAnimacion = Math.random() * 1500 + 2000;

  
    const midX = bocaX - ((bocaX - destinoX) / 2);
    const midY = Math.min(bocaY, destinoY) - 80;


    const animacionViaje = nube.animate([
        { transform: `translate(-50%, -50%) scale(0)`, opacity: 0, offset: 0 },
        { transform: `translate(calc(-50% + ${midX - bocaX}px), calc(-50% + ${midY - bocaY}px)) scale(1)`, opacity: 0.8, offset: 0.5 },
        { transform: `translate(calc(-50% + ${destinoX - bocaX}px), calc(-50% + ${destinoY - bocaY}px)) scale(1.2)`, opacity: 0.7, offset: 1 }
    ], {
        duration: tiempoAnimacion,
        easing: 'ease-in-out',
        fill: 'forwards'
    });

   
    animacionViaje.onfinish = () => {
        
        targetBtn.classList.add('susurrado');
        setTimeout(() => targetBtn.classList.remove('susurrado'), 350);

        const animacionImpacto = nube.animate([
            { transform: `translate(calc(-50% + ${destinoX - bocaX}px), calc(-50% + ${destinoY - bocaY}px)) scale(1.2)`, opacity: 0.7 },
            { transform: `translate(calc(-50% + ${destinoX - bocaX}px), calc(-50% + ${destinoY - bocaY}px)) scale(2.5)`, opacity: 0 }
        ], {
            duration: 400,
            easing: 'ease-out',
            fill: 'forwards'
        });

        animacionImpacto.onfinish = () => nube.remove();
    };
}

setInterval(crearNubeSusurro, 1500);