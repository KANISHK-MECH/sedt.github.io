/**
 * ============================================================================
 * SRI ESHWAR DRONE TECH RPTO - INTEGRATIONS & AUTOMATIONS CONFIGURATION
 * ============================================================================
 * 
 * 1. GOOGLE SHEETS INTEGRATION
 * ----------------------------------------------------------------------------
 * Paste your Google Sheets Webhook or Google Apps Script Web App URL below.
 * Whenever any student/candidate enrolls or submits an enquiry on the website,
 * it will automatically send the complete application details into your Google Sheet!
 * 
 * --- HOW TO SET UP YOUR GOOGLE SHEET IN 60 SECONDS ---
 * 1. Create a new Google Sheet (or open an existing one).
 * 2. In Google Sheets, click: Extensions > Apps Script.
 * 3. Delete any text in the editor and PASTE this code:
 * 
 *    function doPost(e) {
 *      try {
 *        var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
 *        // If first row is empty, create headers
 *        if (sheet.getLastRow() === 0) {
 *          sheet.appendRow([
 *            "Submission Time",
 *            "Reference ID",
 *            "Candidate Name",
 *            "Phone Number",
 *            "Email",
 *            "Course / Program",
 *            "Preferred Batch",
 *            "Message / Scope",
 *            "Status",
 *            "Target Email"
 *          ]);
 *        }
 *        var data = JSON.parse(e.postData.contents);
 *        sheet.appendRow([
 *          new Date(),
 *          data.id || "",
 *          data.fullName || "",
 *          data.phone || "",
 *          data.email || "",
 *          data.courseName || "",
 *          data.preferredBatch || "",
 *          data.message || "",
 *          data.status || "New",
 *          "dronetech@sece.ac.in"
 *        ]);
 *        return ContentService
 *          .createTextOutput(JSON.stringify({ status: "success", received: true }))
 *          .setMimeType(ContentService.MimeType.JSON);
 *      } catch(err) {
 *        return ContentService
 *          .createTextOutput(JSON.stringify({ status: "error", error: err.toString() }))
 *          .setMimeType(ContentService.MimeType.JSON);
 *      }
 *    }
 * 
 * 4. Click the blue "Deploy" button (top right) > "New deployment".
 * 5. Select type: "Web app".
 *    - Description: "Drone Tech Enrollment Hook"
 *    - Execute as: "Me"
 *    - Who has access: "Anyone"  <-- IMPORTANT
 * 6. Click "Deploy" (authorize permissions if asked).
 * 7. Copy the "Web app URL" (starts with https://script.google.com/macros/s/...).
 * 8. PASTE THAT URL below into GOOGLE_SHEETS_WEBHOOK_URL!
 * 
 * (Alternatively, if using SheetDB, Sheet.best, or a Zapier/Make webhook,
 *  paste that webhook endpoint URL below!)
 */

export const INTEGRATIONS_CONFIG = {
  /**
   * PASTE YOUR GOOGLE SHEET WEBHOOK OR GOOGLE APPS SCRIPT URL HERE:
   * Example: 'https://script.google.com/macros/s/AKfycbx.../exec'
   */
  GOOGLE_SHEETS_WEBHOOK_URL: '',

  /**
   * OFFICIAL ADMISSIONS RECIPIENT EMAIL:
   * All enrollments, training inquiries, and solar inspections are routed here.
   */
  ADMISSIONS_EMAIL: 'dronetech@sece.ac.in',

  /**
   * Official Institution Details
   */
  COLLEGE_NAME: 'Sri Eshwar College of Engineering',
  CAMPUS_LOCATION: 'Vadasithur, Kinathukadavu, Coimbatore, Tamil Nadu 641202',
  ACCOUNTABLE_MANAGER_PHONE: '+91 95006 35060',
  CHIEF_INSTRUCTOR_PHONE: '+91 98947 43267',
  WHATSAPP_NUMBER: '919500635060',
};

/**
 * Helper to construct a pre-filled mailto URL for direct email dispatch to dronetech@sece.ac.in
 */
export function createAdmissionsMailtoUrl(params: {
  fullName: string;
  phone: string;
  email?: string;
  courseName: string;
  preferredBatch?: string;
  message?: string;
  refId?: string;
}): string {
  const subject = encodeURIComponent(
    `[Admission Enrollment] ${params.fullName} - ${params.courseName} (Ref: ${params.refId || 'Web App'})`
  );

  const bodyContent = 
    `Respected Admissions Officer / Chief Instructor,\n` +
    `Sri Eshwar Drone Tech RPTO (SECE),\n\n` +
    `I am submitting my formal enrollment application for DGCA Remote Pilot Certification / Technical Training.\n\n` +
    `--- CANDIDATE DETAILS ---\n` +
    `• Full Name: ${params.fullName}\n` +
    `• Contact Phone: ${params.phone}\n` +
    `• Email Address: ${params.email || 'Not provided'}\n` +
    `• Program / Course: ${params.courseName}\n` +
    `• Preferred Batch: ${params.preferredBatch || 'Immediate upcoming batch'}\n` +
    `• Reference ID: ${params.refId || 'Generated on submission'}\n\n` +
    `--- CANDIDATE MESSAGE / SCOPE ---\n` +
    `${params.message || 'Please send course syllabus, fee schedule, and batch confirmation.'}\n\n` +
    `Thank you,\n${params.fullName}\nPhone: ${params.phone}`;

  const body = encodeURIComponent(bodyContent);

  return `mailto:${INTEGRATIONS_CONFIG.ADMISSIONS_EMAIL}?subject=${subject}&body=${body}`;
}
