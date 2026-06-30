# 🧑‍💼 Портфолио системного аналитика — Евгений Бегунков

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-живой%20сайт-brightgreen)](https://evgeny-nn.github.io/resume-files/)
[![GitHub repo](https://img.shields.io/badge/GitHub-репозиторий-181717?logo=github)](https://github.com/Evgeny-NN/resume-files)
[![OpenAPI](https://img.shields.io/badge/OpenAPI-3.0.3-blue)](https://editor.swagger.io/?url=https://raw.githubusercontent.com/Evgeny-NN/resume-files/main/portfolio/openapi/learning-platform-api.yaml)

Этот репозиторий содержит мои профессиональные артефакты: **резюме**, **портфолио проектов**, **сертификаты** и **примеры аналитических артефактов** (включая OpenAPI-контракт).  
Все материалы представлены в виде статического сайта, опубликованного на GitHub Pages.  

**Сайт:** [https://evgeny-nn.github.io/resume-files/](https://evgeny-nn.github.io/resume-files/)

---

## 📂 Структура репозитория

```plaintext
resume-files/
├── .github/workflows/          # CI/CD для автоматического деплоя на GitHub Pages
├── portfolio/                  # Портфолио проектов
│   └── openapi/                # OpenAPI-спецификации REST API
│       └── learning-platform-api.yaml   # Демонстрационный контракт
├── resume/                     # Основное резюме и сопутствующие файлы
│   ├── index.html              # Страница резюме (динамически загружает данные из data.json)
│   ├── style.css               # Стили для резюме
│   ├── images/                 # Фотографии и иллюстрации
│   └── Begunkov_Evgeny_SA.pdf  # PDF-версия резюме для скачивания
├── index.html                  # Главная страница портфолио (тоже загружает данные из data.json)
├── data.json                   # 📌 Единый файл данных – редактируйте его, чтобы обновить весь контент
├── loadData.js                 # Универсальный скрипт, который подгружает данные на обе страницы
├── README.md                   # Этот файл
└── (прочие служебные файлы)

Как работает автоматизация контента
Все текстовые данные (заголовки, описания проектов, список навыков, контакты и т.д.) вынесены в единый файл data.json.
Обе страницы (index.html и resume/index.html) с помощью скрипта loadData.js загружают этот JSON и динамически заполняют свои секции.