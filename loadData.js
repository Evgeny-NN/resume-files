// loadData.js
(function () {
    // Определяем, на какой странице мы находимся
    const isResumePage = window.location.pathname.includes('/resume/') ||
        document.querySelector('.resume') !== null;
    const isPortfolioPage = window.location.pathname.endsWith('index.html') ||
        window.location.pathname === '/' ||
        window.location.pathname === '/resume-files/';

    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            if (isResumePage) {
                fillResume(data.resume);
            } else if (isPortfolioPage) {
                fillPortfolio(data.portfolio);
            } else {
                // Если страница не распознана, можно попробовать заполнить обе (например, на главной)
                fillPortfolio(data.portfolio);
            }
        })
        .catch(err => console.error('Ошибка загрузки данных:', err));

    // ---------- ЗАПОЛНЕНИЕ ПОРТФОЛИО ----------
    function fillPortfolio(data) {
        // Заголовок
        document.querySelector('h1').textContent = data.title;
        document.querySelector('.subtitle').textContent = data.subtitle;

        // Навигация
        const nav = document.querySelector('.nav');
        if (nav) {
            nav.innerHTML = '';
            data.navLinks.forEach(link => {
                const a = document.createElement('a');
                a.href = link.url;
                a.textContent = link.text;
                if (link.target) a.target = link.target;
                nav.appendChild(a);
            });
        }

        // Проекты – ищем контейнер после заголовка "📌 Портфолио проектов"
        const projectsContainer = document.querySelector('h2:has(+ .card)')?.parentNode;
        if (projectsContainer) {
            // Удаляем все карточки после заголовка
            let next = projectsContainer.querySelector('h2 + .card');
            while (next) {
                const toRemove = next;
                next = next.nextElementSibling;
                if (toRemove.tagName === 'DIV' && toRemove.classList.contains('card')) {
                    toRemove.remove();
                } else break;
            }
            // Вставляем новые карточки
            const h2 = projectsContainer.querySelector('h2');
            data.projects.forEach(project => {
                const card = document.createElement('div');
                card.className = 'card';

                const h3 = document.createElement('h3');
                h3.textContent = project.title;
                card.appendChild(h3);

                const pDesc = document.createElement('p');
                pDesc.innerHTML = project.description.replace(/\n/g, '<br>');
                card.appendChild(pDesc);

                if (project.badges) {
                    const pBadges = document.createElement('p');
                    project.badges.forEach(b => {
                        const span = document.createElement('span');
                        span.className = `badge ${b.class}`;
                        span.textContent = b.text;
                        pBadges.appendChild(span);
                    });
                    card.appendChild(pBadges);
                }

                if (project.buttons) {
                    const div = document.createElement('div');
                    div.className = 'btn-group';
                    project.buttons.forEach(btn => {
                        const a = document.createElement('a');
                        a.href = btn.url;
                        a.textContent = btn.text;
                        a.className = btn.class;
                        if (btn.download) a.download = '';
                        if (btn.target) a.target = btn.target;
                        div.appendChild(a);
                    });
                    card.appendChild(div);
                }

                // Вставляем после h2
                h2.parentNode.insertBefore(card, h2.nextSibling);
            });
        }

        // Футер
        const footer = document.querySelector('.footer');
        if (footer) {
            footer.innerHTML = data.footer + ' · <a href="https://github.com/Evgeny-NN/resume-files" target="_blank">Исходный код репозитория</a>';
        }
    }

    // ---------- ЗАПОЛНЕНИЕ РЕЗЮМЕ ----------
    function fillResume(data) {
        // Общие контакты в шапке
        const contactInfo = document.querySelector('.contact-info');
        if (contactInfo) {
            // Имя
            const nameEl = contactInfo.querySelector('h1[itemprop="name"]');
            if (nameEl) nameEl.textContent = data.name;

            // Возраст
            const ageDiv = contactInfo.querySelector('div strong:contains("Мужчина")');
            if (ageDiv) {
                const strong = ageDiv.querySelector('strong');
                if (strong) strong.textContent = data.genderAge;
            }

            // Телефон
            const phoneSpan = contactInfo.querySelector('span[itemprop="telephone"]');
            if (phoneSpan) phoneSpan.textContent = data.phone;

            // Telegram
            const telSpan = contactInfo.querySelector('.contact-details span:nth-child(2)');
            if (telSpan) telSpan.innerHTML = `📱 Telegram ${data.telegram}`;

            // Email – защищённый, обновим через ID
            const emailPlaceholder = document.getElementById('protected-email');
            if (emailPlaceholder) {
                const fullEmail = data.email;
                emailPlaceholder.innerHTML = `<a href="mailto:${fullEmail}">${fullEmail}</a>`;
            }

            // Город
            const citySpan = contactInfo.querySelector('span[itemprop="addressLocality"]');
            if (citySpan) citySpan.textContent = data.city;

            // Гражданство
            const citizenshipDiv = contactInfo.querySelector('div:contains("Гражданство")');
            if (citizenshipDiv) citizenshipDiv.innerHTML = `🪪 Гражданство: ${data.citizenship}`;

            // Переезд
            const relocationDiv = contactInfo.querySelector('div:contains("переезду")');
            if (relocationDiv) relocationDiv.innerHTML = `🌍 ${data.relocation}`;

            // Должность
            const jobTitleDiv = contactInfo.querySelector('.job-title');
            if (jobTitleDiv) jobTitleDiv.textContent = data.jobTitle;

            // Занятость
            const employmentDiv = contactInfo.querySelector('div:contains("Тип занятости")');
            if (employmentDiv) employmentDiv.innerHTML = `Тип занятости: ${data.employment}`;

            // Время в пути
            const travelDiv = contactInfo.querySelector('div:contains("Желательное время")');
            if (travelDiv) travelDiv.innerHTML = `Желательное время в пути до работы: ${data.travelTime}`;

            // Социальные ссылки
            const socialDiv = contactInfo.querySelector('.social-links');
            if (socialDiv) {
                socialDiv.innerHTML = '';
                data.socialLinks.forEach((link, index) => {
                    const a = document.createElement('a');
                    a.href = link.url;
                    a.textContent = link.text;
                    a.target = '_blank';
                    a.rel = 'noopener noreferrer';
                    socialDiv.appendChild(a);
                    if (index < data.socialLinks.length - 1) {
                        socialDiv.appendChild(document.createTextNode(' • '));
                    }
                });
            }
        }

        // Опыт работы
        const expSection = document.getElementById('experience');
        if (expSection) {
            // Заголовок
            expSection.textContent = `📌 Опыт работы — ${data.experience.total}`;
            // Компания и дата
            const flexRow = expSection.parentNode.querySelector('.flex-row');
            if (flexRow) {
                const strong = flexRow.querySelector('strong');
                if (strong) strong.textContent = data.experience.company;
                const dateSpan = flexRow.querySelector('.date');
                if (dateSpan) dateSpan.textContent = data.experience.period;
            }
            // Локация
            const locationDiv = expSection.parentNode.querySelector('div:contains("Санкт-Петербург")');
            if (locationDiv) locationDiv.textContent = data.experience.location;
            // Роль
            const roleDiv = expSection.parentNode.querySelector('div:contains("Системный / Full-stack аналитик")');
            if (roleDiv) roleDiv.innerHTML = `<strong>${data.experience.role}</strong>`;
        }

        // Проекты – удаляем старые и вставляем новые
        const projectsContainer = document.querySelector('.project-name')?.parentNode;
        if (projectsContainer) {
            // Находим все элементы .project-name и удаляем их вместе с последующими списками
            const projectNames = projectsContainer.querySelectorAll('.project-name');
            projectNames.forEach(el => {
                let sibling = el;
                while (sibling && !sibling.classList.contains('project-name') && !sibling.tagName.startsWith('H')) {
                    const next = sibling.nextElementSibling;
                    if (sibling !== el) sibling.remove();
                    sibling = next;
                }
                el.remove();
            });
            // Вставляем проекты из данных
            const expHeader = document.getElementById('experience');
            data.experience.projects.forEach(proj => {
                const divName = document.createElement('div');
                divName.className = 'project-name';
                divName.textContent = `📁 ${proj.name}`;
                expHeader.parentNode.insertBefore(divName, expHeader.parentNode.querySelector('.flex-row')?.nextSibling);

                const pDesc = document.createElement('p');
                pDesc.className = 'project-description';
                pDesc.textContent = proj.description;
                expHeader.parentNode.insertBefore(pDesc, divName.nextSibling);

                const ul = document.createElement('ul');
                proj.tasks.forEach(task => {
                    const li = document.createElement('li');
                    li.textContent = task;
                    // Если задача содержит двоеточие, возможно это подзаголовок – но мы просто добавляем как есть
                    ul.appendChild(li);
                });
                expHeader.parentNode.insertBefore(ul, pDesc.nextSibling);
            });
        }

        // Достижения
        const achievementsBlock = document.querySelector('.achievements-block');
        if (achievementsBlock) {
            const ul = achievementsBlock.querySelector('ul');
            if (ul) {
                ul.innerHTML = '';
                data.experience.achievements.forEach(text => {
                    const li = document.createElement('li');
                    li.textContent = text;
                    ul.appendChild(li);
                });
            }
        }

        // Навыки
        const skillsSection = document.getElementById('skills');
        if (skillsSection) {
            const container = skillsSection.parentNode;
            // Удаляем старые .skills-category
            container.querySelectorAll('.skills-category').forEach(el => el.remove());
            // Вставляем новые
            const skillMap = {
                '📄 Документация:': data.skills.documentation,
                '🎯 Постановка задач:': data.skills.taskAssignment,
                '🔗 Системный анализ:': data.skills.systemAnalysis,
                '📐 Проектирование:': data.skills.design,
                '🧪 Тестирование:': data.skills.testing,
                '📊 Мониторинг:': data.skills.monitoring,
                '🛠️ Инструменты:': data.skills.tools
            };
            for (const [label, items] of Object.entries(skillMap)) {
                const div = document.createElement('div');
                div.className = 'skills-category';
                let html = `<strong>${label}</strong> `;
                items.forEach(item => {
                    html += `<span class="skill-badge">${item}</span> `;
                });
                div.innerHTML = html;
                container.insertBefore(div, skillsSection.nextSibling);
            }
        }

        // Образование
        const educationSection = document.getElementById('education');
        if (educationSection) {
            const container = educationSection.parentNode;
            // Удаляем старые .grid-section после education
            let next = educationSection.nextElementSibling;
            while (next && next.classList.contains('grid-section')) {
                const toRemove = next;
                next = next.nextElementSibling;
                toRemove.remove();
            }
            // Вставляем новые
            data.education.forEach(edu => {
                const div = document.createElement('div');
                div.className = 'grid-section';
                div.innerHTML = `<div class="grid-left">${edu.year}</div><div class="grid-right">${edu.details}</div>`;
                container.insertBefore(div, educationSection.nextSibling);
            });
        }

        // Курсы
        const coursesHeader = document.querySelector('h2:contains("📚 Повышение квалификации")');
        if (coursesHeader) {
            const container = coursesHeader.parentNode;
            // Удаляем старые .grid-section после этого заголовка
            let next = coursesHeader.nextElementSibling;
            while (next && next.classList.contains('grid-section')) {
                const toRemove = next;
                next = next.nextElementSibling;
                toRemove.remove();
            }
            // Вставляем новые
            data.courses.forEach(course => {
                const div = document.createElement('div');
                div.className = 'grid-section';
                let rightHtml = course.detail;
                if (course.certificates) {
                    rightHtml += '<div class="cert-links"><strong>Электронные сертификаты:</strong><br>';
                    course.certificates.forEach(cert => {
                        rightHtml += `<a href="${cert.url}" target="_blank">${cert.text}</a> `;
                    });
                    rightHtml += '</div>';
                }
                div.innerHTML = `<div class="grid-left">${course.year}</div><div class="grid-right">${rightHtml}</div>`;
                container.insertBefore(div, coursesHeader.nextSibling);
            });
        }

        // Рекомендации
        const recommendationsHeader = document.querySelector('h2:contains("🤝 Рекомендации")');
        if (recommendationsHeader) {
            const container = recommendationsHeader.parentNode;
            // Удаляем старые .recommendation
            let next = recommendationsHeader.nextElementSibling;
            while (next && next.classList.contains('recommendation')) {
                const toRemove = next;
                next = next.nextElementSibling;
                toRemove.remove();
            }
            // Вставляем новые
            data.recommendations.forEach(rec => {
                const div = document.createElement('div');
                div.className = 'recommendation';
                div.innerHTML = `<div class="rec-name">${rec.name}</div><div>${rec.position}</div>`;
                container.insertBefore(div, recommendationsHeader.nextSibling);
            });
        }

        // Обо мне
        const aboutSection = document.getElementById('about');
        if (aboutSection) {
            // Удаляем всё содержимое (оставляем сам заголовок)
            const container = aboutSection.parentNode;
            let next = aboutSection.nextElementSibling;
            while (next && (next.tagName === 'P' || next.tagName === 'UL' || next.tagName === 'HR')) {
                const toRemove = next;
                next = next.nextElementSibling;
                toRemove.remove();
            }
            // Вставляем новые абзацы
            data.about.forEach(text => {
                const p = document.createElement('p');
                p.textContent = text;
                container.insertBefore(p, aboutSection.nextSibling);
            });
        }

        // Футер
        const footerNote = document.querySelector('.footer-note');
        if (footerNote) {
            footerNote.textContent = data.footer;
        }

        // Дополнительно: обновить ссылку на PDF, если она есть в навигации
        const pdfLink = document.querySelector('a.pdf-btn');
        if (pdfLink) {
            // Оставляем как есть, т.к. путь к PDF статичен
        }
    }
})();