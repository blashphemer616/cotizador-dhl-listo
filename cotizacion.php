<?php
$conexion = new mysqli("localhost", "root", "12345678", "cotizaciones"); 

if ($conexion->connect_error) {
    die("Error de conexión: " . $conexion->connect_error);
}

$data = json_decode(file_get_contents("php://input"), true);

$stmt = $conexion->prepare("INSERT INTO cotizaciones (
    tipo_paquete, peso, ancho, alto, fondo, volumen, origen, destino, distancia,
    costo_base, costo_volumen, costo_transporte, total
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

$stmt->bind_param(
    "sddddddssdddd",
    $data["tipo_paquete"], $data["peso"], $data["ancho"], $data["alto"], $data["fondo"],
    $data["volumen"], $data["origen"], $data["destino"], $data["distancia"],
    $data["costo_base"], $data["costo_volumen"], $data["costo_transporte"], $data["total"]
);

$stmt->execute();
echo json_encode(["success" => true]);
$stmt->close();
$conexion->close();
?>

