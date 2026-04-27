/**
 * AIC HMS v9 — Notification Bell Component
 * Paste this into shared.js, or include as a separate file.
 * Shows real-time notification badge and dropdown for staff and patients.
 *
 * Usage: buildNotificationBell() — call in initSettingsAndChat() or after buildSidebar()
 */

// ── DYNAMIC API BASE (no hardcoded IP) ───────────────────────────
function getApiBase() {
  return window.location.origin + '/api';
}

// ── NOTIFICATION BELL ────────────────────────────────────────────
var _notifPollInterval = null;
var _notifOpen = false;

function buildNotificationBell() {
  if (document.getElementById('aicNotifBell')) return;

  // Style block
  var style = document.createElement('style');
  style.textContent = `
    #aicNotifBell {
      position: fixed; top: 16px; right: 60px; z-index: 9100;
    }
    #aicNotifBtn {
      width: 38px; height: 38px; border-radius: 50%;
      background: var(--gs2); border: 1px solid var(--gbd);
      cursor: pointer; display: flex; align-items: center; justify-content: center;
      font-size: 16px; position: relative; transition: all .2s;
    }
    #aicNotifBtn:hover { border-color: var(--gold); background: rgba(200,134,10,.1); }
    #aicNotifBadge {
      position: absolute; top: -4px; right: -4px;
      background: #ef4444; color: #fff; font-size: 9px; font-weight: 700;
      border-radius: 10px; padding: 1px 5px; min-width: 16px; text-align: center;
      display: none; border: 2px solid var(--s1);
    }
    #aicNotifPanel {
      position: fixed; top: 60px; right: 8px; width: 340px; max-height: 480px;
      background: var(--s1); border: 1px solid var(--gbd); border-radius: 14px;
      box-shadow: 0 8px 32px rgba(0,0,0,.4); z-index: 9099;
      display: none; flex-direction: column; overflow: hidden;
    }
    #aicNotifPanel.open { display: flex; }
    .notif-header {
      padding: 12px 14px; border-bottom: 1px solid var(--gbd);
      display: flex; align-items: center; justify-content: space-between;
    }
    .notif-header-title { font-size: 13px; font-weight: 700; color: var(--t); }
    .notif-read-all {
      font-size: 10px; color: var(--gold); cursor: pointer; background: none;
      border: none; padding: 0;
    }
    .notif-list { overflow-y: auto; flex: 1; }
    .notif-item {
      padding: 10px 14px; border-bottom: 1px solid var(--gbd2);
      cursor: pointer; transition: background .15s;
    }
    .notif-item:hover { background: var(--gs2); }
    .notif-item.unread { border-left: 3px solid var(--gold); }
    .notif-item.critical { border-left: 3px solid #ef4444; }
    .notif-item-title { font-size: 12px; font-weight: 700; color: var(--t); margin-bottom: 3px; }
    .notif-item-msg { font-size: 11px; color: var(--tm); line-height: 1.4; }
    .notif-item-time { font-size: 10px; color: var(--tf); margin-top: 4px; }
    .notif-empty { padding: 32px; text-align: center; color: var(--tf); font-size: 12px; }
  `;
  document.head.appendChild(style);

  var bell = document.createElement('div');
  bell.id = 'aicNotifBell';
  bell.innerHTML = `
    <button id="aicNotifBtn" onclick="toggleNotifPanel()" title="Notifications">
      🔔
      <span id="aicNotifBadge">0</span>
    </button>
  `;
  document.body.appendChild(bell);

  var panel = document.createElement('div');
  panel.id = 'aicNotifPanel';
  panel.innerHTML = `
    <div class="notif-header">
      <span class="notif-header-title">🔔 Notifications</span>
      <button class="notif-read-all" onclick="markAllNotifRead()">Mark all read</button>
    </div>
    <div class="notif-list" id="aicNotifList">
      <div class="notif-empty">Loading...</div>
    </div>
  `;
  document.body.appendChild(panel);

  // Close when clicking outside
  document.addEventListener('click', function(e) {
    if (!bell.contains(e.target) && !panel.contains(e.target)) {
      panel.classList.remove('open');
      _notifOpen = false;
    }
  });

  // Poll every 30 seconds
  loadNotifications();
  _notifPollInterval = setInterval(loadNotifications, 30000);
}

function toggleNotifPanel() {
  var panel = document.getElementById('aicNotifPanel');
  if (!panel) return;
  _notifOpen = !_notifOpen;
  if (_notifOpen) {
    panel.classList.add('open');
    loadNotifications();
  } else {
    panel.classList.remove('open');
  }
}

async function loadNotifications() {
  var token = localStorage.getItem('token');
  if (!token) return;
  try {
    var r = await fetch(getApiBase() + '/notifications', {
      headers: { 'Authorization': 'Bearer ' + token }
    });
    if (!r.ok) return;
    var data = await r.json();

    // Update badge
    var badge = document.getElementById('aicNotifBadge');
    if (badge) {
      if (data.unread > 0) {
        badge.textContent = data.unread > 99 ? '99+' : data.unread;
        badge.style.display = 'block';
      } else {
        badge.style.display = 'none';
      }
    }

    // Update panel list
    var list = document.getElementById('aicNotifList');
    if (!list || !_notifOpen) return;

    if (!data.notifications || data.notifications.length === 0) {
      list.innerHTML = '<div class="notif-empty">✓ No notifications</div>';
      return;
    }

    list.innerHTML = data.notifications.map(function(n) {
      var time = new Date(n.created_at);
      var timeStr = time.toLocaleDateString('en-GB', { day:'2-digit', month:'short' }) +
                    ' ' + time.toLocaleTimeString('en-GB', { hour:'2-digit', minute:'2-digit' });
      var cls = 'notif-item' + (n.read ? '' : ' unread') + (n.priority === 'critical' ? ' critical' : '');
      return '<div class="' + cls + '" onclick="handleNotifClick(' + n.id + ',\'' + (n.link || '') + '\')">' +
        '<div class="notif-item-title">' + escHtml(n.title) + '</div>' +
        '<div class="notif-item-msg">' + escHtml(n.message) + '</div>' +
        '<div class="notif-item-time">' + timeStr + '</div>' +
        '</div>';
    }).join('');
  } catch(e) {}
}

function escHtml(s) {
  if (!s) return '';
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

async function handleNotifClick(id, link) {
  var token = localStorage.getItem('token');
  if (token) {
    fetch(getApiBase() + '/notifications/' + id + '/read', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + token }
    }).catch(function(){});
  }
  if (link) window.location.href = link;
}

async function markAllNotifRead() {
  var token = localStorage.getItem('token');
  if (!token) return;
  try {
    await fetch(getApiBase() + '/notifications/read-all', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + token }
    });
    loadNotifications();
  } catch(e) {}
}
