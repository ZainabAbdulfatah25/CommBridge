<?php
require "../config.php";
require "../utils/functions.php";
if($_SERVER["REQUEST_METHOD"]=="POST"){
$username=sanitizeInput($_POST["username"]);
$email=sanitizeInput($_POST["email"]);
$password=password_hash(sanitizeInput($_POST["password"]),PASSWORD_DEFAULT);
$stmt=$conn->prepare("INSERT INTO users (username,email,password) VALUES (?,?,?)");
if($stmt->execute([$username,$email,$password])){
echo json_encode(["success"=>true,"message"=>"User registered successfully."]);
}else{echo json_encode(["success"=>false,"message"=>"Registration failed."]);}
}
?>
