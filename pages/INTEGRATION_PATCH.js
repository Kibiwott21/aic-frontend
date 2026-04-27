/**
 * AIC HMS v9 — Integration Patch
 *
 * Add these imports and lines to your existing backend/routes/index.js
 * ═══════════════════════════════════════════════════════════════════
 */

// ── ADD THESE IMPORTS at top of routes/index.js ─────────────────────────────
import notificationRoutes from './notifications.js';
import staffProfileRoutes from './staffProfile.js';
import { ensureProfileColumns } from './staffProfile.js';
import {
  notifyDeptPatientForwarded,
  notifyLeaveDecision,
  notifyReportAction,
  notifyInvoiceCreated,
  notifyPaymentReceived,
  notifyLowDrugStock,
  notifyLabResultsReady
} from '../services/notificationService.js';

// ── ADD THESE ROUTES after existing route registrations ─────────────────────
router.use('/notifications', notificationRoutes);
router.use('/staff', staffProfileRoutes);

// ── ENSURE DB COLUMNS on startup (add to start() in server.js or routes init)
// ensureProfileColumns();

// ════════════════════════════════════════════════════════════════════════════
// TRIAGE FORWARD — find your existing triage save & forward route and ADD:
// ════════════════════════════════════════════════════════════════════════════

// After saving vitals and updating journey step, ADD:
await notifyDeptPatientForwarded({
  patientId: patient.patient_id,
  patientName: `${patient.first_name} ${patient.last_name}`,
  fromDept: 'TRG',
  toDept: destinationDept,              // from req.body.destination_dept
  vitals: {
    bp: req.body.blood_pressure,
    temp: req.body.temperature,
    spo2: req.body.spo2,
    pulse: req.body.pulse_rate,
    pain: req.body.pain_level
  },
  triageStaffId: req.user.staffId,
  urgency: req.body.visit_type === 'EMG' ? 'emergency' : 'normal'
});


// ════════════════════════════════════════════════════════════════════════════
// LEAVE APPROVAL — find your PUT /api/leave/:id route and ADD:
// ════════════════════════════════════════════════════════════════════════════

// After updating leave status in DB, ADD:
const leaveReq = await query('SELECT * FROM leave_requests WHERE id=$1', [req.params.id]);
if (leaveReq.rows[0]) {
  const lr = leaveReq.rows[0];
  await notifyLeaveDecision({
    staffId: lr.staff_id,
    status: req.body.status,           // 'approved' or 'denied'
    leaveType: lr.leave_type,
    startDate: lr.start_date,
    endDate: lr.end_date,
    adminNote: req.body.admin_note,
    approvedBy: req.user.staffId
  });
}


// ════════════════════════════════════════════════════════════════════════════
// REPORT REVIEW/ESCALATE — find your report status update route and ADD:
// ════════════════════════════════════════════════════════════════════════════

await notifyReportAction({
  staffId: report.staff_id,             // report submitter
  reportId: req.params.id,
  action: req.body.status,             // 'reviewed', 'escalated', 'approved'
  adminNote: req.body.admin_note,
  escalateTo: req.body.escalate_to    // staffId of escalation target (optional)
});


// ════════════════════════════════════════════════════════════════════════════
// INVOICE CREATED — find your POST /api/finance/invoice route and ADD:
// ════════════════════════════════════════════════════════════════════════════

await notifyInvoiceCreated({
  patientId: patient.patient_id,
  invoiceId: newInvoice.invoice_id,
  items: invoiceItems,                 // array of { description, amount }
  total: totalAmount,
  dueDate: null                        // optional
});


// ════════════════════════════════════════════════════════════════════════════
// PAYMENT RECEIVED — find your POST /api/finance/payment route and ADD:
// ════════════════════════════════════════════════════════════════════════════

await notifyPaymentReceived({
  patientId: invoice.patient_id,
  invoiceId: invoice.invoice_id,
  amount: req.body.amount,
  method: req.body.payment_method,    // 'Cash', 'NHIF', 'SHA', 'M-Pesa', etc.
  reference: req.body.reference,
  receivedBy: req.user.staffId
});


// ════════════════════════════════════════════════════════════════════════════
// LOW DRUG STOCK — find your POST /api/pharmacy/dispense route and ADD:
// ════════════════════════════════════════════════════════════════════════════

// After updating drug inventory:
const LOW_STOCK_THRESHOLD = 10;
const updatedDrug = await query('SELECT * FROM drugs WHERE id=$1', [drugId]);
if (updatedDrug.rows[0]) {
  const drug = updatedDrug.rows[0];
  if (drug.quantity <= LOW_STOCK_THRESHOLD) {
    await notifyLowDrugStock({
      drugName: drug.name,
      drugId: drug.id,
      currentQty: drug.quantity,
      threshold: LOW_STOCK_THRESHOLD,
      dispensedBy: req.user.staffId
    });
  }
}


// ════════════════════════════════════════════════════════════════════════════
// LAB RESULTS — find your POST /api/lab/results route and ADD:
// ════════════════════════════════════════════════════════════════════════════

const hasCritical = resultItems.some(r => r.flag === 'Critical');
await notifyLabResultsReady({
  patientId: patient.patient_id,
  testName: testRequest.test_name,
  results: resultItems,               // array of { parameter, value, unit, flag }
  hasCritical,
  orderedByStaffId: testRequest.ordered_by,
  labTechId: req.user.staffId
});


// ════════════════════════════════════════════════════════════════════════════
// HOST IP — Replace hardcoded IPs with environment variable
// In backend/.env add:
//   HOST_IP=192.168.1.5
//   FRONTEND_URL=http://192.168.1.5:5000
//
// In frontend JS, use getApiBase() from notifications-bell.js which
// uses window.location.origin automatically — no hardcoded IP needed.
// ════════════════════════════════════════════════════════════════════════════


// ════════════════════════════════════════════════════════════════════════════
// ADMIN DASHBOARD HTML — add these 3 things:
// ════════════════════════════════════════════════════════════════════════════

// 1. Add div for unverified staff:
//    <div id="unverifiedStaffSection"></div>
//    (place above or below attendance section)

// 2. Add div for profile section:
//    <div id="adminProfileSection"></div>
//    (replace the old inline profile HTML)

// 3. Add script tags at bottom of admin-dashboard.html:
//    <script src="admin-profile-fix.js"></script>
//    <script src="notifications-bell.js"></script>

// 4. After dashboard data loads, call:
//    buildAdminProfile(staffData);
//    buildUnverifiedStaffPanel();
//    buildNotificationBell();
