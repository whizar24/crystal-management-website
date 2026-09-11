<?php
/**
 * Crystal Management Services — enquiry handler for cPanel/PHP hosting.
 * Receives contact form posts and emails the business inbox.
 */

header('Content-Type: application/json; charset=UTF-8');
header('X-Content-Type-Options: nosniff');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(['ok' => false, 'error' => 'Method not allowed']);
  exit;
}

$to = 'schola@cteprojects.org.uk';
$name = trim((string)($_POST['name'] ?? ''));
$email = trim((string)($_POST['email'] ?? ''));
$phone = trim((string)($_POST['phone'] ?? ''));
$interest = trim((string)($_POST['interest'] ?? ''));
$message = trim((string)($_POST['message'] ?? ''));

if ($name === '' || $email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
  http_response_code(422);
  echo json_encode(['ok' => false, 'error' => 'Invalid name or email']);
  exit;
}

$safeName = str_replace(["\r", "\n"], '', $name);
$safeEmail = str_replace(["\r", "\n"], '', $email);
$subject = 'Website enquiry — ' . ($interest !== '' ? $interest : 'General');

$body = "New website enquiry\n\n"
  . "Name: {$safeName}\n"
  . "Email: {$safeEmail}\n"
  . "Phone: {$phone}\n"
  . "Interest: {$interest}\n\n"
  . "Message:\n{$message}\n";

$headers = [
  'MIME-Version: 1.0',
  'Content-Type: text/plain; charset=UTF-8',
  'From: Crystal Website <noreply@crystalmgmt.co.uk>',
  'Reply-To: ' . $safeName . ' <' . $safeEmail . '>',
];

$sent = @mail($to, $subject, $body, implode("\r\n", $headers));

if (!$sent) {
  http_response_code(500);
  echo json_encode(['ok' => false, 'error' => 'Unable to send email']);
  exit;
}

echo json_encode(['ok' => true]);
