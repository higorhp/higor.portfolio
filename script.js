// Função para verificar se o dispositivo é mobile
function isMobile() {
    return window.innerWidth <= 768;
}

const menuEl = document.querySelector('.menu');
const menuIconEl = document.querySelector('.menu-icon');
const dropdownMenu = document.querySelector('.dropdown');

menuEl.addEventListener('click', (e) => {
    if (dropdownMenu.contains(e.target)) return;

    e.stopPropagation();
    dropdownMenu.classList.toggle('show');
    menuEl.classList.toggle('open');
});

document.querySelector('.dropdown').addEventListener('mouseleave', () => {
    if (isMobile()) {
        dropdownMenu.classList.remove('show');
        menuEl.classList.remove('open');
    }
});

// Função para alterar a seção visível com animação suave
const sections = document.querySelectorAll('.sobre-mim, .projetos, .contato');
const homeSection = document.querySelector('.home');
const allSections = [homeSection, ...sections];
let currentSectionIndex = 0;

// Inicializa as seções
allSections.forEach(section => {
    section.classList.add('section-enter');
});

function changeSection(nextIndex) {
    if (nextIndex >= 0 && nextIndex < allSections.length) {
        const currentSection = allSections[currentSectionIndex];
        currentSection.classList.remove('section-enter-active');
        currentSection.style.opacity = '0';
        setTimeout(() => currentSection.style.display = 'none', 500);

        document.body.style.backgroundImage = 'url("background.jpg")';

        const nextSection = allSections[nextIndex];
        
        setTimeout(() => {
            nextSection.style.display = nextIndex === 0 ? 'flex' : 'block';
            nextSection.style.opacity = '1';
            nextSection.style.visibility = 'visible';
            nextSection.style.pointerEvents = 'auto';
            
            if (isMobile() && nextIndex !== 0) {
                nextSection.scrollTop = 1;
                if (nextSection.scrollTop !== 0) {
                     nextSection.scrollTop = 0;
                }
                
                setTimeout(() => {
                    nextSection.style.overflowY = 'hidden';
                    void nextSection.offsetHeight;
                    nextSection.style.overflowY = 'auto';
                }, 50);
            } 

            setTimeout(() => {
                nextSection.classList.add('section-enter-active');
                nextSection.style.opacity = '1';
            }, 50);
        }, 500);

        currentSectionIndex = nextIndex;

        if (isMobile()) {
            const dropdownMenu = document.querySelector('.dropdown');
            dropdownMenu.classList.remove('show');
        }
    }
}

// Navegação com scroll
let isScrolling = false;
let isHoveringCard = false;

const projectCards = document.querySelectorAll('.project-card');

projectCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        isHoveringCard = true;
    });

    card.addEventListener('mouseleave', () => {
        isHoveringCard = false;
    });
});


document.addEventListener('wheel', (event) => {
    if (isScrolling || isHoveringCard) return;

    const modal = document.getElementById('project-modal');
    if (modal.style.display === 'flex') {
        return;
    }

    const currentSection = allSections[currentSectionIndex];

    const isModal = currentSectionIndex > 0;
    const isMouseOverModal = isModal && currentSection.contains(event.target);

    if (isMouseOverModal) {
        return;
    }

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
        e.preventDefault();

        const targetId = link.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);

        let targetIndex = allSections.findIndex(section => section && section.id === targetId);

        if (targetIndex !== -1 && targetIndex !== currentSectionIndex) {
            changeSection(targetIndex);
        }

        dropdownMenu.classList.remove('show');
        menuEl.classList.remove('open');
    });
});

// Função para mover a imagem de fundo com suavidade (Lerp)
let targetX = 50;
let targetY = 50;
let currentX = 50;
let currentY = 50;

const moveIntensity = 2;
const smoothness = 0.05;

document.addEventListener('mousemove', (event) => {
    const xPercent = (event.clientX / window.innerWidth) - 0.5;
    const yPercent = (event.clientY / window.innerHeight) - 0.5;

    targetX = 50 + (xPercent * moveIntensity);
    targetY = 50 + (yPercent * moveIntensity);
});

function animateBackground() {
    currentX += (targetX - currentX) * smoothness;
    currentY += (targetY - currentY) * smoothness;

    if (Math.abs(targetX - currentX) > 0.01 || Math.abs(targetY - currentY) > 0.01) {
        document.body.style.backgroundPosition = `${currentX}% ${currentY}%`;
    }

    requestAnimationFrame(animateBackground);
}

requestAnimationFrame(animateBackground);

const textElements = document.querySelectorAll('h1, h2, h3, p');

textElements.forEach(element => {
    element.addEventListener('mouseover', () => {
        element.classList.add('enlarge');
    });

    element.addEventListener('mouseout', () => {
        element.classList.remove('enlarge');
    });
});

// Efeito de digitação (Typewriter) em Loop
const textToType = "Higor Souza";
const typingElement = document.getElementById('typing-name');
let charIndex = 0;
let isDeleting = false;

function typeWriter() {
    if (!isDeleting) {
        if (charIndex < textToType.length) {
            typingElement.textContent += textToType.charAt(charIndex);
            charIndex++;
            setTimeout(typeWriter, 100);
        } else {
            isDeleting = true;
            setTimeout(typeWriter, 10000);
        }
    } else {
        if (charIndex > 0) {
            typingElement.textContent = textToType.substring(0, charIndex - 1);
            charIndex--;
            setTimeout(typeWriter, 50);
        } else {
            isDeleting = false;
            setTimeout(typeWriter, 500);
        }
    }
}

setTimeout(typeWriter, 500);

function showInfo(type) {
    const phoneInfo = document.getElementById('phone-info');
    const emailInfo = document.getElementById('email-info');
    const locationInfo = document.getElementById('location-info');

    phoneInfo.classList.remove('show');
    emailInfo.classList.remove('show');
    locationInfo.classList.remove('show');

    if (type === 'phone') {
        phoneInfo.textContent = '(11)99641-5237';
        phoneInfo.classList.add('show');
    } else if (type === 'email') {
        emailInfo.textContent = 'higorpacheco_@outlook.com';
        emailInfo.classList.add('show');
    } else if (type === 'location') {
        locationInfo.textContent = 'Cotia, SP';
        locationInfo.classList.add('show');
    }
}


// Modal Logic
const currentLang = (document.documentElement.lang || '')
    .toLowerCase()
    .startsWith('pt')
    ? 'pt'
    : 'en';

const uiText = {
    pt: {
        privateRepo: 'Repositório Privado',
        viewOnGitHub: 'Ver no GitHub',
        jarvisTitle: 'Projeto Jarvis'
    },
    en: {
        privateRepo: 'Private Repository',
        viewOnGitHub: 'View on GitHub',
        jarvisTitle: 'Jarvis Project'
    }
};

const t = uiText[currentLang];

const projectData = {
    'granamind': {
        title: '',
        desc: document.getElementById('desc-granamind').innerHTML,
        stack: '',
        github: 'private'
    },
    'botpromo': {
        title: '',
        desc: document.getElementById('desc-botpromo').innerHTML,
        stack: '',
        github: 'private'
    },
    'jarvis': {
        title: t.jarvisTitle,
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

    const githubBtn = document.getElementById('modal-github');
    if (data.github === 'private') {
        githubBtn.removeAttribute('href');
        githubBtn.classList.add('btn-disabled');
        githubBtn.innerHTML = `<i class="fa-solid fa-lock"></i> ${t.privateRepo}`;
    } else {
        githubBtn.href = data.github;
        githubBtn.classList.remove('btn-disabled');
        githubBtn.innerHTML = `<i class="fa-brands fa-github"></i> ${t.viewOnGitHub}`;
    }

    const modal = document.getElementById('project-modal');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    setTimeout(() => modal.classList.add('show'), 10);
}

function closeModal() {
    const modal = document.getElementById('project-modal');
    modal.classList.remove('show');
    document.body.style.overflow = '';
    setTimeout(() => modal.style.display = 'none', 300);
}

window.addEventListener('click', (event) => {
    const modal = document.getElementById('project-modal');
    if (event.target == modal) {
        closeModal();
    }
});

const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');
let particlesArray;

const particleConfig = {
    count: 100,
    color: 'rgba(255, 87, 34, 1)',
    connectionDistance: 150,
    mouseDistance: 200,
    speed: 0.5
};

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles();
});

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

function initTiltEffect() {
    const cards = document.querySelectorAll('.project-card');
    
    if (window.innerWidth <= 768) return;

    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transition = 'none';
        });

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -5; 
            const rotateY = ((x - centerX) / centerX) * 5;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transition = 'all 0.5s ease';
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        });
    });
}

function initScrollReveal() {
    const elements = document.querySelectorAll('.project-card, .skills-group li, .contact-card, .section-title');
    
    elements.forEach(el => el.classList.add('reveal'));

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px'
    });

    elements.forEach(el => observer.observe(el));
}

initTiltEffect();
initScrollReveal();
