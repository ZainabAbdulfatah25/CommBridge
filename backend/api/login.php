<?php
require "../config.php";
require "../utils/functions.php";
if($_SERVER["REQUEST_METHOD"]=="POST"){
$email=sanitizeInput($_POST["email"]);
$password=sanitizeInput($_POST["password"]);
$stmt=$conn->prepare("SELECT * FROM users WHERE email=?");
$stmt->execute([$email]);
$user=$stmt->fetch(PDO::FETCH_ASSOC);
if($user && password_verify($password,$user["password"])){
echo json_encode(["success"=>true,"message"=>"Login successful.","user"=>$user]);
}else{echo json_encode(["success"=>false,"message"=>"Invalid credentials."]);}
}
?>
