"use strict";

// ==========================================
// PORTFÓLIO - HUDSON CAIRES
// Script Principal Otimizado & Futurista
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    console.log("🚀 Portfolio Hudson Caires carregado com efeitos futuristas");

    // ==========================================
    // GSAP INICIALIZAÇÃO
    // ==========================================
    if (typeof gsap !== "undefined") {
        gsap.registerPlugin(ScrollTrigger);
    }

    // ==========================================
    // 0. CURSOR FUTURISTA (GLOW EFFECT)
    // ==========================================
    const cursor = document.createElement("div");
    cursor.style.cssText = `
        position: fixed; width: 40px; height: 40px; border-radius: 50%;
        background: radial-gradient(circle, rgba(0,212,255,0.4) 0%, rgba(0,0,0,0) 70%);
        pointer-events: none; z-index: 9999; transform: translate(-50%, -50%);
        transition: width 0.3s, height 0.3s;
    `;
    document.body.appendChild(cursor);

    window.addEventListener("mousemove", (e) => {
        gsap.to(cursor, {
            x: e.clientX,
            y: e.clientY,
            duration: 0.15,
            ease: "power2.out"
        });
    });

    // Aumenta o brilho do cursor ao passar em links e botões
    document.querySelectorAll("a, button, .service-card, .card-3d").forEach(el => {
        el.addEventListener("mouseenter", () => gsap.to(cursor, { width: 80, height: 80 }));
        el.addEventListener("mouseleave", () => gsap.to(cursor, { width: 40, height: 40 }));
    });

    // ==========================================
    // 1. TYPING EFFECT (Corrigido e Fluido)
    // ==========================================
    const typingElement = document.getElementById("typing-text");

    if (typingElement) {
        const texts = [
            "Arquiteto de Software",
            "Especialista em Cloud",
            "Full Stack Developer",
            "Soluções Inovadoras"
        ];

        let textIndex = 0;
        let charIndex = 0;
        let deleting = false;

        const type = () => {
            const current = texts[textIndex];
            typingElement.textContent = deleting
                ? current.substring(0, charIndex--)
                : current.substring(0, charIndex++);

            let speed = deleting ? 40 : 100;

            if (!deleting && charIndex === current.length + 1) {
                deleting = true;
                speed = 2000; // Pausa no final da frase
            }

            if (deleting && charIndex === 0) {
                deleting = false;
                textIndex = (textIndex + 1) % texts.length;
                speed = 500; // Pausa antes da próxima frase
            }

            setTimeout(type, speed);
        };
        type();
    }

    // ==========================================
    // 2. PARTICLES SYSTEM (Agora Reativo ao Mouse)
    // ==========================================
    const canvas = document.getElementById("particles-canvas");

    if (canvas) {
        const ctx = canvas.getContext("2d");
        let particles = [];
        let animationId;
        
        // Rastreando o mouse para interação com o Canvas
        let mouse = { x: null, y: null, radius: 120 };
        
        window.addEventListener("mousemove", (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });
        
        window.addEventListener("mouseout", () => {
            mouse.x = null;
            mouse.y = null;
        });

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.baseX = this.x;
                this.baseY = this.y;
                this.size = Math.random() * 2 + 1;
                this.speedX = Math.random() * 1 - 0.5;
                this.speedY = Math.random() * 1 - 0.5;
                this.opacity = Math.random() * 0.5 + 0.2;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                // Reposiciona se sair da tela
                if (this.x > canvas.width) this.x = 0;
                if (this.x < 0) this.x = canvas.width;
                if (this.y > canvas.height) this.y = 0;
                if (this.y < 0) this.y = canvas.height;

                // Interação Magnética com o Mouse (Efeito de repulsão)
                if (mouse.x != null) {
                    let dx = mouse.x - this.x;
                    let dy = mouse.y - this.y;
                    let distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < mouse.radius) {
                        const forceDirectionX = dx / distance;
                        const forceDirectionY = dy / distance;
                        const force = (mouse.radius - distance) / mouse.radius;
                        const directionX = forceDirectionX * force * 3;
                        const directionY = forceDirectionY * force * 3;
                        
                        this.x -= directionX;
                        this.y -= directionY;
                    }
                }
            }

            draw() {
                ctx.fillStyle = `rgba(0,212,255,${this.opacity})`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        const initParticles = () => {
            particles = [];
            const count = Math.min(window.innerWidth / 10, 100);
            for (let i = 0; i < count; i++) {
                particles.push(new Particle());
            }
        };

        const connectParticles = () => {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 120) {
                        ctx.strokeStyle = `rgba(0,212,255,${0.15 * (1 - distance / 120)})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            connectParticles();
            animationId = requestAnimationFrame(animate);
        };

        resizeCanvas();
        initParticles();
        animate();

        window.addEventListener("resize", () => {
            resizeCanvas();
            initParticles();
        });

        document.addEventListener("visibilitychange", () => {
            if (document.hidden) cancelAnimationFrame(animationId);
            else animate();
        });
    }

    // ==========================================
    // 3. STATS COUNTER (Correção de Bug Visual)
    // ==========================================
    document.querySelectorAll("[data-target]").forEach(el => {
        const target = parseInt(el.dataset.target);
        
        ScrollTrigger.create({
            trigger: el,
            start: "top 85%",
            once: true,
            onEnter: () => {
                let counter = { val: 0 };
                gsap.to(counter, {
                    val: target,
                    duration: 2.5,
                    ease: "power3.out",
                    onUpdate: () => {
                        el.innerHTML = Math.ceil(counter.val) + (el.innerHTML.includes('%') ? '%' : '');
                    }
                });
            }
        });
    });

    // ==========================================
    // 4. PROGRESS BARS
    // ==========================================
    document.querySelectorAll(".progress-bar").forEach(bar => {
        ScrollTrigger.create({
            trigger: bar,
            start: "top 85%",
            once: true,
            onEnter: () => {
                bar.style.width = bar.dataset.width;
            }
        });
    });

    // ==========================================
    // 5. BOTÕES MAGNÉTICOS (Efeito Futurista)
    // ==========================================
    document.querySelectorAll(".btn-primary").forEach(btn => {
        btn.addEventListener("mousemove", (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            gsap.to(btn, {
                x: x * 0.3,
                y: y * 0.3,
                duration: 0.3,
                ease: "power2.out"
            });
        });

        btn.addEventListener("mouseleave", () => {
            gsap.to(btn, {
                x: 0,
                y: 0,
                duration: 0.7,
                ease: "elastic.out(1, 0.3)" 
            });
        });
    });

    // ==========================================
    // 6. SCROLL REVEAL (Mais imersivo)
    // ==========================================
    gsap.utils.toArray(".service-card, .card-3d, .testimonial-card").forEach((el, i) => {
        gsap.from(el, {
            scrollTrigger: {
                trigger: el,
                start: "top 85%"
            },
            y: 50,
            opacity: 0,
            rotationX: 10, 
            duration: 1,
            ease: "power3.out",
            delay: i * 0.15
        });
    });

    // ==========================================
    // 7. MOBILE MENU
    // ==========================================
    const mobileMenu = document.getElementById("mobileMenu");

    const toggleMenu = () => {
        mobileMenu?.classList.toggle("active");
        document.body.style.overflow = mobileMenu?.classList.contains("active") ? "hidden" : "";
    };

    document.getElementById("mobileMenuBtn")?.addEventListener("click", toggleMenu);
    document.getElementById("closeMobileMenu")?.addEventListener("click", toggleMenu);

    document.querySelectorAll(".mobile-link").forEach(link => {
        link.addEventListener("click", toggleMenu);
    });

    // ==========================================
    // 8. SMOOTH SCROLL
    // ==========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener("click", e => {
            const target = document.querySelector(anchor.getAttribute("href"));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: "smooth" });
            }
        });
    });

    // ==========================================
    // 9. HEADER EFFECT
    // ==========================================
    const nav = document.querySelector("nav");
    if (nav) {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 50) {
                nav.classList.add("shadow-lg", "shadow-cyan-500/10");
                nav.style.borderBottom = "1px solid rgba(0, 212, 255, 0.2)";
            } else {
                nav.classList.remove("shadow-lg", "shadow-cyan-500/10");
                nav.style.borderBottom = "1px solid rgba(255, 255, 255, 0.1)";
            }
        });
    }

    // ==========================================
    // 10. CONTACT FORM - CONEXÃO REAL COM O PYTHON
    // ==========================================
    const form = document.getElementById("contactForm");
    
    if (form) {
        form.addEventListener("submit", async e => {
            e.preventDefault();
            
            const btn = form.querySelector("button[type='submit']");
            const btnOriginalText = btn.innerHTML;
            
            // Dá feedback na tela para o usuário saber que está processando
            btn.innerHTML = "Enviando... ⏳";

            // Captura os dados preenchidos no HTML
            const dados = {
                nome: document.getElementById("nome").value,
                email: document.getElementById("email").value,
                assunto: document.getElementById("assunto").value,
                mensagem: document.getElementById("mensagem").value
            };

            try {
                // Envia para o Python na rota /enviar
                const response = await fetch('/enviar', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(dados)
                });

                if (response.ok) {
                    const notification = document.createElement("div");
                    notification.className = "fixed top-24 right-4 bg-gradient-to-r from-[#00d4ff] to-[#0099cc] text-[#0a0e27] px-6 py-4 rounded-lg shadow-2xl z-50 font-bold tracking-wide transform translate-x-full opacity-0";
                    notification.textContent = "Mensagem enviada com sucesso! 🚀";
                    document.body.appendChild(notification);
                    
                    gsap.to(notification, { x: 0, opacity: 1, duration: 0.5, ease: "back.out(1.7)" });
                    setTimeout(() => { gsap.to(notification, { x: 100, opacity: 0, duration: 0.5, onComplete: () => notification.remove() }); }, 3500);
                    
                    form.reset();
                } else {
                    alert("Erro ao enviar a mensagem. O servidor está indisponível ou ocorreu um erro. Tente novamente mais tarde.");
                }
            } catch (error) {
                alert("O servidor Python não está rodando. Digite 'python app.py' no terminal.");
            } finally {
                btn.innerHTML = btnOriginalText;
            }
        });
    }
});