<?php 
  $c = curl_init('http://host/lapor');
  $auth_string = 'auth-string';

  $subject = array('email' => 'haha@haha.com', 'telepon' => '' , 'namadepan' => 'Hihi', 'namabelakang' => 'Haha');
  $content = array('isi' => 'Hoho? Hahaha? Hihi!');
  $input = array('token' => '{lapor-token}', 'attachments' => [], 'content' => $content, 'subject' => $subject);
  $data_string = json_encode($input);    

  curl_setopt($c, CURLOPT_HTTPHEADER, array(                                                                          
    'Content-Type: application/json',                                                                                
    'Content-Length: ' . strlen($data_string),
    'Authorization: ' . $auth_string)
  );

  curl_setopt($c, CURLOPT_CUSTOMREQUEST, 'POST');                                                                     
  curl_setopt($c, CURLOPT_POSTFIELDS, $data_string);                                                                  
  curl_setopt($c, CURLOPT_RETURNTRANSFER, true);

  $response = curl_exec($c);
  curl_close($c);

  echo $response;
?>
