// Глобальный JS-объект, хранящий содержимое всех разделов
const studentData = {
    about: `
        <h2>О себе</h2>
        <p>Привет! Я целеустремленный студент IT-направления. Увлекаюсь веб-разработкой, проектированием удобных пользовательских интерфейсов и изучением современных стандартов фронтенда.</p>
        <p>В свободное время верстаю адаптивные страницы и разбираюсь в тонкостях асинхронного JavaScript.</p>
    `,
    skills: `
        <h2>Мои навыки</h2>
        <ul>
            <li><strong>Языки:</strong> JavaScript (ES6+), HTML5, CSS3</li>
            <li><strong>Верстка:</strong> Flexbox, Grid, Адаптивный и резиновый дизайн</li>
            <li><strong>Инструменты:</strong> Git, GitHub, VS Code, Figma</li>
            <li><strong>Дополнительно:</strong> Базовое понимание работы с API и протокола HTTP</li>
        </ul>
    `,
    contacts: `
        <h2>Контакты для связи</h2>
        <p>✉️ <strong>Email:</strong> student.dev@university.edu</p>
        <p>📱 <strong>Телефон:</strong> +7 (999) 456-78-90</p>
        <p>🐙 <strong>GitHub:</strong> <a href="#" onclick="return false;">://github.com</a></p>
        <p>💬 <strong>Telegram:</strong> @student_frontend_dev</p>
    `
};

/**
 * Функция для переключения вкладок без перезагрузки страницы
 * @param {string} tabName - Ключ вкладки (about, skills, contacts)
 */
function switchTab(tabName) {
    // 1. Находим главный контейнер контента
    const container = document.getElementById('main-content');
    if (!container) return;

    // 2. Берем шаблон из JS-объекта и вставляем его в HTML
    if (studentData[tabName]) {
        container.innerHTML = studentData[tabName];
    }

    // 3. Сбрасываем класс активности 'active' у всех кнопок
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // 4. Находим текущую нажатую кнопку и подсвечиваем её
    const currentButton = document.getElementById(`tab-${tabName}`);
    if (currentButton) {
        currentButton.classList.add('active');
    }
}

// Автоматический рендер начальной вкладки "О себе" после полной загрузки страницы
document.addEventListener('DOMContentLoaded', () => {
    switchTab('about');
});
