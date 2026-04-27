/**
 * AIC HMS v9 — Admin Dashboard Profile Fix + Unverified Staff UI
 *
 * PROBLEM: editProfile() was called before the profile panel existed in the DOM,
 * and the Save button referenced an inner function that was out of scope.
 *
 * FIX: Move profile panel build into a dedicated buildAdminProfile() function.
 * Make editProfile() and saveProfile() global-scope functions.
 * Also adds "Resend Verification" button to unverified staff list in admin dashboard.
 *
 * USAGE: Drop this file into frontend/pages/ and add to admin-dashboard.html:
 *   <script src="admin-profile-fix.js"></script>
 * Call buildAdminProfile() after the dashboard data loads.
 */

// Global scope — called by onclick in HTML
window.editAdminProfile = function() {
  var panel = document.getElementById('adminProfileForm');
  var view  = document.getElementById('adminProfileView');
  if (!panel || !view) return;
  view.style.display  = 'none';
  panel.style.display = 'block';
};

window.cancelAdminProfileEdit = function() {
  var panel = document.getElementById('adminProfileForm');
  var view  = document.getElementById('adminProfileView');
  if (!panel || !view) return;
  panel.style.display = 'none';
  view.style.display  = 'block';
};

window.saveAdminProfile = async function() {
  var btn = document.getElementById('saveProfileBtn');
  if (btn) { btn.disabled = true; btn.textContent = 'Saving...'; }
  var err = document.getElementById('profileErr');
  if (err) err.style.display = 'none';

  var phone   = (document.getElementById('profPhone')   || {}).value || '';
  var office  = (document.getElementById('profOffice')  || {}).value || '';
  var bio     = (document.getElementById('profBio')     || {}).value || '';
  var resp    = (document.getElementById('profResp')    || {}).value || '';

  try {
    var r = await api('/staff/profile', { method: 'PUT', body: { phone, office, bio, responsibilities: resp } });
    // Update view
    var els = {
      viewPhone:  phone,
      viewOffice: office,
      viewBio:    bio,
      viewResp:   resp
    };
    Object.entries(els).forEach(function([id, val]) {
      var el = document.getElementById(id);
      if (el) el.textContent = val || '—';
    });
    window.cancelAdminProfileEdit();
  } catch(e) {
    if (err) { err.textContent = e.message; err.style.display = 'block'; }
  } finally {
    if (btn) { btn.disabled = false; btn.textContent = '💾 Save Profile'; }
  }
};

// ── BUILD ADMIN PROFILE SECTION ───────────────────────────────────
window.buildAdminProfile = function(staff) {
  var container = document.getElementById('adminProfileSection');
  if (!container) return;

  var phone = staff.phone || '';
  var office = staff.office || '';
  var bio = staff.bio || '';
  var resp = staff.responsibilities || '';

  container.innerHTML = `
    <div class="card-gold" style="border-radius:14px;overflow:hidden">
      <div style="padding:14px 18px;background:var(--gs2);border-bottom:1px solid var(--gbd);display:flex;align-items:center;justify-content:space-between">
        <div style="font-size:13px;font-weight:700;color:var(--t)">👤 My Admin Profile</div>
        <button class="btn btn-gold" style="padding:5px 14px;font-size:11px" onclick="editAdminProfile()">✏️ Edit Profile</button>
      </div>

      <!-- VIEW MODE -->
      <div id="adminProfileView" style="padding:18px">
        <div class="g2">
          <div class="field"><label class="lbl">Full Name</label><div style="color:var(--t);font-size:13px">${staff.first_name || ''} ${staff.last_name || ''}</div></div>
          <div class="field"><label class="lbl">Staff ID</label><div style="color:var(--gold);font-family:monospace;font-size:13px">${staff.staff_id || ''}</div></div>
          <div class="field"><label class="lbl">Department</label><div style="color:var(--t);font-size:13px">${staff.department || 'ADM'}</div></div>
          <div class="field"><label class="lbl">Email</label><div style="color:var(--t);font-size:13px">${staff.email || '—'}</div></div>
          <div class="field"><label class="lbl">Phone</label><div id="viewPhone" style="color:var(--t);font-size:13px">${phone || '—'}</div></div>
          <div class="field"><label class="lbl">Office</label><div id="viewOffice" style="color:var(--t);font-size:13px">${office || '—'}</div></div>
        </div>
        <div class="field" style="margin-top:12px"><label class="lbl">Bio</label><div id="viewBio" style="color:var(--tm);font-size:13px">${bio || '—'}</div></div>
        <div class="field" style="margin-top:8px"><label class="lbl">Responsibilities</label><div id="viewResp" style="color:var(--tm);font-size:13px">${resp || '—'}</div></div>
        <div style="margin-top:12px;padding:10px 14px;background:var(--gs2);border-radius:8px;font-size:11px;color:var(--tf)">
          ✅ Email verified · Joined ${staff.created_at ? new Date(staff.created_at).toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' }) : 'Unknown'}
        </div>
      </div>

      <!-- EDIT MODE (hidden initially) -->
      <div id="adminProfileForm" style="padding:18px;display:none">
        <div class="g2">
          <div class="field span2"><div id="profileErr" class="danger-box" style="display:none;margin-bottom:10px"></div></div>
          <div class="field"><label class="lbl">Phone</label><input class="inp" id="profPhone" value="${phone}" placeholder="+254 7XX XXX XXX"></div>
          <div class="field"><label class="lbl">Office</label><input class="inp" id="profOffice" value="${office}" placeholder="e.g. Block A, Room 12"></div>
        </div>
        <div class="field" style="margin-top:10px">
          <label class="lbl">Bio</label>
          <textarea class="inp" id="profBio" rows="3" placeholder="Brief professional bio...">${bio}</textarea>
        </div>
        <div class="field" style="margin-top:8px">
          <label class="lbl">Responsibilities</label>
          <textarea class="inp" id="profResp" rows="3" placeholder="Key responsibilities...">${resp}</textarea>
        </div>
        <div class="btn-row" style="margin-top:14px">
          <button class="btn-back" onclick="cancelAdminProfileEdit()">← Cancel</button>
          <button class="btn-submit" id="saveProfileBtn" onclick="saveAdminProfile()">💾 Save Profile</button>
        </div>
      </div>
    </div>
  `;
};

// ── UNVERIFIED STAFF PANEL ────────────────────────────────────────
window.buildUnverifiedStaffPanel = async function() {
  var container = document.getElementById('unverifiedStaffSection');
  if (!container) return;

  try {
    var r = await api('/staff/unverified');
    if (!r.length) {
      container.innerHTML = '';
      return;
    }

    container.innerHTML = `
      <div class="card-gold" style="border-radius:14px;overflow:hidden;margin-bottom:16px">
        <div style="padding:12px 18px;background:rgba(239,68,68,.15);border-bottom:1px solid rgba(239,68,68,.3);display:flex;align-items:center;gap:8px">
          <span style="font-size:13px;font-weight:700;color:#ef4444">⚠️ Unverified Staff Emails (${r.length})</span>
        </div>
        <div style="padding:14px 18px">
          <div style="font-size:12px;color:var(--tm);margin-bottom:12px">
            These staff members have not verified their email. They cannot log in. You can resend the verification link or ask them to check their inbox/spam.
          </div>
          <div id="unverifiedList">
            ${r.map(function(s) {
              return `<div style="display:flex;align-items:center;justify-content:space-between;padding:8px 10px;background:var(--gs2);border-radius:8px;margin-bottom:6px">
                <div>
                  <div style="font-size:12px;font-weight:700;color:var(--t)">${s.first_name} ${s.last_name} <span style="color:var(--gold);font-family:monospace">(${s.staff_id})</span></div>
                  <div style="font-size:11px;color:var(--tf)">${s.email} · Registered ${new Date(s.created_at).toLocaleDateString('en-GB')}</div>
                </div>
                <button class="btn" style="font-size:10px;padding:4px 10px" onclick="resendVerification('${s.staff_id}', this)">📧 Resend Link</button>
              </div>`;
            }).join('')}
          </div>
        </div>
      </div>
    `;
  } catch(e) {
    console.error('Unverified staff load error:', e.message);
  }
};

window.resendVerification = async function(staffId, btn) {
  if (btn) { btn.disabled = true; btn.textContent = 'Sending...'; }
  try {
    await api('/notifications/resend-verification', { method: 'POST', body: { staffId } });
    if (btn) { btn.textContent = '✅ Sent!'; btn.style.color = 'var(--green)'; }
    setTimeout(function() {
      if (btn) { btn.disabled = false; btn.textContent = '📧 Resend Link'; btn.style.color = ''; }
    }, 5000);
  } catch(e) {
    if (btn) { btn.disabled = false; btn.textContent = '❌ Failed'; }
    setTimeout(function() {
      if (btn) btn.textContent = '📧 Resend Link';
    }, 3000);
  }
};
