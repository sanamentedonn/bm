<?php
require __DIR__ . '/vendor/autoload.php';

$response = 'fail';

if (isset($_GET['p'])) {
  $phoneUtil = \libphonenumber\PhoneNumberUtil::getInstance();
  $numberStr = '+' . trim(urldecode($_GET['p']), " +\t\n\r\0\x0B");

  try {
    $number = $phoneUtil->parse($numberStr, 'GB');
    $response = $phoneUtil->isValidNumber($number)
      ? 'ok'
      : 'fail';
  } catch (\libphonenumber\NumberParseException $e) {
    var_dump($e);
  }
}

if (isset($_GET['e'])) {
  $email = trim(urldecode($_GET['e']));
  $emailArray = explode("@", $email);
  $domain = array_pop($emailArray);

  $response = checkdnsrr($domain, "mx") ? 'ok' : 'fail';
}

echo $response;
?>