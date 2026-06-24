document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. Sticky Nav Pill & Scroll spy Indicator
  // ==========================================
  const header = document.getElementById('header-v2');
  const navMenu = document.getElementById('nav-menu-v2');
  const menuToggle = document.getElementById('menu-toggle-v2');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Smooth scroll offsets for floating pill anchors
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        // Close mobile dropdown menu
        navMenu.classList.remove('active');
        menuToggle.classList.remove('active');

        // Scroll with offset adjustment for floating nav heights
        const headerHeight = header.offsetHeight + 40; 
        const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // Scrollspy: Activate corresponding nav links while scrolling sections
  const sections = document.querySelectorAll('section[id], header[id]');
  const navLinks = document.querySelectorAll('.nav-pill .nav-links a');

  window.addEventListener('scroll', () => {
    let currentSectionId = '';
    const scrollPos = window.scrollY + 200; // Offset trigger line

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href === `#${currentSectionId}` || (currentSectionId === 'home' && href === '#home')) {
        link.classList.add('active');
      }
    });
  });

  // ==========================================
  // 2. Mobile Nav Menu Toggle (Pill Version)
  // ==========================================
  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!menuToggle.contains(e.target) && !navMenu.contains(e.target)) {
      menuToggle.classList.remove('active');
      navMenu.classList.remove('active');
    }
  });

  // ==========================================
  // 3. Canvas Particles Background (Hero)
  // ==========================================
  const canvas = document.getElementById('particle-canvas-v2');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particlesArray = [];
    const numberOfParticles = 50;
    
    // Track mouse coordinates inside hero section
    let mouse = {
      x: null,
      y: null,
      radius: 130
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

    // Particle blueprints class
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

        // Bounce particle on borders
        if (this.x < 0 || this.x > canvas.width) this.speedX = -this.speedX;
        if (this.y < 0 || this.y > canvas.height) this.speedY = -this.speedY;

        // Interactive mouse force
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
        // Soft blue and cyan nodes
        ctx.fillStyle = 'rgba(0, 82, 204, 0.2)';
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

    // Connect nodes together with vector lines
    const connectParticles = () => {
      for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a + 1; b < particlesArray.length; b++) {
          let dx = particlesArray[a].x - particlesArray[b].x;
          let dy = particlesArray[a].y - particlesArray[b].y;
          let distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 140) {
            let alpha = (1 - (distance / 140)) * 0.06;
            ctx.strokeStyle = `rgba(0, 194, 224, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
            ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
            ctx.stroke();
            ctx.closePath();
          }
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
      }
      connectParticles();
      requestAnimationFrame(animate);
    };
    animate();
  }

  // ==========================================
  // 4. Custom Software Mock Browser Tab Switcher
  // ==========================================
  const tabs = document.querySelectorAll('.browser-tab-v2');
  const tabContents = document.querySelectorAll('.tab-content-v2');
  
  // Dashboard Visual Elements
  const imgInventory = document.getElementById('img-inventory-v2');
  const imgPayroll = document.getElementById('img-payroll-v2');
  const statLabel = document.getElementById('browser-stat-lbl');
  const statValue = document.getElementById('browser-stat-val');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Deactivate current tabs
      tabs.forEach(t => t.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      // Activate clicked tab
      tab.classList.add('active');
      const targetId = tab.getAttribute('data-target');
      const targetContent = document.getElementById(targetId);
      if (targetContent) targetContent.classList.add('active');

      // Swap dashboard views and stats inside the browser frame
      if (targetId === 'tab-inventory-v2') {
        imgPayroll.classList.remove('active');
        imgInventory.classList.add('active');
        statLabel.textContent = 'Rotación Stock';
        statValue.textContent = '+98.4%';
      } else {
        imgInventory.classList.remove('active');
        imgPayroll.classList.add('active');
        statLabel.textContent = 'Procesos / Min';
        statValue.textContent = '1,250+';
      }
    });
  });

  // ==========================================
  // 5. Contact Lead Form Validator (Option 2)
  // ==========================================
  const form = document.getElementById('lead-form-v2');
  const feedback = document.getElementById('form-feedback-message-v2');
  const submitBtn = document.getElementById('btn-submit-form-v2');

  const personalDomains = [
    'gmail.com', 'hotmail.com', 'yahoo.com', 'outlook.com', 
    'live.com', 'icloud.com', 'msn.com', 'aol.com', 'zoho.com'
  ];

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    feedback.className = 'form-feedback-v2';
    feedback.textContent = '';

    const name = document.getElementById('contact-name-v2').value.trim();
    const email = document.getElementById('contact-email-v2').value.trim();
    const company = document.getElementById('contact-company-v2').value.trim();
    const message = document.getElementById('contact-message-v2').value.trim();

    // Completeness validation
    if (!name || !email || !company || !message) {
      feedback.classList.add('error');
      feedback.textContent = 'Por favor, complete todos los campos requeridos.';
      return;
    }

    // Email regex validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      feedback.classList.add('error');
      feedback.textContent = 'Ingrese una dirección de correo electrónico válida.';
      return;
    }

    // Corporate filter verification
    const domain = email.split('@')[1]?.toLowerCase();
    if (personalDomains.includes(domain)) {
      feedback.classList.add('error');
      feedback.textContent = 'Por favor, proporcione un correo electrónico corporativo o institucional (ej. nombre@empresa.com).';
      return;
    }

    // Success response simulation
    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando lead...';

    setTimeout(() => {
      feedback.classList.add('success');
      feedback.textContent = '¡Mensaje enviado con éxito! Un especialista en tecnología responderá a su correo en menos de 24 horas.';
      form.reset();
      
      submitBtn.disabled = false;
      submitBtn.innerHTML = `
        Enviar Solicitud
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
      `;
    }, 1500);
  });

  // ==========================================
  // 6. Dynamic Card Spotlights (Mouse Tracking Glow)
  // ==========================================
  const spotlightCards = document.querySelectorAll('.bento-card-v2, #contact-form-card-v2');
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
