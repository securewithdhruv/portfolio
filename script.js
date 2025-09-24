// ================= DOM Elements =================
const header = document.querySelector('header');
const navLinks = document.querySelector('.nav-links');
const hamburger = document.querySelector('.hamburger');
const navLinksItems = document.querySelectorAll('.nav-links li');
const themeToggle = document.querySelector('.theme-toggle');
const moonIcon = document.querySelector('.fa-moon');
const sunIcon = document.querySelector('.fa-sun');
const contactForm = document.getElementById('contact-form');
const terminal = document.getElementById("terminal-output");

// ================= Header scroll effect =================
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('header-scroll');
    } else {
        header.classList.remove('header-scroll');
    }
});

// ================= Mobile Navigation =================
hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('nav-active');
    hamburger.classList.toggle('active');
    document.body.classList.toggle('no-scroll');
});

// Close mobile menu when clicking on a link
navLinksItems.forEach(item => {
    item.addEventListener('click', () => {
        if (navLinks.classList.contains('nav-active')) {
            navLinks.classList.remove('nav-active');
            hamburger.classList.remove('active');
            document.body.classList.remove('no-scroll');
        }
    });
});

// ================= Theme toggle functionality =================
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-theme');

    if (document.body.classList.contains('light-theme')) {
        moonIcon.style.display = 'none';
        sunIcon.style.display = 'block';
    } else {
        moonIcon.style.display = 'block';
        sunIcon.style.display = 'none';
    }

    const theme = document.body.classList.contains('light-theme') ? 'light' : 'dark';
    localStorage.setItem('theme', theme);
});

// Load saved theme preference
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
        moonIcon.style.display = 'none';
        sunIcon.style.display = 'block';
    }

    // Animate sections on scroll
    const animateElements = () => {
        const sections = document.querySelectorAll('section');

        sections.forEach(section => {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('section-animate');
                    }
                });
            }, { threshold: 0.1 });

            observer.observe(section);
        });
    };

    animateElements();

    // Initialize terminal with welcome message
    terminal.innerHTML = "";
    const initialOutput = document.createElement("div");
    initialOutput.className = "output-line";
    initialOutput.textContent = 'Welcome to my portfolio 🚀';
    terminal.appendChild(initialOutput);
});

// ================= Contact Form - Now using Formspree (JS validation kept for UX) =================
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        // Basic client-side validation for better UX
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const subject = document.getElementById('subject').value.trim();
        const message = document.getElementById('message').value.trim();

        if (!name || !email || !subject || !message) {
            e.preventDefault();
            alert('Please fill out all fields');
            return false;
        }

        // Set the _replyto hidden field value
        const replyToField = contactForm.querySelector('input[name="_replyto"]');
        if (replyToField) {
            replyToField.value = email;
        }

        // Allow form to submit to Formspree
        // Note: Formspree will handle the actual submission and redirect if _next is set
        console.log('Form submitted to Formspree:', { name, email, subject, message });
    });
}

// ================= Smooth Scrolling =================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// ================= Interactive Terminal =================
let history = [];
let histIndex = -1;

// Create a new prompt
function newPrompt() {
    // Hide cursors in all previous lines
    const previousCursors = document.querySelectorAll('.cursor');
    previousCursors.forEach(cursor => {
        cursor.style.display = 'none';
    });

    const line = document.createElement("div");
    line.className = "line";

    const prompt = document.createElement("span");
    prompt.className = "prompt";
    prompt.textContent = "$ ";

    const input = document.createElement("span");
    input.className = "input";
    input.contentEditable = true;

    const cursor = document.createElement("span");
    cursor.className = "cursor";

    line.appendChild(prompt);
    line.appendChild(input);
    line.appendChild(cursor);
    terminal.appendChild(line);

    input.focus();
    terminal.scrollTop = terminal.scrollHeight;
}

// Handle commands
function handleCommand(cmd) {
    const output = document.createElement("div");
    output.className = "output-line";

    switch (cmd.trim()) {
        case "whoami":
            output.textContent = "dhruvesh tripathi";
            break;
        case "id":
            output.textContent = "uid=1000(dhruvesh) gid=1000(cyber)\ngroups=1000(cyber),27(sudo)";
            break;
        case "uname -a":
            output.textContent = "Darwin portfolio.local 24.0.0 Darwin Kernel Version 24.0.0: Wed Sep 24 00:00:00 2025; root:xnu-10002.1.13~1/RELEASE_X86_64 x86_64";
            break;
        case 'echo "Welcome to my portfolio 🚀"':
            output.textContent = "Welcome to my portfolio 🚀";
            break;
        case "ls -la projects":
            output.textContent =
                "drwxr-xr-x  6 dhruvesh staff   192 Sep 2025 .\n" +
                "drwxr-xr-x  1 dhruvesh staff  1024 Sep 2025 ..\n" +
                "-rw-r--r--  1 dhruvesh staff  1024 Sep 2025 ShadowHash\n" +
                "-rw-r--r--  1 dhruvesh staff   512 Sep 2025 SecureKeyGen";
            break;
        case "clear":
            terminal.innerHTML = "";
            newPrompt();
            return;
        case "help":
            output.textContent = "Commands: whoami, id, uname -a, echo, ls -la projects, clear, help";
            break;
        default:
            output.textContent = `zsh: command not found: ${cmd}`;
    }

    terminal.appendChild(output);
    newPrompt();
}

// Capture input and history navigation
terminal.addEventListener("click", () => {
    if (!document.querySelector(".input")) {
        newPrompt();
    }
});

terminal.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        const active = document.querySelector(".input:focus");
        if (active) {
            const cmd = active.innerText;
            history.push(cmd);
            histIndex = history.length;
            active.removeAttribute("contenteditable");
            handleCommand(cmd);
        }
    } else if (e.key === "ArrowUp") {
        if (histIndex > 0) {
            histIndex--;
            document.querySelector(".input:focus").innerText = history[histIndex];
        }
    } else if (e.key === "ArrowDown") {
        if (histIndex < history.length - 1) {
            histIndex++;
            document.querySelector(".input:focus").innerText = history[histIndex];
        } else {
            document.querySelector(".input:focus").innerText = "";
            histIndex = history.length;
        }
    }
});