
"use strict";

// =====================================
// ATU STUDENT PORTAL — JAVASCRIPT
// =====================================

const $ = id => document.getElementById(id);

const DEMO = {
    name: "Студент АТУ",
    login: "student",
    password: "123456",
    group: "Не указана",
    specialty: "Не указана"
};

let currentUser = null;
let memoryUsers = [];

// =====================================
// СОХРАНЕНИЕ АККАУНТОВ
// =====================================

function readUsers() {
    try {
        const data = localStorage.getItem("atuStudentUsers");
        return data ? JSON.parse(data) : memoryUsers;
    } catch (error) {
        return memoryUsers;
    }
}

function saveUsers(users) {
    memoryUsers = users;

    try {
        localStorage.setItem(
            "atuStudentUsers",
            JSON.stringify(users)
        );
    } catch (error) {
        console.warn("Не удалось сохранить аккаунты.");
    }
}

// =====================================
// УЧЕБНЫЕ ДАННЫЕ (ДЕМО)
// =====================================

const subjects = [
    ["Программирование", 95],
    ["Математика", 88],
    ["Информатика", 91],
    ["Английский язык", 84],
    ["История Казахстана", 87],
    ["Физическая культура", 96]
];

const exams = [
    ["Математика", "10.12.2026", "09:00"],
    ["Программирование", "15.12.2026", "11:00"],
    ["Информатика", "20.12.2026", "10:00"]
];

const schedule = [
    ["Понедельник", "Программирование", "09:00"],
    ["Понедельник", "Математика", "11:00"],
    ["Вторник", "Информатика", "10:00"],
    ["Среда", "Английский язык", "09:00"],
    ["Четверг", "История Казахстана", "11:00"],
    ["Пятница", "Физическая культура", "10:00"]
];

// =====================================
// СООБЩЕНИЯ
// =====================================

function message(id, text, type = "") {
    const element = $(id);

    if (!element) return;

    element.textContent = text;
    element.className = "message " + type;
}

// =====================================
// ПЕРЕКЛЮЧЕНИЕ АВТОРИЗАЦИИ
// =====================================

function openAuth(register = false) {
    $("auth").classList.remove("hidden");
    $("app").classList.add("hidden");

    $("loginPage").classList.toggle("hidden", register);
    $("registerPage").classList.toggle("hidden", !register);
}

function showPage(id) {
    document.querySelectorAll(".page").forEach(page => {
        page.classList.add("hidden");
    });

    const selected = $(id);

    if (selected) {
        selected.classList.remove("hidden");
    }

    document.querySelectorAll(".nav").forEach(button => {
        button.classList.toggle(
            "active",
            button.dataset.page === id
        );
    });
}

// =====================================
// ДОБАВЛЕНИЕ СТРОК
// =====================================

function addRow(parent, left, right) {
    if (!parent) return;

    const div = document.createElement("div");
    div.className = "row";

    const a = document.createElement("span");
    const b = document.createElement("span");

    a.textContent = left;
    b.textContent = right;
    b.className = "blue";

    div.append(a, b);
    parent.appendChild(div);
}

// =====================================
// ОТОБРАЖЕНИЕ ЛИЧНОГО КАБИНЕТА
// =====================================

function renderPortal() {
    if (!currentUser) return;

    const u = currentUser;
    const initial = (u.name.trim()[0] || "S").toUpperCase();

    $("firstName").textContent = u.name.split(" ")[0];
    $("sideName").textContent = u.name;
    $("sideGroup").textContent = u.group;

    $("avatar").textContent = initial;
    $("profileAvatar").textContent = initial;
    $("profileName").textContent = u.name;

    $("infoName").textContent = u.name;
    $("infoLogin").textContent = u.login;
    $("infoGroup").textContent = u.group;
    $("infoSpecialty").textContent = u.specialty;

    [
        "recentGrades",
        "gradeTable",
        "examList",
        "scheduleList",
        "nearestExam"
    ].forEach(id => {
        $(id).replaceChildren();
    });

    // ОЦЕНКИ

    subjects.forEach(subject => {
        const mark = subject[1] >= 90 ? "5" :
                     subject[1] >= 75 ? "4" :
                     subject[1] >= 50 ? "3" : "2";

        addRow(
            $("recentGrades"),
            subject[0],
            subject[1] + "/100"
        );

        const tr = document.createElement("tr");

        [
            subject[0],
            subject[1],
            mark,
            subject[1] >= 50 ? "Зачтено" : "Не зачтено"
        ].forEach(value => {
            const td = document.createElement("td");
            td.textContent = value;
            tr.appendChild(td);
        });

        $("gradeTable").appendChild(tr);
    });

    // ЭКЗАМЕНЫ

    exams.forEach((exam, index) => {
        addRow(
            $("examList"),
            exam[0],
            exam[1] + " · " + exam[2]
        );

        if (index === 0) {
            const title = document.createElement("h2");
            title.textContent = exam[0];

            const date = document.createElement("p");
            date.className = "muted";
            date.textContent = exam[1] + " · " + exam[2];

            $("nearestExam").append(title, date);
        }
    });

    // РАСПИСАНИЕ

    schedule.forEach(item => {
        addRow(
            $("scheduleList"),
            item[0] + " · " + item[1],
            item[2]
        );
    });
}

// =====================================
// РЕГИСТРАЦИЯ
// =====================================

$("showRegister").addEventListener("click", () => {
    openAuth(true);
    message("registerMessage", "");
});

$("showLogin").addEventListener("click", () => {
    openAuth(false);
});

$("registerForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const user = {
        name: $("regName").value.trim(),
        login: $("regLogin").value.trim(),
        password: $("regPassword").value,
        group: $("regGroup").value.trim(),
        specialty: $("regSpecialty").value.trim()
    };

    if (
        user.name.length < 2 ||
        user.login.length < 3 ||
        user.password.length < 6
    ) {
        message(
            "registerMessage",
            "Проверьте введённые данные.",
            "error"
        );
        return;
    }

    const users = readUsers();

    if (
        user.login.toLowerCase() === "student" ||
        users.some(u =>
            u.login.toLowerCase() === user.login.toLowerCase()
        )
    ) {
        message(
            "registerMessage",
            "Такой логин уже существует.",
            "error"
        );
        return;
    }

    users.push(user);
    saveUsers(users);

    this.reset();

    openAuth(false);

    $("loginInput").value = user.login;

    message(
        "loginMessage",
        "Аккаунт успешно создан! Теперь войдите.",
        "success"
    );
});

// =====================================
// ВХОД В АККАУНТ
// =====================================

$("loginForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const login = $("loginInput").value.trim();
    const password = $("passwordInput").value;

    let found = null;

    // ДЕМО-АККАУНТ

    if (
        login.toLowerCase() === DEMO.login &&
        password === DEMO.password
    ) {
        found = DEMO;
    } else {
        // ЗАРЕГИСТРИРОВАННЫЙ АККАУНТ

        found = readUsers().find(user =>
            user.login.toLowerCase() === login.toLowerCase() &&
            user.password === password
        );
    }

    if (!found) {
        message(
            "loginMessage",
            "Неверный логин или пароль.",
            "error"
        );
        return;
    }

    currentUser = found;

    $("auth").classList.add("hidden");
    $("app").classList.remove("hidden");

    this.reset();

    message("loginMessage", "");

    renderPortal();
    showPage("home");
});

// =====================================
// НАВИГАЦИЯ
// =====================================

document.querySelectorAll(".nav").forEach(button => {
    button.addEventListener("click", () => {
        showPage(button.dataset.page);
    });
});

// =====================================
// ВЫХОД ИЗ АККАУНТА
// =====================================

$("logout").addEventListener("click", () => {
    currentUser = null;

    $("loginForm").reset();

    openAuth(false);

    message("loginMessage", "");
});

// =====================================
// ЗАПУСК ПОРТАЛА
// =====================================

openAuth(false);