// Função para verificar se o dispositivo é mobile
function isMobile() {
    return window.innerWidth <= 768; // Considera dispositivos com largura menor ou igual a 768px
}

const menuEl = document.querySelector('.menu');
const menuIconEl = document.querySelector('.menu-icon');
const dropdownMenu = document.querySelector('.dropdown');

// Adiciona o evento de clique ao container do menu inteiro para melhor usabilidade
menuEl.addEventListener('click', (e) => {
    // Evita que cliques dentro do dropdown fechem/abram o menu indesejadamente
    if (dropdownMenu.contains(e.target)) return;

    e.stopPropagation();
    dropdownMenu.classList.toggle('show');
    menuEl.classList.toggle('open');
});

document.querySelector('.dropdown').addEventListener('mouseleave', () => {
    if (isMobile()) {
        dropdownMenu.classList.remove('show'); // Remove a classe show para ocultar
        menuEl.classList.remove('open');
    }
});

// Função para alterar a seção visível com animação suave
const sections = document.querySelectorAll('.sobre-mim, .projetos, .contato');
const homeSection = document.querySelector('.home');
const allSections = [homeSection, ...sections];
let currentSectionIndex = 0; // Índice da seção visível atual

// Inicializa as seções com a classe de entrada
allSections.forEach(section => {
    section.classList.add('section-enter');
});

// Função para trocar a seção visível
function changeSection(nextIndex) {
    if (nextIndex >= 0 && nextIndex < allSections.length) {
        const currentSection = allSections[currentSectionIndex];
        currentSection.classList.remove('section-enter-active');
        currentSection.style.opacity = '0';
        setTimeout(() => currentSection.style.display = 'none', 500);

        // Troca o fundo se necessário
        // document.body.style.transition = 'background 1s ease'; // Desabilitado para não conflitar com movimento do mouse
        document.body.style.backgroundImage = 'url("background.jpg")';

        // Exibe a próxima seção
        const nextSection = allSections[nextIndex];
        
        setTimeout(() => {
            // FORCE DISPLAY: Garante que o elemento apareça
            nextSection.style.display = nextIndex === 0 ? 'flex' : 'block';
            nextSection.style.opacity = '1';
            nextSection.style.visibility = 'visible';
            nextSection.style.pointerEvents = 'auto';
            
            // Correção para Mobile: Força o scroll para o topo e recalcula overflow
            if (isMobile() && nextIndex !== 0) {
                // Removemos o overflow hidden do body pois o CSS já lida com isso e pode causar conflito
                // document.body.style.overflow = 'hidden'; 

                // Tenta destravar o scroll movendo 1px para "acordar" a engine
                nextSection.scrollTop = 1;
                if (nextSection.scrollTop !== 0) {
                     nextSection.scrollTop = 0;
                }
                
                // Hack para forçar reflow e destravar scroll no iOS/Android
                // Adicionando um pequeno delay para garantir que o display block tenha efeito
                setTimeout(() => {
                    nextSection.style.overflowY = 'hidden';
                    void nextSection.offsetHeight; // Força repaint
                    nextSection.style.overflowY = 'auto';
                }, 50);
            } 
            // Se for Home (index 0), não precisamos fazer nada pois ela tem scroll nativo ou é fixa

            setTimeout(() => {
                nextSection.classList.add('section-enter-active');
                // Redundância para garantir
                nextSection.style.opacity = '1';
            }, 50);
        }, 500);

        currentSectionIndex = nextIndex;

        // Fecha o menu dropdown em dispositivos móveis após mudar de seção
        if (isMobile()) {
            const dropdownMenu = document.querySelector('.dropdown');
            dropdownMenu.classList.remove('show');
        }
    }
}

// Navegação com scroll
let isScrolling = false;
let isHoveringCard = false; // Flag para verificar se o mouse está sobre um card

// Seleciona todos os cards
const projectCards = document.querySelectorAll('.project-card');

// Adiciona eventos de mouse sobre cada card
projectCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        isHoveringCard = true; // O mouse está sobre o card
    });

    card.addEventListener('mouseleave', () => {
        isHoveringCard = false; // O mouse saiu do card
    });
});

document.addEventListener('wheel', (event) => {
    if (isScrolling || isHoveringCard) return;

    // Verifica se o modal está aberto (visível)
    const modal = document.getElementById('project-modal');
    if (modal.style.display === 'flex') {
        return; // Bloqueia a navegação de seções se o modal estiver aberto
    }

    const currentSection = allSections[currentSectionIndex];

    // Verifica se é uma seção modal (não é a Home) e se o mouse está sobre ela
    const isModal = currentSectionIndex > 0;
    const isMouseOverModal = isModal && currentSection.contains(event.target);

    if (isMouseOverModal) {
        // Se o mouse estiver DENTRO da modal:
        // Permite apenas o scroll interno (nativo do navegador).
        // Não muda de seção, mesmo chegando ao fim.
        return;
    }

    // Se o mouse estiver FORA da modal (ou na Home):
    // Muda de seção ao rolar.
    if (event.deltaY > 0) {
        if (currentSectionIndex < allSections.length - 1) {
            isScrolling = true;
            changeSection(currentSectionIndex + 1);
            setTimeout(() => isScrolling = false, 1000);
        }
    } else {
        if (currentSectionIndex > 0) {
            isScrolling = true;
            changeSection(currentSectionIndex - 1);
            setTimeout(() => isScrolling = false, 1000);
        }
    }
});

document.querySelectorAll('.dropdown a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault(); // Previne o comportamento padrão do link

        const targetId = link.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);

        // Encontra o índice da seção alvo
        let targetIndex = -1;
        if (targetId === 'home') targetIndex = 0;
        else if (targetId === 'sobre-mim') targetIndex = 1;
        else if (targetId === 'projetos') targetIndex = 2;
        else if (targetId === 'contato') targetIndex = 3;

        if (targetIndex !== -1 && targetIndex !== currentSectionIndex) {
            changeSection(targetIndex);
        }

        dropdownMenu.classList.remove('show');
        menuEl.classList.remove('open');
    });
});

// Função para mover a imagem de fundo com suavidade (Lerp)
// Variáveis de estado
let targetX = 50;
let targetY = 50;
let currentX = 50;
let currentY = 50;

// Configurações
const moveIntensity = 2; // Quanto o fundo se mexe (menor = mais sutil)
const smoothness = 0.05; // Velocidade da suavização (0.01 = muito lento, 0.1 = rápido)

document.addEventListener('mousemove', (event) => {
    // Calcula a posição alvo baseada no mouse
    // Centro da tela é 0,0. Bordas são -0.5, -0.5 a 0.5, 0.5
    const xPercent = (event.clientX / window.innerWidth) - 0.5;
    const yPercent = (event.clientY / window.innerHeight) - 0.5;

    // Define o novo alvo (50% é o centro)
    targetX = 50 + (xPercent * moveIntensity);
    targetY = 50 + (yPercent * moveIntensity);
});

function animateBackground() {
    // Interpolação Linear (Lerp): move o valor atual 5% em direção ao alvo a cada frame
    currentX += (targetX - currentX) * smoothness;
    currentY += (targetY - currentY) * smoothness;

    // Aplica o estilo apenas se houver mudança significativa (otimização)
    if (Math.abs(targetX - currentX) > 0.01 || Math.abs(targetY - currentY) > 0.01) {
        document.body.style.backgroundPosition = `${currentX}% ${currentY}%`;
    }

    requestAnimationFrame(animateBackground);
}

// Inicia o loop de animação
requestAnimationFrame(animateBackground);

// Seleciona todos os elementos de texto que você deseja afetar
const textElements = document.querySelectorAll('h1, h2, h3, p'); // Adicione outros seletores conforme necessário

textElements.forEach(element => {
    // Adiciona o evento mouseover
    element.addEventListener('mouseover', () => {
        element.classList.add('enlarge'); // Adiciona a classe de aumento
    });

    // Adiciona o evento mouseout
    element.addEventListener('mouseout', () => {
        element.classList.remove('enlarge'); // Remove a classe de aumento
    });
});

// Efeito de digitação (Typewriter) em Loop
const textToType = "Higor Souza";
const typingElement = document.getElementById('typing-name');
let charIndex = 0;
let isDeleting = false;

function typeWriter() {
    if (!isDeleting) {
        // Digitando
        if (charIndex < textToType.length) {
            typingElement.textContent += textToType.charAt(charIndex);
            charIndex++;
            setTimeout(typeWriter, 100);
        } else {
            // Terminou de digitar, espera 10s antes de apagar
            isDeleting = true;
            setTimeout(typeWriter, 10000);
        }
    } else {
        // Apagando
        if (charIndex > 0) {
            typingElement.textContent = textToType.substring(0, charIndex - 1);
            charIndex--;
            setTimeout(typeWriter, 50);
        } else {
            // Terminou de apagar, recomeça a digitar
            isDeleting = false;
            setTimeout(typeWriter, 500);
        }
    }
}

// Inicia a digitação após um pequeno delay
setTimeout(typeWriter, 500);

// Função para mostrar as informações ao clicar no ícone
function showInfo(type) {
    const phoneInfo = document.getElementById('phone-info');
    const emailInfo = document.getElementById('email-info');
    const locationInfo = document.getElementById('location-info');

    // Ocultar todas as informações
    phoneInfo.classList.remove('show');
    emailInfo.classList.remove('show');
    locationInfo.classList.remove('show');

    // Exibir a informação correta ao clicar
    if (type === 'phone') {
        phoneInfo.textContent = '(11)99641-5237'; // Substitua pelo seu número real
        phoneInfo.classList.add('show');
    } else if (type === 'email') {
        emailInfo.textContent = 'higorpacheco_@outlook.com'; // Substitua pelo seu e-mail real
        emailInfo.classList.add('show');
    } else if (type === 'location') {
        locationInfo.textContent = 'Cotia, SP'; // Substitua pelo seu local real
        locationInfo.classList.add('show');
    }
}

// Modal Logic
const projectData = {
    'granamind': {
        title: '',
        desc: document.getElementById('desc-granamind').innerHTML,
        stack: '',
        github: 'https://github.com/higorhp/finance-flow-main'
    },
    'botpromo': {
        title: '',
        desc: document.getElementById('desc-botpromo').innerHTML,
        stack: '',
        github: 'https://github.com/higorhp'
    },
    'jarvis': {
        title: 'Projeto Jarvis',
        desc: 'Assistente virtual desenvolvido em Python para automação residencial e de tarefas. Utiliza reconhecimento de voz para executar comandos como acender luzes, abrir programas, buscar informações na web e controlar o sistema operacional. Integra APIs de clima, notícias e controle de hardware.',
        stack: 'Python • SpeechRecognition • PyAudio • Requests',
        github: 'https://github.com/higorhp'
    },
    'portfolio': {
        title: '',
        desc: document.getElementById('desc-portfolio').innerHTML,
        stack: '',
        github: 'https://github.com/higorhp/higor.portfolio'
    },
    'consolidator': {
        title: '',
        desc: document.getElementById('desc-consolidator').innerHTML,
        stack: '',
        github: 'https://github.com/higorhp/consolidar_automatico/blob/main/Consolidar_planilhas.py'
    }
};

function openModal(projectId) {
    const data = projectData[projectId];
    if (!data) return;

    document.getElementById('modal-title').textContent = data.title;
    document.getElementById('modal-desc').innerHTML = data.desc;
    // document.getElementById('modal-stack').textContent = 'Stack: ' + data.stack;
    document.getElementById('modal-github').href = data.github;

    const modal = document.getElementById('project-modal');
    modal.style.display = 'flex';
    // Trava o scroll da página principal
    document.body.style.overflow = 'hidden';
    setTimeout(() => modal.classList.add('show'), 10);
}

function closeModal() {
    const modal = document.getElementById('project-modal');
    modal.classList.remove('show');
    // Libera o scroll da página principal
    document.body.style.overflow = '';
    setTimeout(() => modal.style.display = 'none', 300);
}

window.addEventListener('click', (event) => {
    const modal = document.getElementById('project-modal');
    if (event.target == modal) {
        closeModal();
    }
});

/* =========================================
   Particle Network Animation
   ========================================= */
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');
let particlesArray;

// Configurações
const particleConfig = {
    count: 100,            // Quantidade de partículas
    color: 'rgba(255, 87, 34, 1)', // Cor base (Laranja do tema)
    connectionDistance: 150, // Distância máxima para conectar
    mouseDistance: 200,      // Raio de interação do mouse
    speed: 0.5               // Velocidade base
};

// Ajusta o tamanho do canvas
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles();
});

// Mouse position
const mouse = {
    x: null,
    y: null
}

window.addEventListener('mousemove', (event) => {
    mouse.x = event.x;
    mouse.y = event.y;
});

window.addEventListener('mouseout', () => {
    mouse.x = undefined;
    mouse.y = undefined;
});

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * particleConfig.speed;
        this.vy = (Math.random() - 0.5) * particleConfig.speed;
        this.size = Math.random() * 2 + 1;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        // Bater nas bordas e voltar
        if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
        if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = particleConfig.color;
        ctx.fill();
    }
}

function initParticles() {
    particlesArray = [];
    // Ajusta quantidade baseado no tamanho da tela
    const count = (canvas.width * canvas.height) / 9000; 
    for (let i = 0; i < count; i++) {
        particlesArray.push(new Particle());
    }
}

function animateParticles() {
    requestAnimationFrame(animateParticles);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();

        // Conexões
        for (let j = i; j < particlesArray.length; j++) {
            const dx = particlesArray[i].x - particlesArray[j].x;
            const dy = particlesArray[i].y - particlesArray[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < particleConfig.connectionDistance) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(255, 87, 34, ${1 - distance/particleConfig.connectionDistance})`;
                ctx.lineWidth = 1;
                ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
                ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
                ctx.stroke();
            }
        }
        
        // Conexão com Mouse
        if (mouse.x != undefined) {
             const dx = particlesArray[i].x - mouse.x;
             const dy = particlesArray[i].y - mouse.y;
             const distance = Math.sqrt(dx*dx + dy*dy);
             
             if (distance < particleConfig.mouseDistance) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(255, 87, 34, ${1 - distance/particleConfig.mouseDistance})`;
                ctx.lineWidth = 1;
                ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
                ctx.lineTo(mouse.x, mouse.y);
                ctx.stroke();
             }
        }
    }
}

initParticles();
animateParticles();

/* =========================================
   3D Tilt Effect for Project Cards
   ========================================= */
function initTiltEffect() {
    const cards = document.querySelectorAll('.project-card');
    
    // Verifica se não é mobile antes de aplicar o efeito
    if (window.innerWidth <= 768) return;

    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            // Remove a transição suave para movimento instantâneo
            card.style.transition = 'none';
        });

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Centro do card
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Calcula rotação baseada na posição do mouse
            // Inverte Y para tilt correto (mouse sobe -> topo inclina para trás)
            const rotateX = ((y - centerY) / centerY) * -5; 
            const rotateY = ((x - centerX) / centerX) * 5;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            // Restaura transição suave para resetar
            card.style.transition = 'all 0.5s ease';
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        });
    });
}

/* =========================================
   Scroll Reveal Animation
   ========================================= */
function initScrollReveal() {
    // Seleciona elementos para animar
    const elements = document.querySelectorAll('.project-card, .skills-group li, .contact-card, .section-title');
    
    // Adiciona classe inicial
    elements.forEach(el => el.classList.add('reveal'));

    // Configura o Observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-visible');
                observer.unobserve(entry.target); // Anima apenas uma vez
            }
        });
    }, {
        threshold: 0.1, // 10% visível para disparar
        rootMargin: '0px'
    });

    elements.forEach(el => observer.observe(el));
}

// Inicializa as novas funcionalidades
initTiltEffect();
initScrollReveal();