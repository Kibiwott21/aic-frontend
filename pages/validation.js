
// ============================================================
// AIC KAPSOWAR HMS — FIELD VALIDATION (Kenya Standards)
// ============================================================

const TODAY = new Date();
const THIS_YEAR = TODAY.getFullYear();

// ── NATIONAL ID ───────────────────────────────────────────────
function validateNID(v) {
  if (!v || !v.trim()) return null; // Optional
  v = v.trim();
  // Accept Kenyan National ID (7-8 digits) or passport (alphanumeric)
  if (/^\d+$/.test(v)) {
    if (v.length < 7) return "National ID too short — must be 7 or 8 digits";
    if (v.length > 8) return "National ID too long — must be 7 or 8 digits";
    if (/^0+$/.test(v)) return "National ID cannot be all zeros";
  } else {
    // Passport — alphanumeric, 6-20 chars
    if (v.length < 6) return "Passport number too short — minimum 6 characters";
    if (v.length > 20) return "Passport number too long — maximum 20 characters";
    if (!/^[A-Za-z0-9]+$/.test(v)) return "Passport should contain only letters and numbers";
  }
  return null;
}

// ── PHONE NUMBER ──────────────────────────────────────────────
// Accepts: +254712345678 | 0712345678 | 254712345678
function normalizePhone(v) {
  if (!v) return '';
  v = v.trim().replace(/[\s\-()]/g, '');
  // Strip country code — store as local 07XX format
  if (v.startsWith('+254')) v = '0' + v.slice(4);
  else if (v.startsWith('254') && v.length === 12) v = '0' + v.slice(3);
  return v.replace(/\D/g, '');
}

function formatPhoneDisplay(v) {
  // Display as +254 7XX XXX XXX
  var n = normalizePhone(v);
  if (n.length === 10 && n.startsWith('0')) {
    return '+254 ' + n.slice(1,4) + ' ' + n.slice(4,7) + ' ' + n.slice(7);
  }
  return v;
}

function validatePhone(v, required) {
  if (!v || !v.trim()) {
    return required ? "Phone number is required" : null;
  }
  var norm = normalizePhone(v);
  if (norm.length !== 10) return "Enter a valid Kenyan number e.g. +254712345678 or 0712345678";
  if (!norm.startsWith('0')) return "Invalid format — use +254712345678 or 0712345678";
  var validStarts = ["070","071","072","073","074","075","076","077","078","079","010","011","012","013","014","015","016","017","018","019"];
  if (!validStarts.some(function(p){ return norm.startsWith(p); })) {
    return "Invalid Kenyan network prefix — Safaricom: 07XX, Airtel/Telkom: 01XX";
  }
  return null;
}

// ── POSTAL ADDRESS ─────────────────────────────────────────────
function validateAddress(v) {
  if (!v || !v.trim()) return null; // Optional
  v = v.trim();
  if (v.length < 5) return "Address too short — e.g. P.O. Box 52-30705, Kapsowar";
  if (v.length > 150) return "Address too long — maximum 150 characters";
  return null;
}


// ── INSURANCE NUMBER ──────────────────────────────────────────
function validateInsurance(provider, number) {
  if (!provider || provider === "None / Self-Pay" || !number) return null;
  number = number.trim().toUpperCase();
  var patterns = {
    "SHA":      { regex: /^SHA-\d{7,12}$/, hint: "SHA-XXXXXXXXXX" },
    "NHIF":     { regex: /^NHIF-\d{5,10}$/, hint: "NHIF-XXXXXX" },
    "AAR":      { regex: /^AAR-[A-Z]{2}-\d{5,10}$/, hint: "AAR-KE-XXXXXXX" },
    "Jubilee":  { regex: /^JUB-\d{7,12}$/, hint: "JUB-XXXXXXXXX" },
    "Britam":   { regex: /^BRT-\d{5,10}$/, hint: "BRT-XXXXXXX" },
    "CIC":      { regex: /^CIC-\d{5,10}$/, hint: "CIC-XXXXXX" },
    "UAP":      { regex: /^UAP-\d{5,10}$/, hint: "UAP-XXXXXXX" }
  };
  if (patterns[provider]) {
    if (!patterns[provider].regex.test(number)) {
      return "Format should be: " + patterns[provider].hint;
    }
  } else {
    if (number.length < 4) return "Insurance number too short";
    if (number.length > 30) return "Insurance number too long";
  }
  return null;
}

// ── NAME VALIDATION ───────────────────────────────────────────
function validateName(v, field) {
  if (!v || !v.trim()) return field + " is required";
  v = v.trim();
  if (v.length < 2) return field + " is too short — minimum 2 characters";
  if (v.length > 50) return field + " is too long — maximum 50 characters";
  if (!/^[A-Za-z\s\-\']+$/.test(v)) return field + " should contain letters only";
  return null;
}
// ── DATE OF BIRTH ─────────────────────────────────────────────
function getAge(birthDate) {
  var today = new Date();
  var age = today.getFullYear() - birthDate.getFullYear();
  var m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
  return age;
}

function getMonthName(m) {
  var names = ["","January","February","March","April","May","June",
               "July","August","September","October","November","December"];
  return names[m] || "";
}

function validateDOB(v, accountType) {
  if (!v) return "Date of birth is required";

  var parts = v.split('-');
  if (parts.length !== 3) return "Invalid date format — use the date picker";

  var year  = parseInt(parts[0]);
  var month = parseInt(parts[1]);
  var day   = parseInt(parts[2]);

  // ── Year ─────────────────────────────────────────────────
  if (isNaN(year) || year.toString().length !== 4)
    return "Enter a valid 4-digit year";
  if (year < 1900)
    return "Year " + year + " is too far in the past — minimum year is 1900";
  if (year > THIS_YEAR)
    return "Year " + year + " cannot be in the future";

  // ── Month ─────────────────────────────────────────────────
  if (isNaN(month) || month < 1 || month > 12)
    return "Invalid month — must be 01 (January) to 12 (December)";

  // ── Day ───────────────────────────────────────────────────
  var daysInMonth = new Date(year, month, 0).getDate();
  if (isNaN(day) || day < 1 || day > daysInMonth)
    return "Invalid day — " + getMonthName(month) + " " + year + " has only " + daysInMonth + " days (you entered " + day + ")";

  // ── Future ────────────────────────────────────────────────
  var date = new Date(v + 'T00:00:00');
  if (date > TODAY) return "Date of birth cannot be in the future";

  // ── Age range by account type ──────────────────────────────
  var age = getAge(date);
  if (accountType === 'staff') {
    if (age < 16) return "Staff must be at least 16 years old (calculated age: " + age + " years)";
    if (age > 75) return "Age " + age + " exceeds maximum allowed working age of 75";
  } else {
    // Patient
    if (age > 120) return "Age " + age + " exceeds the valid range (maximum 120 years)";
  }
  return null;
}

// ── START DATE ────────────────────────────────────────────────
function validateStartDate(v) {
  if (!v) return null;
  var year = parseInt((v||'').split('-')[0]);
  if (isNaN(year) || year < 1980) return "Start year cannot be before 1980";
  var maxYear = THIS_YEAR + 1;
  if (year > maxYear) return "Start date cannot be more than 1 year in the future";
  return null;
}

// ── EMAIL ─────────────────────────────────────────────────────
function validateEmail(v) {
  if (!v || !v.trim()) return "Email address is required";
  v = v.trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v))
    return "Invalid email — e.g. yourname@gmail.com";
  return null;
}

// ── NAME ──────────────────────────────────────────────────────
function validateName(v, label) {
  if (!v || !v.trim()) return (label || "This field") + " is required";
  if (v.trim().length < 2) return (label || "Name") + " is too short — minimum 2 characters";
  if (/[0-9]/.test(v)) return (label || "Name") + " cannot contain numbers";
  if (/[!@#$%^&*()_+=\[\]{};:'",.<>?/\\|`~]/.test(v))
    return (label || "Name") + " contains invalid characters";
  return null;
}

// ── ATTACH REAL-TIME VALIDATION TO INPUT ──────────────────────
function attachFieldValidation(inputEl, validateFn, hintText) {
  if (!inputEl) return;

  // Add hint
  if (hintText) {
    var existing = inputEl.parentNode.querySelector('.field-hint');
    if (!existing) {
      var hint = document.createElement('div');
      hint.className = 'field-hint';
      hint.style.cssText = 'font-size:10px;color:var(--tf);margin-top:3px;line-height:1.4';
      hint.textContent = '💡 ' + hintText;
      inputEl.parentNode.appendChild(hint);
    }
  }

  // Error element
  function getErr() {
    var e = inputEl.parentNode.querySelector('.field-err-live');
    if (!e) {
      e = document.createElement('div');
      e.className = 'err-msg field-err-live';
      e.style.display = 'none';
      inputEl.parentNode.appendChild(e);
    }
    return e;
  }

  inputEl.addEventListener('blur', function() {
    var err = validateFn(this.value);
    var errEl = getErr();
    if (err) {
      errEl.textContent = '⚠ ' + err;
      errEl.style.display = 'block';
      this.style.borderColor = 'var(--dg)';
      this.style.boxShadow = '0 0 0 2px #ef444420';
    } else {
      errEl.style.display = 'none';
      if (this.value.trim()) {
        this.style.borderColor = 'var(--sg)';
        this.style.boxShadow = '0 0 0 2px #22c55e15';
      } else {
        this.style.borderColor = '';
        this.style.boxShadow = '';
      }
    }
  });

  // Clear error on focus
  inputEl.addEventListener('focus', function() {
    this.style.borderColor = 'var(--gold)';
    this.style.boxShadow = '0 0 0 3px #C8860A20';
  });
}
