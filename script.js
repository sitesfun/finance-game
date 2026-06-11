// ─── Modal System ────────────────────────────────────────────────────────────

function createOverlay() {
    const overlay = document.createElement("div");
    overlay.style.cssText = `
        position:fixed;inset:0;background:rgba(0,0,0,0.7);
        backdrop-filter:blur(4px);display:flex;align-items:center;
        justify-content:center;z-index:1000;padding:20px;
        animation:fadeIn .15s ease;
    `;
    return overlay;
}

function modalStyles() {
    return `
        background:#1a1a2e;border:1px solid rgba(168,85,247,0.4);
        border-radius:20px;padding:28px 24px;width:100%;max-width:360px;
        box-shadow:0 0 40px rgba(168,85,247,0.25),0 20px 60px rgba(0,0,0,0.6);
        font-family:'Nunito',sans-serif;color:#fff;position:relative;
        animation:slideUp .2s cubic-bezier(0.34,1.56,0.64,1);
    `;
}

// Inject keyframes once
if (!document.getElementById("modal-keyframes")) {
    const style = document.createElement("style");
    style.id = "modal-keyframes";
    style.textContent = `
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes slideUp { from{opacity:0;transform:translateY(20px) scale(.95)} to{opacity:1;transform:translateY(0) scale(1)} }
        .modal-title { font-size:18px;font-weight:900;margin-bottom:6px;background:linear-gradient(135deg,#a855f7,#ec4899);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text; }
        .modal-msg { font-size:14px;color:rgba(255,255,255,0.65);margin-bottom:20px;line-height:1.5; }
        .modal-input { width:100%;padding:12px 14px;background:rgba(255,255,255,0.06);border:1px solid rgba(168,85,247,0.3);border-radius:10px;color:#fff;font-family:'Nunito',sans-serif;font-size:16px;font-weight:700;outline:none;margin-bottom:16px;box-sizing:border-box; }
        .modal-input:focus { border-color:#a855f7;box-shadow:0 0 0 3px rgba(168,85,247,0.2); }
        .modal-input::placeholder { color:rgba(255,255,255,0.25); }
        .modal-btn { width:100%;padding:13px;border:none;border-radius:12px;cursor:pointer;font-family:'Nunito',sans-serif;font-size:15px;font-weight:800;transition:filter .1s,transform .1s; }
        .modal-btn:active { transform:scale(.97); }
        .modal-btn-primary { background:linear-gradient(135deg,#a855f7,#7c3aed);color:#fff;box-shadow:0 4px 20px rgba(168,85,247,0.4); }
        .modal-btn-primary:hover { filter:brightness(1.1); }
        .modal-btn-danger { background:linear-gradient(135deg,#ef4444,#b91c1c);color:#fff;box-shadow:0 4px 20px rgba(239,68,68,0.4); }
        .modal-btn-yellow { background:linear-gradient(135deg,#fbbf24,#f59e0b);color:#0f0f1a;box-shadow:0 4px 20px rgba(251,191,36,0.35); }
        .modal-btn-ghost { background:rgba(255,255,255,0.07);color:rgba(255,255,255,0.7);border:1px solid rgba(255,255,255,0.12); }
        .modal-btn-ghost:hover { background:rgba(255,255,255,0.12);color:#fff; }
        .modal-row { display:flex;gap:10px; }
        .modal-row .modal-btn { flex:1; }
        .modal-icon { font-size:36px;text-align:center;margin-bottom:10px; }
        .modal-error { font-size:12px;color:#f87171;margin-top:-10px;margin-bottom:12px;font-weight:700; }
    `;
    document.head.appendChild(style);
}

// showPrompt(title, message, placeholder, icon?) → Promise<string|null>
function showPrompt(title, message, placeholder, icon = "✏️") {
    return new Promise((resolve) => {
        const overlay = createOverlay();
        overlay.innerHTML = `
            <div style="${modalStyles()}">
                <div class="modal-icon">${icon}</div>
                <div class="modal-title">${title}</div>
                <div class="modal-msg">${message}</div>
                <input class="modal-input" type="text" placeholder="${placeholder}" id="modal-input-field" autocomplete="off">
                <div class="modal-error" id="modal-err" style="display:none"></div>
                <div class="modal-row">
                    <button class="modal-btn modal-btn-ghost" id="modal-cancel">Скасувати</button>
                    <button class="modal-btn modal-btn-primary" id="modal-ok">OK</button>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);

        const input = overlay.querySelector("#modal-input-field");
        const okBtn = overlay.querySelector("#modal-ok");
        const cancelBtn = overlay.querySelector("#modal-cancel");
        const errEl = overlay.querySelector("#modal-err");

        setTimeout(() => input.focus(), 50);

        function showErr(msg) {
            errEl.textContent = msg;
            errEl.style.display = "block";
            input.style.borderColor = "#f87171";
        }
        function hideErr() {
            errEl.style.display = "none";
            input.style.borderColor = "";
        }

        okBtn.addEventListener("click", () => {
            const val = input.value.trim();
            if (!val) { showErr("Це поле обов'язкове"); return; }
            hideErr();
            document.body.removeChild(overlay);
            resolve(val);
        });

        cancelBtn.addEventListener("click", () => {
            document.body.removeChild(overlay);
            resolve(null);
        });

        input.addEventListener("keydown", (e) => {
            if (e.key === "Enter") okBtn.click();
            if (e.key === "Escape") cancelBtn.click();
            hideErr();
        });
    });
}

// showNumberPrompt(title, message, placeholder, icon?) → Promise<number|null>
function showNumberPrompt(title, message, placeholder, icon = "💰") {
    return new Promise((resolve) => {
        const overlay = createOverlay();
        overlay.innerHTML = `
            <div style="${modalStyles()}">
                <div class="modal-icon">${icon}</div>
                <div class="modal-title">${title}</div>
                <div class="modal-msg">${message}</div>
                <input class="modal-input" type="number" min="1" placeholder="${placeholder}" id="modal-input-field" autocomplete="off">
                <div class="modal-error" id="modal-err" style="display:none"></div>
                <div class="modal-row">
                    <button class="modal-btn modal-btn-ghost" id="modal-cancel">Скасувати</button>
                    <button class="modal-btn modal-btn-primary" id="modal-ok">Підтвердити</button>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);

        const input = overlay.querySelector("#modal-input-field");
        const okBtn = overlay.querySelector("#modal-ok");
        const cancelBtn = overlay.querySelector("#modal-cancel");
        const errEl = overlay.querySelector("#modal-err");

        setTimeout(() => input.focus(), 50);

        function showErr(msg) {
            errEl.textContent = msg;
            errEl.style.display = "block";
            input.style.borderColor = "#f87171";
        }

        okBtn.addEventListener("click", () => {
            const val = Number(input.value);
            if (!input.value || isNaN(val) || val <= 0) {
                showErr("Введіть суму більше 0"); return;
            }
            document.body.removeChild(overlay);
            resolve(val);
        });

        cancelBtn.addEventListener("click", () => {
            document.body.removeChild(overlay);
            resolve(null);
        });

        input.addEventListener("keydown", (e) => {
            if (e.key === "Enter") okBtn.click();
            if (e.key === "Escape") cancelBtn.click();
            errEl.style.display = "none";
            input.style.borderColor = "";
        });
    });
}

// showAlert(title, message, icon?, btnStyle?) → Promise<void>
function showAlert(title, message, icon = "✅", btnStyle = "modal-btn-primary") {
    return new Promise((resolve) => {
        const overlay = createOverlay();
        overlay.innerHTML = `
            <div style="${modalStyles()}">
                <div class="modal-icon">${icon}</div>
                <div class="modal-title">${title}</div>
                <div class="modal-msg">${message}</div>
                <button class="modal-btn ${btnStyle}" id="modal-ok">Зрозуміло</button>
            </div>
        `;
        document.body.appendChild(overlay);
        overlay.querySelector("#modal-ok").addEventListener("click", () => {
            document.body.removeChild(overlay);
            resolve();
        });
    });
}

// showEvent(type, amount, newBalance) → Promise<void>
function showEvent(type, amount, newBalance) {
    const isGood = type === "додано";
    const icon = isGood ? "🎉" : "😬";
    const title = isGood ? `+${amount} грн!` : `-${amount} грн`;
    const msg = isGood
        ? `Удача! Вам нарахували <b style="color:#fbbf24">${amount} грн</b>. Баланс: <b style="color:#a855f7">${newBalance} грн</b>`
        : `Не пощастило — списали <b style="color:#f87171">${amount} грн</b>. Баланс: <b style="color:#a855f7">${newBalance} грн</b>`;
    return showAlert(title, msg, icon, isGood ? "modal-btn-yellow" : "modal-btn-ghost");
}

// showGameOver() → Promise<void>
function showGameOver() {
    return new Promise((resolve) => {
        const overlay = createOverlay();
        overlay.innerHTML = `
            <div style="${modalStyles()}">
                <div class="modal-icon">💸</div>
                <div class="modal-title">Ви в мінусі!</div>
                <div class="modal-msg">Баланс впав нижче нуля. Починаємо заново!</div>
                <div id="countdown" style="font-size:48px;font-weight:900;text-align:center;color:#ef4444;margin:10px 0 20px">3</div>
                <button class="modal-btn modal-btn-danger" id="modal-restart">🔄 Почати заново</button>
            </div>
        `;
        document.body.appendChild(overlay);

        let t = 3;
        const cd = overlay.querySelector("#countdown");
        const interval = setInterval(() => {
            t--;
            cd.textContent = t;
            if (t <= 0) { clearInterval(interval); finish(); }
        }, 1000);

        function finish() {
            if (document.body.contains(overlay)) document.body.removeChild(overlay);
            resolve();
        }
        overlay.querySelector("#modal-restart").addEventListener("click", () => {
            clearInterval(interval); finish();
        });
    });
}

// showWin() → Promise<void>
function showWin(dream) {
    return new Promise((resolve) => {
        const overlay = createOverlay();
        overlay.innerHTML = `
            <div style="${modalStyles()}text-align:center;">
                <div style="font-size:48px;margin-bottom:8px">🏆</div>
                <div class="modal-title" style="font-size:22px;text-align:center">Ціль досягнута!</div>
                <div class="modal-msg" style="text-align:center;margin-top:8px">Ви накопичили на <b style="color:#fbbf24">${dream}</b>! Вітаємо! 🎊</div>
                <button class="modal-btn modal-btn-yellow" id="modal-ok" style="margin-top:4px">🎮 Нова гра</button>
            </div>
        `;
        document.body.appendChild(overlay);
        overlay.querySelector("#modal-ok").addEventListener("click", () => {
            document.body.removeChild(overlay);
            resolve();
        });
    });
}

// ─── Multi-step setup wizard ──────────────────────────────────────────────────

async function playerData() {
    const steps = [
        { key: "name",    title: "Як тебе звати?",          msg: "Введи своє ім'я гравця",          ph: "Наприклад: Максим",  icon: "🎮", type: "text" },
        { key: "dream",   title: "Яка твоя мрія?",          msg: "На що хочеш накопичити?",          ph: "Наприклад: AirPods", icon: "⭐", type: "text" },
        { key: "goal",    title: "Скільки коштує мрія?",    msg: "Вкажи суму в гривнях",             ph: "Наприклад: 2500",    icon: "🎯", type: "number" },
        { key: "savings", title: "Твої заощадження зараз?", msg: "Скільки грошей у тебе вже є?",     ph: "Наприклад: 500",     icon: "💰", type: "number" },
    ];

    const data = {};
    for (const step of steps) {
        let val = null;
        while (val === null) {
            val = step.type === "number"
                ? await showNumberPrompt(step.title, step.msg, step.ph, step.icon)
                : await showPrompt(step.title, step.msg, step.ph, step.icon);
            if (val === null) val = null; // skipped — re-prompt
        }
        data[step.key] = val;
    }

    document.getElementById("player_name").textContent = data.name;
    document.getElementById("dream_item").textContent = data.dream;
    document.getElementById("meta_number").textContent = data.goal;
    document.getElementById("meta_display").textContent = data.goal;
    document.getElementById("savings").textContent = data.savings;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getBalance()  { return parseInt(balanceText.textContent) || 0; }
function getSavings()  { return parseInt(savedMoney.textContent)  || 0; }
function getGoal()     { return parseInt(metaMoneyUser.textContent) || 1; }

function updateProgressBar() {
    const progress = Math.min(Math.max((getBalance() / getGoal()) * 100, 0), 100);
    progressBar.style.width = progress + "%";
    // sync the progress counter in the header if present
    const bd = document.getElementById("balance-display");
    if (bd) bd.textContent = getBalance();
}

async function checkGoal() {
    if (getBalance() >= getGoal()) {
        const dream = document.getElementById("dream_item").textContent;
        await showWin(dream);
        balanceText.textContent = 0;
        updateProgressBar();
        await playerData();
        updateProgressBar();
    } else if (getBalance() < 0) {
        await showGameOver();
        balanceText.textContent = 0;
        updateProgressBar();
    }
}

// ─── DOM refs ────────────────────────────────────────────────────────────────

const balanceText  = document.getElementById("balance");
const savedMoney   = document.getElementById("savings");
const metaMoneyUser = document.getElementById("meta_number");
const progressBar  = document.getElementById("bar");

// ─── Button handlers ─────────────────────────────────────────────────────────

document.getElementById("earnBtn").addEventListener("click", async () => {
    const amount = await showNumberPrompt("Заробити гроші", "Скільки грошей ти заробив?", "Сума в грн", "💼");
    if (amount === null) return;
    balanceText.textContent = getBalance() + amount;
    updateProgressBar();
    await showAlert("Зароблено!", `+${amount} грн на балансі.<br>Поточний баланс: <b style="color:#a855f7">${getBalance()} грн</b>`, "🤑");
    await checkGoal();
});

document.getElementById("addMoney").addEventListener("click", async () => {
    const amount = await showNumberPrompt("Додати в банк", "Скільки перевести з власних коштів?", "Сума в грн", "🏦");
    if (amount === null) return;
    if (amount > getSavings()) {
        await showAlert("Недостатньо коштів", `У тебе лише <b style="color:#fbbf24">${getSavings()} грн</b> заощаджень.`, "❌", "modal-btn-danger");
        return;
    }
    balanceText.textContent = getBalance() + amount;
    savedMoney.textContent  = getSavings() - amount;
    updateProgressBar();
    await showAlert("Переведено!", `+${amount} грн у банку.<br>Заощадження: <b style="color:#fbbf24">${getSavings()} грн</b><br>Баланс: <b style="color:#a855f7">${getBalance()} грн</b>`, "✅");
    await checkGoal();
});

document.getElementById("postpone").addEventListener("click", async () => {
    const amount = await showNumberPrompt("Повернути кошти", "Скільки повернути з банку на власні кошти?", "Сума в грн", "↩️");
    if (amount === null) return;
    if (amount > getBalance()) {
        await showAlert("Недостатньо коштів", `У банку лише <b style="color:#a855f7">${getBalance()} грн</b>.`, "❌", "modal-btn-danger");
        return;
    }
    balanceText.textContent = getBalance() - amount;
    savedMoney.textContent  = getSavings() + amount;
    updateProgressBar();
    await showAlert("Повернено!", `${amount} грн повернено.<br>Заощадження: <b style="color:#fbbf24">${getSavings()} грн</b><br>Баланс: <b style="color:#a855f7">${getBalance()} грн</b>`, "↩️");
});

document.getElementById("event").addEventListener("click", async () => {
    const amount    = Math.floor(Math.random() * 400) + 100;
    const eventType = Math.random() < 0.5 ? "додано" : "віднято";
    const newBalance = eventType === "додано" ? getBalance() + amount : getBalance() - amount;
    balanceText.textContent = newBalance;
    updateProgressBar();
    await showEvent(eventType, amount, newBalance);
    await checkGoal();
});

// ─── Init ────────────────────────────────────────────────────────────────────

(async () => {
    await playerData();
    updateProgressBar();
})();
