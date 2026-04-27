// ============================================================
// AIC KAPSOWAR HMS — THEME SETTINGS + AI CHATBOT
// ============================================================

// ── THEME SYSTEM ─────────────────────────────────────────────
var AIC_THEMES = [
  {
    id: "blue-dark",
    name: "Blue & Black",
    emoji: "🌑",
    preview: {sidebar:"#050a14",header:"#0a0f1c",content:"#050a14",accent:"#1e6bff"},
    desc: "Original dark navy theme"
  },
  {
    id: "brown-dark",
    name: "African Brown",
    emoji: "🌍",
    preview: {sidebar:"#130c05",header:"#1c1208",content:"#0a0602",accent:"#C8860A"},
    desc: "African earth tones"
  },
  {
    id: "white-light",
    name: "White Light",
    emoji: "☀",
    preview: {sidebar:"#ffffff",header:"#f5f2ee",content:"#f5f2ee",accent:"#1557d4"},
    desc: "Light professional mode"
  }
];

var curTheme = localStorage.getItem("aic_theme") || "blue-dark";
var isDark   = localStorage.getItem("aic_dark") !== "false";

function applyTheme() {
  var html = document.documentElement;
  html.setAttribute("data-theme", curTheme);
  html.setAttribute("data-mode", isDark ? "dark" : "light");
  if (curTheme === "white-light" && isDark) {
    html.setAttribute("data-theme", "brown-dark");
  }
  if (curTheme === "white-light" && !isDark) {
    html.setAttribute("data-theme", "white-light");
  }
  localStorage.setItem("aic_theme", curTheme);
  localStorage.setItem("aic_dark", isDark ? "true" : "false");
}

function initTheme() {
  curTheme = localStorage.getItem("aic_theme") || "blue-dark";
  isDark   = localStorage.getItem("aic_dark") !== "false";
  applyTheme();
}

// ── SETTINGS PANEL ─────────────────────────────────────────────
function buildSettingsBtn() {
  var btn = document.createElement("button");
  btn.id = "settingsBtn2";
  btn.title = "Settings & Theme";
  btn.innerHTML = "⚙";
  btn.onclick = openSettings;
  btn.style.cssText = [
    "position:fixed","top:16px","right:16px",
    "width:44px","height:44px","border-radius:50%",
    "background:linear-gradient(135deg,#a06808,#C8860A)",
    "border:2px solid rgba(255,255,255,.2)",
    "cursor:pointer","font-size:20px",
    "box-shadow:0 4px 20px rgba(200,134,10,.5)",
    "z-index:9999","transition:all .2s",
    "display:flex","align-items:center","justify-content:center",
    "color:#fff","font-weight:600"
  ].join(";");
  btn.onmouseover = function() { this.style.transform = "scale(1.15) rotate(30deg)"; };
  btn.onmouseout  = function() { this.style.transform = "scale(1)"; };
  document.body.appendChild(btn);

  // Adjust position on pages with top-header
  setTimeout(function() {
    var hasHeader = document.querySelector(".top-header") || document.querySelector(".app");
    if (hasHeader) {
      btn.style.top = "70px";
    }
  }, 50);

  // Build settings overlay
  var overlay = document.createElement("div");
  overlay.className = "settings-overlay";
  overlay.id = "settingsOverlay";
  overlay.onclick = function(e) { if (e.target === overlay) closeSettings(); };

  overlay.innerHTML = [
    '<div class="settings-panel" id="settingsPanel">',
      '<div class="sp-hdr">',
        '<div style="display:flex;align-items:center;gap:10px">',
          '<span style="font-size:18px">⚙</span>',
          '<div>',
            '<div style="font-size:14px;font-weight:700;color:var(--t)">Settings</div>',
            '<div style="font-size:10px;color:var(--tf)">Theme & Preferences</div>',
          '</div>',
        '</div>',
        '<button class="sp-close" onclick="closeSettings()">✕</button>',
      '</div>',
      '<div class="sp-section">',
        '<div class="sp-label">Choose Theme</div>',
        '<div class="theme-grid" id="themeGrid"></div>',
      '</div>',
      '<div class="sp-section">',
        '<div class="toggle-row">',
          '<div>',
            '<div class="toggle-label"><span class="toggle-icon" id="modeIcon"></span> <span id="modeLbl"></span></div>',
            '<div class="toggle-sub" id="modeSub"></div>',
          '</div>',
          '<div class="toggle-switch" id="darkToggle" onclick="toggleDark()">',
            '<div class="toggle-knob"></div>',
          '</div>',
        '</div>',
      '</div>',
      '<div class="sp-section">',
        '<div class="sp-label">Current Theme</div>',
        '<div id="themeDesc" style="font-size:12px;color:var(--tm)"></div>',
      '</div>',
    '</div>'
  ].join("");

  document.body.appendChild(overlay);
}

function openSettings() {
  renderThemeGrid();
  updateModeToggle();
  var o = document.getElementById("settingsOverlay");
  if (o) { o.style.display = "flex"; }
}

function closeSettings() {
  var o = document.getElementById("settingsOverlay");
  if (o) { o.style.display = "none"; }
}

function renderThemeGrid() {
  var grid = document.getElementById("themeGrid");
  if (!grid) return;
  grid.innerHTML = AIC_THEMES.map(function(t) {
    var active = t.id === curTheme;
    var cls = "theme-card" + (active ? " active" : "");
    return [
      '<div class="' + cls + '" onclick="setTheme(\'' + t.id + '\')" title="' + t.desc + '">',
        '<div class="theme-preview">',
          '<div class="tp-sidebar" style="background:' + t.preview.sidebar + ';border-right:2px solid ' + t.preview.accent + '"></div>',
          '<div class="tp-main">',
            '<div class="tp-header" style="background:' + t.preview.header + ';border-bottom:2px solid ' + t.preview.accent + '"></div>',
            '<div class="tp-content" style="background:' + t.preview.content + '"></div>',
          '</div>',
        '</div>',
        '<div class="theme-name">' + t.emoji + ' ' + t.name + '</div>',
      '</div>'
    ].join("");
  }).join("");

  var desc = document.getElementById("themeDesc");
  if (desc) {
    var th = AIC_THEMES.find(function(t) { return t.id === curTheme; });
    desc.textContent = th ? th.desc : "";
  }
}

function setTheme(id) {
  curTheme = id;
  applyTheme();
  renderThemeGrid();
  updateModeToggle();
}

function toggleDark() {
  isDark = !isDark;
  applyTheme();
  updateModeToggle();
}

function updateModeToggle() {
  var icon = document.getElementById("modeIcon");
  var lbl  = document.getElementById("modeLbl");
  var sub  = document.getElementById("modeSub");
  var tog  = document.getElementById("darkToggle");
  if (icon) icon.textContent = isDark ? "🌙" : "☀";
  if (lbl)  lbl.textContent  = isDark ? "Dark Mode" : "Light Mode";
  if (sub)  sub.textContent  = isDark ? "Easy on the eyes at night" : "Bright and clear";
  if (tog) {
    tog.style.background = isDark ? "var(--gold)" : "var(--gs3)";
    var knob = tog.querySelector(".toggle-knob");
    if (knob) knob.style.transform = isDark ? "translateX(20px)" : "translateX(0)";
  }
}

// ── SOCIAL FOOTER ─────────────────────────────────────────────
function buildSocialFooter() {
  if (document.getElementById("aicSocialFooter")) return;

  // Real SVG social media icons
  var ICONS = {
    facebook: '<svg width="14" height="14" viewBox="0 0 24 24" fill="#1877f2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>',
    twitter: '<svg width="14" height="14" viewBox="0 0 24 24" fill="#000"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>',
    instagram: '<svg width="14" height="14" viewBox="0 0 24 24" fill="url(#ig)"><defs><radialGradient id="ig" cx="30%" cy="107%" r="150%"><stop offset="0%" stop-color="#fdf497"/><stop offset="5%" stop-color="#fdf497"/><stop offset="45%" stop-color="#fd5949"/><stop offset="60%" stop-color="#d6249f"/><stop offset="90%" stop-color="#285AEB"/></radialGradient></defs><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>',
    youtube: '<svg width="14" height="14" viewBox="0 0 24 24" fill="#ff0000"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>',
    linkedin: '<svg width="14" height="14" viewBox="0 0 24 24" fill="#0077b5"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>',
    whatsapp: '<svg width="14" height="14" viewBox="0 0 24 24" fill="#25d366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>',
    phone: '<svg width="14" height="14" viewBox="0 0 24 24" fill="#22c55e"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>',
    email: '<svg width="14" height="14" viewBox="0 0 24 24" fill="#C8860A"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>'
  };

  var footer = document.createElement("div");
  footer.id = "aicSocialFooter";
  footer.style.cssText = "position:fixed;bottom:0;left:0;right:0;z-index:7990;display:flex;align-items:center;justify-content:center;padding:5px 0;background:var(--s1);border-top:1px solid var(--gbd)";

  var inner = document.createElement("div");
  inner.style.cssText = "display:inline-flex;align-items:center;gap:5px;background:var(--gs2);border:1px solid var(--gbd);border-radius:24px;padding:5px 14px";

  // Hospital name label
  var lbl = document.createElement("span");
  lbl.style.cssText = "font-size:9px;font-weight:700;color:var(--gold);letter-spacing:.04em;margin-right:3px;white-space:nowrap";
  lbl.textContent = "AIC KAPSOWAR";
  inner.appendChild(lbl);

  var divider = document.createElement("span");
  divider.style.cssText = "width:1px;height:16px;background:var(--gbd);margin:0 4px;flex-shrink:0";
  inner.appendChild(divider);

  var links = [
    { key:"facebook",  label:"Facebook",   href:"https://facebook.com/aickapsowar",   color:"#1877f2" },
    { key:"twitter",   label:"Twitter/X",  href:"https://twitter.com/aickapsowar",    color:"#000000" },
    { key:"instagram", label:"Instagram",  href:"https://instagram.com/aickapsowar",  color:"#e1306c" },
    { key:"youtube",   label:"YouTube",    href:"https://youtube.com/@aickapsowar",   color:"#ff0000" },
    { key:"linkedin",  label:"LinkedIn",   href:"https://linkedin.com/company/aickapsowar", color:"#0077b5" },
    { key:"whatsapp",  label:"WhatsApp",   href:"https://wa.me/254700000000",         color:"#25d366" },
    { key:"phone",     label:"+254 700 000 000", href:"tel:+254700000000",            color:"#22c55e" },
    { key:"email",     label:"Email Us",   href:"mailto:info@aickapsowar.co.ke",      color:"#C8860A" }
  ];

  links.forEach(function(l) {
    var a = document.createElement("a");
    a.href = l.href;
    a.target = "_blank";
    a.rel = "noopener";
    a.title = l.label;
    a.style.cssText = "display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:50%;background:var(--gs1);border:1px solid var(--gbd);text-decoration:none;transition:all .2s;flex-shrink:0";
    a.innerHTML = ICONS[l.key] || "";
    a.onmouseover = function() {
      this.style.background = l.color + "22";
      this.style.borderColor = l.color;
      this.style.transform = "scale(1.18) translateY(-2px)";
      this.style.boxShadow = "0 3px 12px " + l.color + "55";
    };
    a.onmouseout = function() {
      this.style.background = "var(--gs1)";
      this.style.borderColor = "var(--gbd)";
      this.style.transform = "scale(1)";
      this.style.boxShadow = "none";
    };
    inner.appendChild(a);
  });

  footer.appendChild(inner);
  document.body.appendChild(footer);
  document.body.style.paddingBottom = "42px";
}



// ── CHATBOT ────────────────────────────────────────────────────
var chatMessages = [];
var chatOpen = false;
var isHumanMode = false;
var humanQueue = [];

var HMS_CONTEXT = `You are the official AI Assistant for AIC Kapsowar Hospital HMS (Hospital Management System). You are knowledgeable, professional, friendly and concise.

HOSPITAL INFO:
- Name: AIC Kapsowar Hospital (Africa Inland Church)
- Location: Kapsowar, Elgeyo-Marakwet County, Kenya
- Established: 1966
- Phone: +254 700 000 000
- Email: info@aickapsowar.co.ke
- Admin email: aic.admin0001@gmail.com

SYSTEM ROLES & DASHBOARDS:
- Admin → admin-dashboard (full system access)
- Doctor → doctor-dashboard (consultations, prescriptions, EMR)
- Nurse/Triage → triage-dashboard (vitals, patient queue)
- Receptionist → receptionist-dashboard (patient registration, appointments)
- Pharmacist → pharmacy-dashboard (prescriptions, dispensing, inventory)
- Lab Tech → lab-dashboard (test requests, results)
- Accountant → finance-dashboard (billing, payments)
- Patient → patient-dashboard (appointments, results, prescriptions)

LOGIN HELP:
- Staff login: use Staff ID (e.g. ADM0001) + password → then 6-digit OTP sent to email
- Patient login: use Patient ID + temporary password → then 6-digit OTP sent to email
- Forgot password: click "Forgot password?" on login page → enter email → reset link sent
- First login: staff must change password on first login
- Patient temporary password format: first 2 letters of name + last 4 of Patient ID + @Aic (e.g. JA5678@Aic)
- OTP expires in 10 minutes — request a new one if expired

PATIENT REGISTRATION (by Receptionist/Admin only):
- Go to Receptionist Dashboard → Register New Patient
- System auto-generates Patient ID
- Temporary password shown on success screen and sent by email
- Patient must verify email before first login
- Patient login page is SEPARATE from staff login page

STAFF REGISTRATION (by Admin only):
- Go to Admin Dashboard → Register New Staff
- Staff ID auto-generated based on department
- Departments: ADM, REC, TRG, OUT, INP, EMG, SRG, MAT, PED, ICU, LAB, RAD, PHA, PHY, NUT, MNT, DEN, OPT, FIN, SEC

COMMON ISSUES:
- "Invalid Staff ID or password" → check ID is correct, try forgot password
- "OTP expired" → request new login, new OTP will be sent
- "Email not verified" → check inbox/spam for verification email, ask admin to manually verify
- "Route not found" → make sure you're on the correct port (5000)
- "Loading..." on dashboard → check backend is running (npm run dev in backend folder)
- Can't access a page → check your role has permission for that page

APPOINTMENTS:
- Patients book via patient portal → Receptionist confirms
- Walk-in patients registered at reception desk

Always be helpful, accurate and professional. If you cannot resolve an issue, suggest the user contact IT support or the hospital admin.`;

function buildChatbot() {
  if (document.getElementById("chatBtn")) return;

  // Chat button
  var btn = document.createElement("button");
  btn.id = "chatBtn";
  btn.innerHTML = '<span>💬</span><div class="chat-badge" id="chatBadge"></div>';
  btn.onclick = toggleChat;
  btn.style.cssText = [
    "position:fixed","bottom:70px","right:16px",
    "width:56px","height:56px","border-radius:50%",
    "background:linear-gradient(135deg,#a06808,#C8860A)",
    "border:2px solid rgba(255,255,255,.2)",
    "cursor:pointer","font-size:24px",
    "box-shadow:0 4px 20px rgba(200,134,10,.5)",
    "z-index:9998","transition:all .2s",
    "display:flex","align-items:center","justify-content:center"
  ].join(";");
  btn.onmouseover = function() { this.style.transform = "scale(1.1)"; };
  btn.onmouseout  = function() { this.style.transform = "scale(1)"; };
  document.body.appendChild(btn);

  // Chat window
  var win = document.createElement("div");
  win.id = "chatWindow";
  win.className = "chat-window";
  win.style.display = "none";
  win.innerHTML = [
    '<div class="chat-header">',
      '<div>',
        '<div style="font-weight:700;font-size:14px;color:var(--t)">🏥 HMS Assistant</div>',
        '<div class="chat-status"><span class="status-dot"></span><span id="chatStatusTxt">Online</span></div>',
      '</div>',
      '<button onclick="toggleChat()" style="background:none;border:none;color:var(--tm);cursor:pointer;font-size:18px;padding:4px">✕</button>',
    '</div>',
    '<div id="humanBanner" style="display:none" class="human-banner">👤 You are now chatting with a human agent. Response may take 1-3 minutes.</div>',
    '<div class="chat-msgs" id="chatMsgs"></div>',
    '<div class="quick-btns" id="quickBtns"></div>',
    '<div class="chat-input-row">',
      '<textarea class="chat-input" id="chatInput" placeholder="Type your message..." rows="1" onkeydown="handleChatKey(event)"></textarea>',
      '<button class="chat-send" id="chatSend" onclick="sendMsg()">➤</button>',
    '</div>'
  ].join("");
  document.body.appendChild(win);

  // Welcome message
  setTimeout(function() {
    addBotMsg("Hello! 👋 I'm the AIC Kapsowar HMS Assistant. How can I help you today?");
    setQuickBtns(["Login help","Forgot password","Patient registration","Contact support"]);
  }, 400);
}

function toggleChat() {
  chatOpen = !chatOpen;
  var win = document.getElementById("chatWindow");
  if (win) win.style.display = chatOpen ? "flex" : "none";
  var badge = document.getElementById("chatBadge");
  if (badge) badge.style.display = "none";
  if (chatOpen) {
    var inp = document.getElementById("chatInput");
    if (inp) inp.focus();
  }
}

function addBotMsg(text) {
  chatMessages.push({ role: "bot", text: text });
  renderChat();
}

function addUserMsg(text) {
  chatMessages.push({ role: "user", text: text });
  renderChat();
}

function renderChat() {
  var container = document.getElementById("chatMsgs");
  if (!container) return;
  container.innerHTML = chatMessages.map(function(m) {
    var cls = m.role === "user" ? "chat-msg user-msg" : "chat-msg bot-msg";
    return '<div class="' + cls + '">' + escHtml(m.text) + '</div>';
  }).join("");
  container.scrollTop = container.scrollHeight;
}

function escHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function setQuickBtns(btns) {
  var container = document.getElementById("quickBtns");
  if (!container) return;
  container.innerHTML = btns.map(function(b) {
    return '<button class="quick-btn" onclick="handleQuick(this.textContent)">' + escHtml(b) + '</button>';
  }).join("");
}

function handleQuick(text) {
  var container = document.getElementById("quickBtns");
  if (container) container.innerHTML = "";
  addUserMsg(text);
  processMsg(text);
}

function handleChatKey(e) {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMsg();
  }
}

function showTyping() {
  var container = document.getElementById("chatMsgs");
  if (!container) return;
  var dot = document.createElement("div");
  dot.id = "typingDot";
  dot.className = "chat-msg bot-msg";
  dot.innerHTML = '<span class="typing-dots"><span>.</span><span>.</span><span>.</span></span>';
  container.appendChild(dot);
  container.scrollTop = container.scrollHeight;
}

function hideTyping() {
  var dot = document.getElementById("typingDot");
  if (dot) dot.remove();
}

async function sendMsg() {
  var inp = document.getElementById("chatInput");
  if (!inp) return;
  var text = inp.value.trim();
  if (!text) return;
  inp.value = "";
  addUserMsg(text);
  var container = document.getElementById("quickBtns");
  if (container) container.innerHTML = "";
  await processMsg(text);
}

async function processMsg(text) {
  if (isHumanMode) {
    humanQueue.push(text);
    simulateHumanResponse(text);
    return;
  }

  if (/human|agent|person|speak|real staff|transfer|escalate/i.test(text)) {
    connectToHuman();
    return;
  }

  if (/send email|email admin|contact admin|report issue|bug|not working|broken/i.test(text)) {
    offerEmailAdmin(text);
    return;
  }

  showTyping();
  var sendBtn = document.getElementById("chatSend");
  if (sendBtn) sendBtn.disabled = true;
  var failed = false;

  try {
    var response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 500,
        system: HMS_CONTEXT,
        messages: chatMessages
          .filter(function(m) { return m.role === "user" || m.role === "bot"; })
          .slice(-10)
          .map(function(m) { return { role: m.role === "user" ? "user" : "assistant", content: m.text }; })
      })
    });
    var data = await response.json();
    hideTyping();
    var reply = (data.content && data.content[0]) ? data.content[0].text : null;
    if (reply) {
      addBotMsg(reply);
    } else {
      failed = true;
    }
  } catch(e) {
    failed = true;
  }

  if (failed) {
    hideTyping();
    addBotMsg("I\'m having trouble connecting right now. Would you like to send your question to the admin by email?");
    setTimeout(function() {
      var container = document.getElementById("quickBtns");
      if (container) {
        var safeText = text.replace(/'/g, "");
        container.innerHTML =
          '<button class="quick-btn" onclick="offerEmailAdmin(\'' + safeText + '\')">📧 Email admin</button>' +
          '<button class="quick-btn" onclick="setQuickBtns([])">No thanks</button>';
      }
    }, 300);
  }

  if (sendBtn) sendBtn.disabled = false;
}

function offerEmailAdmin(issue) {
  var container = document.getElementById("quickBtns");
  if (container) container.innerHTML = "";
  addBotMsg("I\'ll send your issue to the admin. Click confirm to proceed.");
  setTimeout(function() {
    var c2 = document.getElementById("quickBtns");
    if (c2) {
      var safeIssue = (issue||"").replace(/'/g, "");
      c2.innerHTML =
        '<button class="quick-btn" onclick="sendEmailToAdmin(\'' + safeIssue + '\')">✅ Yes, send to admin</button>' +
        '<button class="quick-btn" onclick="setQuickBtns([])">Cancel</button>';
    }
  }, 200);
}

async function sendEmailToAdmin(issue) {
  var container = document.getElementById("quickBtns");
  if (container) container.innerHTML = "";
  showTyping();
  var user = {};
  try { user = JSON.parse(localStorage.getItem("user") || "{}"); } catch(e) {}
  try {
    await fetch("http://192.168.1.7:5000/api/chat/email-admin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + (localStorage.getItem("token") || "")
      },
      body: JSON.stringify({
        issue: issue,
        from: user.name || "Unknown User",
        role: user.role || "unknown",
        staffId: user.staffId || user.patientId || "unknown"
      })
    });
    hideTyping();
    addBotMsg("✅ Sent to admin at aic.admin0001@gmail.com. They will get back to you shortly.");
  } catch(e) {
    hideTyping();
    addBotMsg("Could not send. Please contact admin directly:\n📧 aic.admin0001@gmail.com\n📞 +254 700 000 000");
  }
}

function connectToHuman() {
  isHumanMode = true;
  var banner = document.getElementById("humanBanner");
  if (banner) banner.style.display = "";
  addBotMsg("Connecting you to a human agent... Please hold.");
  setTimeout(function() {
    addBotMsg("A staff member will respond shortly. You can also call +254 700 000 000.");
  }, 1500);
}

function simulateHumanResponse(text) {
  setTimeout(function() {
    addBotMsg("Thank you for your message. A staff member will attend to you shortly.");
  }, 2000);
}

// ── NOTIFICATION BADGE ─────────────────────────────────────────
function loadNotifBadge() {
  var token = localStorage.getItem("token");
  if (!token) return;
  var API_URL = "http://192.168.1.7:5000/api";
  fetch(API_URL + "/notifications", {
    headers: { "Authorization": "Bearer " + token }
  })
  .then(function(r) { return r.json(); })
  .then(function(d) {
    var count = d.unreadCount || 0;
    var badge = document.getElementById("notifBadge");
    if (badge) {
      badge.textContent = count > 0 ? (count > 99 ? "99+" : count) : "";
      badge.style.display = count > 0 ? "flex" : "none";
    }
    var chatBadge = document.getElementById("chatBadge");
    if (chatBadge && count > 0 && !chatOpen) {
      chatBadge.textContent = count;
      chatBadge.style.display = "flex";
    }
  })
  .catch(function() {});
}

// ── INITIALIZE ─────────────────────────────────────────────────
function initSettingsAndChat() {
  initTheme();
  buildSettingsBtn();
  buildSocialFooter();
  buildChatbot();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initSettingsAndChat);
} else {
  initSettingsAndChat();
}
