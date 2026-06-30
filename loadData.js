// loadData.js
(function () {
    // ---------- ОПРЕДЕЛЯЕМ БАЗОВЫЙ ПУТЬ ДЛЯ DATA.JSON ----------
    function getBasePath() {
        if (window.location.pathname.includes('/resume/')) {
            return '../';
        }
        return './';
    }

    const dataUrl = getBasePath() + 'data.json';
    fetch(dataUrl)
        .then(response => {
            if (!response.ok) throw new Error('Не удалось загрузить data.json');
            return response.json();
        })
        .then(data => {
            const isResumePage = document.querySelector('.resume') !== null;

            if (isResumePage) {
                fillResume(data.resume);
            } else {
                fillPortfolio(data.portfolio);
            }
        })
        .catch(err => console.error('Ошибка загрузки данных:', err));

    // ---------- ЗАПОЛНЕНИЕ ПОРТФОЛИО ----------
    function fillPortfolio(data) {
        const h1 = document.querySelector('h1');
        if (h1) h1.textContent = data.title;

        const subtitle = document.querySelector('.subtitle');
        if (subtitle) subtitle.textContent = data.subtitle;

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

        // Ищем заголовок проектов – сначала по id, потом по тексту
        let h2Projects = document.getElementById('projects');
        if (!h2Projects) {
            h2Projects = findElementByText('h2', '📌 Портфолио проектов');
        }
        // Если не нашли, попробуем без эмодзи
        if (!h2Projects) {
            h2Projects = findElementByText('h2', 'Портфолио проектов');
        }

        if (h2Projects) {
            // Удаляем старые карточки (если они есть)
            let next = h2Projects.nextElementSibling;
            while (next && next.classList.contains('card')) {
                const toRemove = next;
                next = next.nextElementSibling;
                toRemove.remove();
            }

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

                h2Projects.parentNode.insertBefore(card, h2Projects.nextSibling);
            });
        } else {
            console.warn('Заголовок "Портфолио проектов" не найден. Проверьте index.html');
        }

        // Футер – просто заменяем на содержимое data.footer (без добавления ссылки)
        const footer = document.querySelector('.footer');
        if (footer) {
            footer.innerHTML = data.footer;
        }
    }

    // ---------- ЗАПОЛНЕНИЕ РЕЗЮМЕ ----------
    function fillResume(data) {
        const contactInfo = document.querySelector('.contact-info');
        if (!contactInfo) return;

        // Имя
        const nameEl = contactInfo.querySelector('h1[itemprop="name"]');
        if (nameEl) nameEl.textContent = data.name;

        // Возраст
        const ageDiv = findElementByText('div', 'Мужчина', contactInfo);
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

        // Email
        const emailPlaceholder = document.getElementById('protected-email');
        if (emailPlaceholder) {
            emailPlaceholder.innerHTML = `<a href="mailto:${data.email}">${data.email}</a>`;
        }

        // Город
        const citySpan = contactInfo.querySelector('span[itemprop="addressLocality"]');
        if (citySpan) citySpan.textContent = data.city;

        // Гражданство
        const citizenshipDiv = findElementByText('div', 'Гражданство', contactInfo);
        if (citizenshipDiv) citizenshipDiv.innerHTML = `🪪 Гражданство: ${data.citizenship}`;

        // Переезд
        const relocationDiv = findElementByText('div', 'переезду', contactInfo);
        if (relocationDiv) relocationDiv.innerHTML = `🌍 ${data.relocation}`;

        // Должность
        const jobTitleDiv = contactInfo.querySelector('.job-title');
        if (jobTitleDiv) jobTitleDiv.textContent = data.jobTitle;

        // Занятость
        const employmentDiv = findElementByText('div', 'Тип занятости', contactInfo);
        if (employmentDiv) employmentDiv.innerHTML = `Тип занятости: ${data.employment}`;

        // Время в пути
        const travelDiv = findElementByText('div', 'Желательное время', contactInfo);
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

        // Опыт работы
        const expSection = document.getElementById('experience');
        if (expSection) {
            expSection.textContent = `📌 Опыт работы — ${data.experience.total}`;
            const flexRow = expSection.parentNode.querySelector('.flex-row');
            if (flexRow) {
                const strong = flexRow.querySelector('strong');
                if (strong) strong.textContent = data.experience.company;
                const dateSpan = flexRow.querySelector('.date');
                if (dateSpan) dateSpan.textContent = data.experience.period;
            }
            const locationDiv = findElementByText('div', 'Санкт-Петербург', expSection.parentNode);
            if (locationDiv) locationDiv.textContent = data.experience.location;
            const roleDiv = findElementByText('div', 'Системный / Full-stack аналитик', expSection.parentNode);
            if (roleDiv) roleDiv.innerHTML = `<strong>${data.experience.role}</strong>`;
        }

        // Проекты – удаляем старые и вставляем новые
        const container = document.querySelector('.resume');
        if (container) {
            container.querySelectorAll('.project-name').forEach(el => {
                let sibling = el;
                while (sibling && !sibling.classList.contains('project-name') && !sibling.tagName.startsWith('H')) {
                    const next = sibling.nextElementSibling;
                    if (sibling !== el) sibling.remove();
                    sibling = next;
                }
                el.remove();
            });

            const expHeader = document.getElementById('experience');
            if (expHeader) {
                const achievementsBlock = expHeader.parentNode.querySelector('.achievements-block');
                data.experience.projects.forEach(proj => {
                    const divName = document.createElement('div');
                    divName.className = 'project-name';
                    divName.textContent = `📁 ${proj.name}`;

                    const pDesc = document.createElement('p');
                    pDesc.className = 'project-description';
                    pDesc.textContent = proj.description;

                    const ul = document.createElement('ul');
                    proj.tasks.forEach(task => {
                        const li = document.createElement('li');
                        li.textContent = task;
                        ul.appendChild(li);
                    });

                    if (achievementsBlock) {
                        achievementsBlock.parentNode.insertBefore(divName, achievementsBlock);
                        achievementsBlock.parentNode.insertBefore(pDesc, achievementsBlock);
                        achievementsBlock.parentNode.insertBefore(ul, achievementsBlock);
                    } else {
                        expHeader.parentNode.appendChild(divName);
                        expHeader.parentNode.appendChild(pDesc);
                        expHeader.parentNode.appendChild(ul);
                    }
                });
            }
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
            const containerSkills = skillsSection.parentNode;
            containerSkills.querySelectorAll('.skills-category').forEach(el => el.remove());

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
                containerSkills.insertBefore(div, skillsSection.nextSibling);
            }
        }

        // Образование
        const educationSection = document.getElementById('education');
        if (educationSection) {
            const container = educationSection.parentNode;
            let next = educationSection.nextElementSibling;
            while (next && next.classList.contains('grid-section')) {
                const toRemove = next;
                next = next.nextElementSibling;
                toRemove.remove();
            }
            data.education.forEach(edu => {
                const div = document.createElement('div');
                div.className = 'grid-section';
                div.innerHTML = `<div class="grid-left">${edu.year}</div><div class="grid-right">${edu.details}</div>`;
                container.insertBefore(div, educationSection.nextSibling);
            });
        }

        // Курсы
        const coursesHeader = findElementByText('h2', '📚 Повышение квалификации');
        if (coursesHeader) {
            const container = coursesHeader.parentNode;
            let next = coursesHeader.nextElementSibling;
            while (next && next.classList.contains('grid-section')) {
                const toRemove = next;
                next = next.nextElementSibling;
                toRemove.remove();
            }
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
        const recommendationsHeader = findElementByText('h2', '🤝 Рекомендации');
        if (recommendationsHeader) {
            const container = recommendationsHeader.parentNode;
            let next = recommendationsHeader.nextElementSibling;
            while (next && next.classList.contains('recommendation')) {
                const toRemove = next;
                next = next.nextElementSibling;
                toRemove.remove();
            }
            data.recommendations.forEach(rec => {
                const div = document.createElement('div');
                div.className = 'recommendation';
                div.innerHTML = `<div class="rec-name">${rec.name}</div><div>${rec.position}</div>`;
                container.insertBefore(div, recommendationsHeader.nextSibling);
            });
        }

        // ---------- БЛОК "ОБО МНЕ" С ПРАВИЛЬНЫМ ФОРМАТИРОВАНИЕМ ----------
        const aboutSection = document.getElementById('about');
        if (aboutSection) {
            const container = aboutSection.parentNode;
            // Удаляем всё содержимое после aboutSection до следующего заголовка или hr
            let next = aboutSection.nextElementSibling;
            while (next && !next.tagName.startsWith('H') && next.tagName !== 'HR') {
                const toRemove = next;
                next = next.nextElementSibling;
                toRemove.remove();
            }

            // Переменные для обработки списка
            let listItems = [];
            let inList = false;

            data.about.forEach((text, index) => {
                const isListItem = text.startsWith('проектирование') ||
                    text.startsWith('разработку') ||
                    text.startsWith('полное сопровождение');

                if (isListItem) {
                    listItems.push(text);
                    inList = true;
                } else {
                    if (inList && listItems.length > 0) {
                        const ul = document.createElement('ul');
                        listItems.forEach(item => {
                            const li = document.createElement('li');
                            li.textContent = item;
                            ul.appendChild(li);
                        });
                        container.appendChild(ul);
                        listItems = [];
                        inList = false;
                    }
                    const p = document.createElement('p');
                    p.textContent = text;
                    container.appendChild(p);
                }
            });

            if (inList && listItems.length > 0) {
                const ul = document.createElement('ul');
                listItems.forEach(item => {
                    const li = document.createElement('li');
                    li.textContent = item;
                    ul.appendChild(li);
                });
                container.appendChild(ul);
            }
        }

        // Футер
        const footerNote = document.querySelector('.footer-note');
        if (footerNote) {
            footerNote.textContent = data.footer;
        }
    }

    // ---------- ВСПОМОГАТЕЛЬНАЯ ФУНКЦИЯ ПОИСКА ПО ТЕКСТУ ----------
    function findElementByText(tagName, searchText, parent = document) {
        const elements = parent.querySelectorAll(tagName);
        for (let el of elements) {
            if (el.textContent.includes(searchText)) {
                return el;
            }
        }
        return null;
    }
})();