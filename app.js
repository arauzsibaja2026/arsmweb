document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. Sticky Header & Menu Scroll Trigger
  // ==========================================
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Smooth scroll offsets for sticky header
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        // Close mobile menu if open
        navMenu.classList.remove('active');
        menuToggle.classList.remove('active');

        const headerHeight = header.offsetHeight;
        const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ==========================================
  // 2. Mobile Menu Toggle
  // ==========================================
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');

  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  // Close mobile menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!menuToggle.contains(e.target) && !navMenu.contains(e.target)) {
      menuToggle.classList.remove('active');
      navMenu.classList.remove('active');
    }
  });

  // ==========================================
  // 3. Canvas Particles Background (Hero)
  // ==========================================
  const canvas = document.getElementById('particle-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particlesArray = [];
    const numberOfParticles = 45; // Slightly reduced for better performance and minimalism
    
    // Mouse coords for subtle interaction
    let mouse = {
      x: null,
      y: null,
      radius: 120
    };

    window.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });

    window.addEventListener('mouseout', () => {
      mouse.x = null;
      mouse.y = null;
    });

    const setCanvasSize = () => {
      canvas.width = canvas.parentElement.offsetWidth;
      canvas.height = canvas.parentElement.offsetHeight;
    };
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    // Particle Blueprints
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = (Math.random() - 0.5) * 0.35;
        this.speedY = (Math.random() - 0.5) * 0.35;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Bounce off canvas limits
        if (this.x < 0 || this.x > canvas.width) this.speedX = -this.speedX;
        if (this.y < 0 || this.y > canvas.height) this.speedY = -this.speedY;

        // Subtle mouse push effect
        if (mouse.x !== null && mouse.y !== null) {
          let dx = mouse.x - this.x;
          let dy = mouse.y - this.y;
          let distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < mouse.radius) {
            let forceDirectionX = dx / distance;
            let forceDirectionY = dy / distance;
            let force = (mouse.radius - distance) / mouse.radius;
            let directionX = forceDirectionX * force * 0.6;
            let directionY = forceDirectionY * force * 0.6;
            this.x -= directionX;
            this.y -= directionY;
          }
        }
      }

      draw() {
        ctx.fillStyle = 'rgba(0, 75, 156, 0.18)'; // Royal Blue particles
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
      }
    }

    const initParticles = () => {
      particlesArray = [];
      for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
      }
    };
    initParticles();

    // Connect particles with faint lines
    const connectParticles = () => {
      for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a + 1; b < particlesArray.length; b++) {
          let dx = particlesArray[a].x - particlesArray[b].x;
          let dy = particlesArray[a].y - particlesArray[b].y;
          let distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 140) {
            let alpha = (1 - (distance / 140)) * 0.06;
            ctx.strokeStyle = `rgba(0, 194, 209, ${alpha * 1.2})`; // Electric Cyan connections
            ctx.lineWidth = 0.75;
            ctx.beginPath();
            ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
            ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
            ctx.stroke();
            ctx.closePath();
          }
        }
      }
    };

    const animateParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
      }
      connectParticles();
      requestAnimationFrame(animateParticles);
    };
    animateParticles();
  }

  // ==========================================
  // 4. Custom Software Blueprint Tabs (Dashboards)
  // ==========================================
  const tabTriggers = document.querySelectorAll('.tab-trigger');
  const tabContents = document.querySelectorAll('.tab-content');
  
  // Dashboard Containers
  const dbInventory = document.getElementById('dashboard-inventario');
  const dbPayroll = document.getElementById('dashboard-planillas');

  tabTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      // Deactivate other tabs
      tabTriggers.forEach(t => t.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      // Activate selected tab
      trigger.classList.add('active');
      const targetId = trigger.getAttribute('data-target');
      const targetContent = document.getElementById(targetId);
      if (targetContent) targetContent.classList.add('active');

      // Update Dashboard visibility
      if (targetId === 'panel-inventario') {
        dbPayroll.classList.remove('active');
        dbInventory.classList.add('active');
      } else {
        dbInventory.classList.remove('active');
        dbPayroll.classList.add('active');
      }
    });
  });

  // ==========================================
  // 5. Contact Form Validation (B2B Lead gen)
  // ==========================================
  const form = document.getElementById('lead-form');
  const feedback = document.getElementById('form-feedback-message');
  const submitBtn = document.getElementById('btn-submit-form');

  // List of common personal email domains to filter (B2B verification)
  const personalDomains = [
    'gmail.com', 'hotmail.com', 'yahoo.com', 'outlook.com', 
    'live.com', 'icloud.com', 'msn.com', 'aol.com', 'zoho.com',
    'yahoo.es', 'hotmail.es', 'live.com.mx'
  ];

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      feedback.className = 'form-feedback';
      feedback.style.display = 'none';
      feedback.textContent = '';

      const name = document.getElementById('contact-name').value.trim();
      const company = document.getElementById('contact-company').value.trim();
      const email = document.getElementById('contact-email').value.trim();
      const area = document.getElementById('contact-area').value;

      // Check completeness
      if (!name || !email || !company || !area) {
        feedback.classList.add('error');
        feedback.style.display = 'block';
        feedback.textContent = 'Por favor, complete todos los campos requeridos.';
        return;
      }

      // Basic email regex
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        feedback.classList.add('error');
        feedback.style.display = 'block';
        feedback.textContent = 'Por favor, ingrese un correo electrónico válido.';
        return;
      }

      // Corporate email verification
      const domain = email.split('@')[1]?.toLowerCase();
      if (personalDomains.includes(domain)) {
        feedback.classList.add('error');
        feedback.style.display = 'block';
        feedback.textContent = 'Por favor, ingrese un correo electrónico corporativo o institucional (ej. nombre@empresa.com). No aceptamos correos personales.';
        return;
      }

      // Simulation of submission
      submitBtn.disabled = true;
      submitBtn.textContent = 'Enviando solicitud...';

      setTimeout(() => {
        // Hide form and show success card (Image 4)
        form.style.display = 'none';
        const successWrapper = document.getElementById('form-success-wrapper');
        if (successWrapper) {
          successWrapper.style.display = 'flex';
        }
      }, 1000);
    });
  }
  
  // Spotlight effect (mouse glow tracker) on Bento Cards and Form Card
  const spotlightCards = document.querySelectorAll('.bento-card, .value-card, .contact-form-container');
  spotlightCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--x', `${x}px`);
      card.style.setProperty('--y', `${y}px`);
    });
  });

});
