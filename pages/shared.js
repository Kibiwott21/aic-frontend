
const DEPTS=[{c:"ADM",n:"Administration"},{c:"REC",n:"Reception"},{c:"TRG",n:"Triage"},{c:"OUT",n:"Outpatient"},{c:"INP",n:"Inpatient"},{c:"EMG",n:"Emergency"},{c:"SRG",n:"Surgery"},{c:"MAT",n:"Maternity"},{c:"PED",n:"Pediatrics"},{c:"ICU",n:"ICU"},{c:"LAB",n:"Laboratory"},{c:"RAD",n:"Radiology"},{c:"PHA",n:"Pharmacy"},{c:"PHY",n:"Physiotherapy"},{c:"NUT",n:"Nutrition"},{c:"MNT",n:"Mental Health"},{c:"DEN",n:"Dental"},{c:"OPT",n:"Ophthalmology"},{c:"FIN",n:"Finance"},{c:"SEC",n:"Security"}];
const ROLES={ADM:["Hospital Administrator","HR Officer","Records Clerk"],REC:["Receptionist","Front Desk Officer"],TRG:["Triage Nurse","Triage Officer"],OUT:["Outpatient Doctor","Clinical Officer","Outpatient Nurse"],INP:["Inpatient Physician","Ward Nurse","Ward Clerk"],EMG:["Emergency Physician","Trauma Nurse","Paramedic"],SRG:["Surgeon","Anaesthesiologist","Scrub Nurse"],MAT:["Obstetrician","Midwife","Neonatal Nurse"],PED:["Pediatrician","Pediatric Nurse"],ICU:["Intensivist","ICU Nurse"],LAB:["Pathologist","Lab Technologist","Phlebotomist"],RAD:["Radiologist","Radiographer"],PHA:["Chief Pharmacist","Pharmacist","Dispenser"],PHY:["Physiotherapist","Rehab Coordinator"],NUT:["Dietitian","Nutritionist"],MNT:["Psychiatrist","Psychologist","Counsellor"],DEN:["Dentist","Dental Nurse"],OPT:["Ophthalmologist","Optometrist"],FIN:["Finance Officer","Billing Clerk"],SEC:["Security Officer","IT Security Analyst"]};

const QUALIFICATIONS={
  ADM:["Bachelor of Business Administration","Bachelor of Public Administration","Diploma in Business Management","Certificate in Office Administration","Bachelor of Human Resource Management","Master of Business Administration"],
  REC:["Certificate in Front Office Management","Diploma in Health Records","Certificate in Customer Service","Diploma in Business Administration","Kenya Certificate of Secondary Education"],
  TRG:["Kenya Registered Nurse (KRN)","Kenya Enrolled Nurse (KEN)","Diploma in Nursing","Bachelor of Science in Nursing","Certificate in Emergency Care"],
  OUT:["MBChB (Bachelor of Medicine & Surgery)","Diploma in Clinical Medicine","Bachelor of Clinical Medicine","Doctor of Medicine (MD)","Master of Medicine (MMed)"],
  INP:["MBChB (Bachelor of Medicine & Surgery)","Diploma in Clinical Medicine","Kenya Registered Nurse","Bachelor of Science in Nursing","Master of Medicine (MMed)"],
  EMG:["MBChB (Bachelor of Medicine & Surgery)","Diploma in Emergency Medicine","Kenya Registered Nurse","Certificate in Emergency Medical Technology","Bachelor of Emergency Medicine"],
  SRG:["MBChB + Fellowship in Surgery","Master of Medicine Surgery (MMed Surgery)","Diploma in Clinical Medicine","Bachelor of Science in Nursing (Perioperative)","Anaesthesiology Fellowship"],
  MAT:["Kenya Registered Midwife (KRM)","Kenya Enrolled Midwife (KEM)","Bachelor of Science in Nursing (Midwifery)","Diploma in Midwifery","MBChB + Obs/Gynae"],
  PED:["MBChB + Paediatrics MMed","Diploma in Clinical Medicine (Paediatrics)","Kenya Registered Nurse (Paediatrics)","Bachelor of Science in Nursing","Certificate in Child Health"],
  ICU:["MBChB + Critical Care","Kenya Registered Nurse (ICU)","Diploma in Intensive Care Nursing","Bachelor of Science in Nursing (Critical Care)","Anaesthesiology Diploma"],
  LAB:["Bachelor of Science in Medical Laboratory Sciences","Diploma in Medical Laboratory Technology","Certificate in Phlebotomy","Higher National Diploma in Laboratory Sciences","Master of Science in Laboratory Medicine"],
  RAD:["Bachelor of Science in Diagnostic Radiography","Diploma in Radiography","Certificate in Radiography","Bachelor of Science in Medical Imaging","Higher National Diploma in Radiography"],
  PHA:["Bachelor of Pharmacy (BPharm)","Diploma in Pharmacy","Certificate in Pharmaceutical Technology","Master of Pharmacy (MPharm)","Doctor of Pharmacy (PharmD)"],
  PHY:["Bachelor of Science in Physiotherapy","Diploma in Physiotherapy","Certificate in Physiotherapy","Higher National Diploma in Rehabilitation","Master of Science in Physiotherapy"],
  NUT:["Bachelor of Science in Nutrition & Dietetics","Diploma in Nutrition","Certificate in Food & Nutrition","Master of Science in Nutrition","Bachelor of Food Science"],
  MNT:["MBChB + Psychiatry MMed","Bachelor of Science in Psychology","Diploma in Counselling","Certificate in Mental Health","Master of Science in Psychology"],
  DEN:["Bachelor of Dental Surgery (BDS)","Diploma in Community Oral Health","Certificate in Dental Technology","Master of Dental Surgery (MDS)","Higher National Diploma in Dental Technology"],
  OPT:["MBChB + Ophthalmology MMed","Bachelor of Science in Optometry","Diploma in Community Eye Health","Certificate in Ophthalmic Clinical Officer","Master of Medicine Ophthalmology"],
  FIN:["Bachelor of Commerce (Finance)","Bachelor of Accounting","Diploma in Business Management","CPA (Certified Public Accountant)","Bachelor of Economics","ACCA"],
  SEC:["Bachelor of Information Technology","Diploma in ICT","Certificate in Cyber Security","Bachelor of Computer Science","Certified Information Systems Security Professional (CISSP)"]
};
const COUNTIES=["Baringo","Bomet","Bungoma","Busia","Elgeyo-Marakwet","Embu","Garissa","Homa Bay","Isiolo","Kajiado","Kakamega","Kericho","Kiambu","Kilifi","Kirinyaga","Kisii","Kisumu","Kitui","Kwale","Laikipia","Lamu","Machakos","Makueni","Mandera","Marsabit","Meru","Migori","Mombasa","Murang'a","Nairobi","Nakuru","Nandi","Narok","Nyamira","Nyandarua","Nyeri","Samburu","Siaya","Taita-Taveta","Tana River","Tharaka-Nithi","Trans Nzoia","Turkana","Uasin Gishu","Vihiga","Wajir","West Pokot"];
const BLOOD=["A+","A-","B+","B-","AB+","AB-","O+","O-"];
const KIN=["Father","Mother","Spouse","Sibling","Child","Guardian","Friend","Other"];

const TOWNS_BY_COUNTY = {
  "Elgeyo-Marakwet":["Kapsowar","Iten","Eldama Ravine","Kabarnet","Tambach","Cheptongei","Chesoi","Arror"],
  "Nairobi":["Nairobi CBD","Westlands","Kasarani","Embakasi","Kibra","Langata","Karen","Parklands"],
  "Mombasa":["Mombasa Town","Nyali","Bamburi","Likoni","Kisauni","Changamwe"],
  "Kisumu":["Kisumu Town","Mamboleo","Kondele","Nyalenda","Milimani","Kisumu East"],
  "Nakuru":["Nakuru Town","Naivasha","Gilgil","Molo","Njoro","Subukia","Rongai"],
  "Uasin Gishu":["Eldoret","Turbo","Burnt Forest","Moiben","Ziwa","Kesses"],
  "Kericho":["Kericho","Litein","Londiani","Fort Ternan","Kipkelion"],
  "Nandi":["Kapsabet","Nandi Hills","Mosoriot","Kobujoi","Chemundu"],
  "Baringo":["Kabarnet","Eldama Ravine","Mogotio","Marigat","Mochongoi"],
  "Trans Nzoia":["Kitale","Kiminini","Saboti","Kwanza","Endebess"],
  "Kakamega":["Kakamega","Mumias","Butere","Lugari","Malava","Navakholo"],
  "Bungoma":["Bungoma","Webuye","Kimilili","Chwele","Sirisia","Tongaren"],
  "Machakos":["Machakos","Athi River","Mavoko","Kangundo","Matungulu"],
  "Kilifi":["Kilifi","Malindi","Mtwapa","Kaloleni","Rabai"],
  "Nyeri":["Nyeri","Othaya","Karatina","Mukurweini","Tetu"],
  "Kiambu":["Thika","Ruiru","Githunguri","Kikuyu","Limuru","Kiambu Town"],
  "OTHER":"Other"
};
const DEPT_FLOW=["REC","TRG","OUT","LAB","RAD","PHA","INP","EMG","SRG","MAT","PED","ICU","MNT","DEN","OPT"];
const API_URL="/api";

var user=JSON.parse(localStorage.getItem("user")||"{}");
var token=localStorage.getItem("token");
var isAdmin=(user.role==="admin");
var isReceptionist=(user.role==="receptionist");
var isTriage=(user.role==="triage"||user.dept==="TRG");

function g(id){return document.getElementById(id);}
function go(page){window.location.href=page;}
function gpid(){return"PAT"+String(Math.floor(10000+Math.random()*90000));}
function gid(dept){return(dept||"ADM").toUpperCase().slice(0,3)+String(Math.floor(1000+Math.random()*9000));}
function signOut(){localStorage.clear();window.location.href="index.html";}

async function api(path,opts){
  opts=opts||{};
  var tok=localStorage.getItem("token");
  try{
    var res=await fetch(API_URL+path,{
      headers:{"Content-Type":"application/json","Authorization":tok?"Bearer "+tok:""},
      method:opts.method||"GET",
      body:opts.body?JSON.stringify(opts.body):undefined,
      timeout:30000
    });
    var data=await res.json();
    
    // Enhanced error handling with HTTP status codes
    if(!res.ok){
      var errMsg=data.error||"Request failed";
      var httpErr=new Error(errMsg);
      httpErr.status=res.status;
      httpErr.statusText=res.statusText;
      httpErr.details=data;
      throw httpErr;
    }
    return data;
  }catch(e){
    // Handle network errors differently
    if(e instanceof TypeError){
      var netErr=new Error("Network error: "+e.message);
      netErr.isNetworkError=true;
      throw netErr;
    }
    // Re-throw with enhanced info
    throw e;
  }
}

// Standardized error display function for all pages
function showError(container,error,title){
  if(!container)return;
  var errorMsg=title||"An error occurred";
  var errorDetails=error.message||"Unknown error";
  var debugInfo=error.message;
  if(error.status){debugInfo="HTTP "+error.status+" - "+debugInfo;}
  
  // Categorize error for better UX
  if(error.status===409||errorDetails.includes("Email already")||errorDetails.includes("23505")){
    errorMsg="Email already registered";
    errorDetails="This email is already registered. Try using a different email.";
  }else if(error.isNetworkError||errorDetails.includes("network")||errorDetails.includes("Network error")){
    errorMsg="Connection Error";
    errorDetails="Cannot reach the server. Check your internet and try again.";
  }else if(error.status===500){
    errorMsg="Server Error";
    errorDetails="Server encountered an error. Please try again later or contact support.";
  }else if(error.status===400){
    errorMsg="Invalid Data";
    errorDetails="Please check all required fields and try again.";
  }else if(error.status===401||error.status===403){
    errorMsg="Authorization Error";
    errorDetails="You don't have permission. Please log in again.";
  }
  
  var eb=document.createElement("div");
  eb.className="danger-box";
  eb.style.cssText="margin:10px 0;padding:12px;border-radius:8px;";
  eb.innerHTML='<div style="font-weight:600;margin-bottom:6px">🚨 '+errorMsg+'</div>'
    +'<div style="font-size:13px;color:var(--tm);line-height:1.5;margin-bottom:8px">'+errorDetails+'</div>'
    +'<div style="font-size:10px;color:var(--tf);margin-top:8px;padding:6px;background:var(--gs2);border-radius:4px;font-family:monospace;word-break:break-all">📋 '+escapeHtml(debugInfo)+'</div>';
  container.innerHTML="";
  container.appendChild(eb);
}

function escapeHtml(text){
  if(!text)return"";
  var map={"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"};
  return text.replace(/[&<>"']/g,function(c){return map[c];});
}

// ── ROLE-BASED PAGE ROUTING MAP ──────────────────────────────
var ROLE_HOME={
  admin:"admin-dashboard.html",
  doctor:"doctor-dashboard.html",
  nurse:"doctor-dashboard.html",
  receptionist:"receptionist-dashboard.html",
  triage:"triage-dashboard.html",
  pharmacist:"pharmacy-dashboard.html",
  lab_tech:"lab-dashboard.html",
  accountant:"finance-dashboard.html",
  records_officer:"staff-portal.html",
  staff:"staff-portal.html"
};

function requireAuth(requiredRoles){
  if(!user.id||!token){window.location.href="login.html";return false;}
  if(requiredRoles&&requiredRoles.length&&!requiredRoles.includes(user.role)){
    // Redirect to their correct home dashboard
    var home=ROLE_HOME[user.role]||"staff-portal.html";
    window.location.href=home;
    return false;
  }
  return true;
}

function requireAdmin(){return requireAuth(["admin"]);}

// Notification badge
async function loadNotifBadge(){
  try{
    var r=await api("/notifications");
    var count=r.unreadCount||0;
    var hRight=g("hRight");
    if(hRight&&count>0&&!g("notifBadge")){
      var b=document.createElement("div");b.id="notifBadge";
      b.style.cssText="font-size:11px;background:var(--dr);color:#fff;padding:3px 10px;border-radius:20px;cursor:pointer;font-weight:700";
      b.textContent="🔔 "+count;
      b.onclick=function(){go("notifications.html");};
      hRight.insertBefore(b,hRight.firstChild);
    }
  }catch(e){}
}

// Navigation items — full role-aware nav
var NAV=[
  // My workspace
  {id:"portal",ico:"🏠",lbl:"My Portal",page:"staff-portal.html",roles:["all"]},
  {id:"my-reports",ico:"📝",lbl:"My Daily Reports",page:"my-reports.html",roles:["all"]},
  {id:"my-leave",ico:"🗓",lbl:"My Leave",page:"leave-requests.html",roles:["all"]},
  // Department dashboards
  {id:"admin-dash",ico:"📊",lbl:"Admin Dashboard",page:"admin-dashboard.html",roles:["admin"]},
  {id:"reception-dash",ico:"🛎",lbl:"Reception Dashboard",page:"receptionist-dashboard.html",roles:["receptionist"]},
  {id:"triage-dash",ico:"🩺",lbl:"Triage Dashboard",page:"triage-dashboard.html",roles:["triage","nurse"]},
  {id:"doctor-dash",ico:"👨‍⚕️",lbl:"Clinical Dashboard",page:"doctor-dashboard.html",roles:["doctor","nurse"]},
  {id:"pharmacy-dash",ico:"💊",lbl:"Pharmacy Dashboard",page:"pharmacy-dashboard.html",roles:["pharmacist"]},
  {id:"lab-dash",ico:"🔬",lbl:"Lab Dashboard",page:"lab-dashboard.html",roles:["lab_tech"]},
  {id:"finance-dash",ico:"💰",lbl:"Finance Dashboard",page:"finance-dashboard.html",roles:["accountant","admin"]},
  // Clinical shared
  {id:"journey",ico:"🏥",lbl:"Patient Journey",page:"patient-journey.html",roles:["all"]},
  {id:"patients",ico:"🧑‍⚕️",lbl:"Patients",page:"patients.html",roles:["all"]},
  {id:"new-patient",ico:"➕",lbl:"Register Patient",page:"new-patient.html",roles:["receptionist","admin"]},
  {id:"appointments",ico:"📅",lbl:"Appointments",page:"appointments.html",roles:["all"]},
  // Admin management
  {id:"admin-reports",ico:"📋",lbl:"All Staff Reports",page:"admin-reports.html",roles:["admin"]},
  {id:"attendance-admin",ico:"🕐",lbl:"Attendance Register",page:"attendance-admin.html",roles:["admin"]},
  {id:"leave-admin",ico:"📆",lbl:"Leave Management",page:"leave-admin.html",roles:["admin"]},
  {id:"staff",ico:"👥",lbl:"Staff Management",page:"staff.html",roles:["admin"]},
  // Security (admin)
  {id:"audit",ico:"🗂",lbl:"Audit Logs",page:"audit-logs.html",roles:["admin"]},
  {id:"alerts",ico:"🚨",lbl:"Security Alerts",page:"security-alerts.html",roles:["admin"]},
  {id:"brute",ico:"🛡",lbl:"Brute Force Monitor",page:"brute-force-monitor.html",roles:["admin"]},
  {id:"intrusion",ico:"🕵",lbl:"Intrusion Monitor",page:"intrusion-monitor.html",roles:["admin"]},
  {id:"network",ico:"📡",lbl:"Network Monitor",page:"network.html",roles:["admin"]},
];

var ROLE_LABEL={admin:"Administrator",doctor:"Doctor",nurse:"Nurse",receptionist:"Receptionist",
  triage:"Triage Officer",pharmacist:"Pharmacist",lab_tech:"Lab Technician",
  records_officer:"Records Officer",accountant:"Accountant",staff:"Staff Member"};

function buildSidebar(activePage){
  var nav=g("navItems"); if(!nav)return;
  if(g("sName"))g("sName").textContent=user.name||"";
  if(g("sId"))g("sId").textContent=user.staffId||"";
  if(g("sRole")){
    g("sRole").textContent=(ROLE_LABEL[user.role]||user.role||"").toUpperCase()+(user.dept?" · "+user.dept:"");
  }
  nav.innerHTML="";
  var sections={
    "My Workspace":["portal","my-reports","my-leave"],
    "Department":["admin-dash","reception-dash","triage-dash","doctor-dash","pharmacy-dash","lab-dash","finance-dash"],
    "Clinical":["journey","patients","new-patient","appointments"],
    "Admin":["admin-reports","attendance-admin","leave-admin","staff"],
    "Security":["audit","alerts","brute","intrusion","network"]
  };
  Object.keys(sections).forEach(function(sec){
    var items=NAV.filter(function(n){return sections[sec].includes(n.id);}).filter(function(n){
      if(n.roles.includes("all"))return true;
      if(isAdmin)return true;
      return n.roles.includes(user.role);
    });
    if(!items.length)return;
    var sh=document.createElement("div");sh.className="nav-section";sh.textContent=sec;nav.appendChild(sh);
    items.forEach(function(n){
      var el=document.createElement("div");
      el.className="nav-item"+(n.page===activePage?" active":"");
      el.innerHTML='<span style="font-size:15px">'+n.ico+'</span><span>'+n.lbl+'</span>';
      el.onclick=function(){go(n.page);};
      nav.appendChild(el);
    });
  });
  loadNotifBadge();
}

function liveClock(elId){
  var el=g(elId); if(!el)return;
  function tick(){el.textContent=new Date().toLocaleTimeString("en-KE",{hour:"2-digit",minute:"2-digit",second:"2-digit"})+" · "+new Date().toLocaleDateString("en-KE",{weekday:"short",day:"2-digit",month:"short",year:"numeric"});}
  tick(); setInterval(tick,1000);
}

// WiFi check
async function checkWifi(){
  if(window.location.pathname.includes("no-wifi"))return;
  try{
    var r=await fetch(API_URL+"/health",{signal:AbortSignal.timeout(4000)});
    var data=await r.json();
    var hRight=g("hRight");
    if(hRight&&!g("wifiBadge")){
      var b=document.createElement("div");b.id="wifiBadge";
      b.style.cssText="font-size:10px;background:var(--sbg);border:1px solid var(--sbd);color:var(--sg);padding:3px 10px;border-radius:20px;display:flex;align-items:center;gap:4px";
      b.innerHTML="<span>📶</span><span>Hospital WiFi</span>";
      hRight.insertBefore(b,hRight.firstChild);
    }
  }catch(e){
    var hRight=g("hRight");
    if(hRight&&!g("wifiBadge")){
      var b=document.createElement("div");b.id="wifiBadge";
      b.style.cssText="font-size:10px;background:var(--wbg);border:1px solid var(--wbd);color:var(--wg);padding:3px 10px;border-radius:20px;cursor:pointer";
      b.textContent="⚠ Check WiFi";b.onclick=function(){go("no-wifi.html");};
      hRight.insertBefore(b,hRight.firstChild);
    }
  }
}
checkWifi();
