<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Shubham Dubey - Portfolio</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@100;200;300;400;500&family=JetBrains+Mono:wght@300;400&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="style.css"> </head>
<body>

    <div class="custom-cursor"></div>

    <div class="app-container">
        
        <nav class="sidebar">
            <div class="mobile-top-row">
                <ul class="nav-links">
                    <li class="active">HOME</li>
                    <li onclick="document.getElementById('works-section').scrollIntoView({ behavior: 'smooth' });">WORKS</li>
                    <li onclick="window.location.href='blogs.html'">BLOGS</li>
                </ul>
                <div class="social-icons">
                    <i class="fab fa-linkedin"></i>
                    <i class="fab fa-github"></i>
                    <i class="far fa-envelope"></i>
                </div>
            </div>
            <div class="theme-switch-wrapper">
                <label class="theme-switch" for="checkbox">
                    <input type="checkbox" id="checkbox" />
                    <div class="slider"></div>
                </label>
            </div>
            <div class="copyright">© Shubham Dubey</div>
        </nav>

        <main class="main-content" id="main-content" style="opacity: 0; transition: opacity 0.5s ease;">
            
            <section class="hero-section">
                <div class="hero-left-col">
                    <div>
                        <h1 class="huge-title" id="hero-name"></h1>
                        <h2 class="subtitle" id="hero-subtitle"></h2>
                    </div>
                    <div class="contact-email" id="hero-email"></div>
                </div>
                <div class="hero-right-col">
                    <div>
                        <div class="section-header"><span>ABOUT ME</span></div>
                        <div class="text-block"><p id="hero-about"></p></div>
                    </div>
                </div>
            </section>

            <section class="standard-split">
                <div class="standard-left-col">
                    <div class="section-header"><span>MOTIVATION</span></div>
                    <div class="text-block" id="motivation-text"></div>
                </div>
                <div>
                    <img id="motivation-img" src="" class="img-placeholder">
                </div>
            </section>

            <section>
                <div class="section-header"><span>SKILLS</span></div>
                <div class="skills-grid" id="skills-grid"></div>
            </section>

            <section id="works-section">
                <div class="section-header">
                    <span>WORKS</span>
                    <span style="text-transform: lowercase; font-size:0.9rem;">/projects</span>
                </div>
                <div id="works-list"></div>
            </section>

        </main>
    </div>

    <script>
        // Cursor Logic
        const cursor = document.querySelector('.custom-cursor');
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });

        // Theme Logic
        const toggleSwitch = document.querySelector('.theme-switch input[type="checkbox"]');
        if (localStorage.getItem('theme')) {
            document.documentElement.setAttribute('data-theme', localStorage.getItem('theme'));
            if (localStorage.getItem('theme') === 'light') toggleSwitch.checked = true;
        }
        toggleSwitch.addEventListener('change', (e) => {
            const theme = e.target.checked ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', theme);
            localStorage.setItem('theme', theme);
        });

        // Fetch Data & Build HTML
        fetch('data.json')
            .then(res => res.json())
            .then(data => {
                // Populate Hero
                document.getElementById('hero-name').innerHTML = data.hero.name;
                document.getElementById('hero-subtitle').innerText = data.hero.subtitle;
                document.getElementById('hero-email').innerHTML = `For business inquiries, email me at<br>${data.hero.email}`;
                document.getElementById('hero-about').innerHTML = data.hero.about;
                
                // Populate Motivation
                document.getElementById('motivation-text').innerHTML = data.hero.motivation.map(p => `<p>${p}</p>`).join('');
                document.getElementById('motivation-img').src = data.hero.motivationImg;

                // Populate Skills
                const skillsHtml = data.skills.map(skillSet => `
                    <div class="skill-category">
                        <h3>${skillSet.category}</h3>
                        <div class="pill-container">
                            ${skillSet.items.map(item => `<div class="pill">${item}</div>`).join('')}
                        </div>
                    </div>
                `).join('');
                document.getElementById('skills-grid').innerHTML = skillsHtml;

                // Populate Works
                const worksHtml = data.projects.map(proj => `
                    <div class="work-item">
                        <div class="work-grid">
                            <div class="project-img-wrapper" onclick="window.location.href='project.html?id=${proj.id}'">
                                <div class="view-btn">VIEW</div>
                                <img src="${proj.thumbnail}" alt="Thumbnail">
                            </div>
                            <div class="work-info">
                                <div class="index">${proj.index}</div>
                                <h3>${proj.title}</h3>
                                <h4>${proj.subtitle}</h4>
                                <p>${proj.overview}</p>
                            </div>
                        </div>
                    </div>
                `).join('');
                document.getElementById('works-list').innerHTML = worksHtml;

                // Attach Cursor Hover events to dynamically created elements
                document.querySelectorAll('.pill, .project-img-wrapper, .view-btn').forEach(el => {
                    el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
                    el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
                });

                document.querySelectorAll('.project-img-wrapper').forEach(wrapper => {
                    const btn = wrapper.querySelector('.view-btn');
                    wrapper.addEventListener('mouseenter', () => cursor.style.opacity = '0');
                    wrapper.addEventListener('mouseleave', () => cursor.style.opacity = '1');
                    wrapper.addEventListener('mousemove', e => {
                        const rect = wrapper.getBoundingClientRect();
                        btn.style.left = (e.clientX - rect.left) + 'px';
                        btn.style.top = (e.clientY - rect.top) + 'px';
                    });
                });

                // Fade In
                document.getElementById('main-content').style.opacity = "1";
            });
    </script>
</body>
</html>