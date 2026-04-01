<?php
/**
 * contact-mail.php
 * Place this file on your PHP server (same domain or a CORS-allowed domain).
 * Point your Contact form's fetch() at this file's URL.
 */

/* ── CONFIG ──────────────────────────────────────────── */
define('TO_EMAIL',   'jishnunarayanan2002@gmail.com');
define('FROM_EMAIL', 'noreply@21fiftyone.com');   // must be on your server's domain
define('FROM_NAME',  '21FiftyOne Website');
/* ────────────────────────────────────────────────────── */

// Allow cross-origin requests if your Next.js app is on a different domain
header('Access-Control-Allow-Origin: *');           // tighten to your domain in production
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');

// Pre-flight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// Only accept POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed.']);
    exit;
}

// Parse JSON body
$raw  = file_get_contents('php://input');
$data = json_decode($raw, true);

$name    = trim($data['name']    ?? '');
$email   = trim($data['email']   ?? '');
$company = trim($data['company'] ?? '');
$service = trim($data['service'] ?? '');
$message = trim($data['message'] ?? '');

// Basic validation
if (!$name || !$email) {
    http_response_code(400);
    echo json_encode(['error' => 'Name and email are required.']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid email address.']);
    exit;
}

// Sanitise (prevent header injection)
$name    = htmlspecialchars($name,    ENT_QUOTES, 'UTF-8');
$email   = htmlspecialchars($email,   ENT_QUOTES, 'UTF-8');
$company = htmlspecialchars($company, ENT_QUOTES, 'UTF-8');
$service = htmlspecialchars($service, ENT_QUOTES, 'UTF-8');
$message = nl2br(htmlspecialchars($message, ENT_QUOTES, 'UTF-8'));

// Build HTML email
$companyRow = $company ? "
  <tr>
    <td style='padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.08);width:140px;'>
      <span style='font-size:9px;letter-spacing:0.26em;text-transform:uppercase;color:#8a8480;'>Company</span>
    </td>
    <td style='padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.08);'>
      <span style='font-size:14px;font-weight:500;color:#fff;'>{$company}</span>
    </td>
  </tr>" : '';

$serviceRow = $service ? "
  <tr>
    <td style='padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.08);'>
      <span style='font-size:9px;letter-spacing:0.26em;text-transform:uppercase;color:#8a8480;'>Service</span>
    </td>
    <td style='padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.08);'>
      <span style='font-size:14px;color:#c8372d;font-weight:500;'>{$service}</span>
    </td>
  </tr>" : '';

$messageBlock = $message ? "
  <div style='background:rgba(255,255,255,0.04);border-left:3px solid #c8372d;padding:20px 24px;border-radius:0 4px 4px 0;margin-top:4px;'>
    <p style='margin:0 0 8px;font-size:9px;letter-spacing:0.26em;text-transform:uppercase;color:#8a8480;'>Project Brief</p>
    <p style='margin:0;font-size:14px;line-height:1.8;color:rgba(255,255,255,0.8);'>{$message}</p>
  </div>" : '';

$html = <<<HTML
<div style="font-family:'DM Sans',Arial,sans-serif;max-width:600px;margin:0 auto;background:#0c0c0c;color:#fff;border-radius:8px;overflow:hidden;">

  <!-- Header -->
  <div style="background:#c8372d;padding:28px 36px;">
    <h1 style="margin:0;font-size:22px;letter-spacing:0.06em;text-transform:uppercase;font-weight:700;">
      New Project Enquiry
    </h1>
    <p style="margin:6px 0 0;font-size:12px;opacity:0.85;letter-spacing:0.12em;text-transform:uppercase;">
      21FiftyOne — Contact Form
    </p>
  </div>

  <!-- Body -->
  <div style="padding:36px;">
    <table style="width:100%;border-collapse:collapse;margin-bottom:28px;">
      <tr>
        <td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.08);width:140px;">
          <span style="font-size:9px;letter-spacing:0.26em;text-transform:uppercase;color:#8a8480;">Name</span>
        </td>
        <td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.08);">
          <span style="font-size:14px;font-weight:500;color:#fff;">{$name}</span>
        </td>
      </tr>
      <tr>
        <td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.08);">
          <span style="font-size:9px;letter-spacing:0.26em;text-transform:uppercase;color:#8a8480;">Email</span>
        </td>
        <td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.08);">
          <a href="mailto:{$email}" style="font-size:14px;color:#c8372d;text-decoration:none;">{$email}</a>
        </td>
      </tr>
      {$companyRow}
      {$serviceRow}
    </table>

    {$messageBlock}

    <!-- Reply CTA -->
    <div style="margin-top:32px;text-align:center;">
      <a href="mailto:{$email}"
        style="display:inline-block;padding:14px 32px;background:#c8372d;color:#fff;text-decoration:none;font-size:10px;letter-spacing:0.28em;text-transform:uppercase;font-weight:500;border-radius:2px;">
        Reply to {$name}
      </a>
    </div>
  </div>

  <!-- Footer -->
  <div style="padding:20px 36px;border-top:1px solid rgba(255,255,255,0.06);text-align:center;">
    <p style="margin:0;font-size:10px;letter-spacing:0.16em;text-transform:uppercase;color:#8a8480;">
      © 2025 21FiftyOne · Sent via the website contact form
    </p>
  </div>
</div>
HTML;

$subject = "New Enquiry from {$name}" . ($company ? " — {$company}" : '');

$headers  = "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/html; charset=UTF-8\r\n";
$headers .= "From: " . FROM_NAME . " <" . FROM_EMAIL . ">\r\n";
$headers .= "Reply-To: {$email}\r\n";
$headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";

$sent = mail(TO_EMAIL, $subject, $html, $headers);

if ($sent) {
    echo json_encode(['success' => true]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to send email. Please try again.']);
}