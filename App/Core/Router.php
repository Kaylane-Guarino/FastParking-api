<?php

namespace App\Core;

class Router{
    
    private $controller;
    private $httpmethod = "GET";
    private $controllerMethod;
    private $params = [];
    function __construct()
    {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS');
        header("Access-Control-Allow-Headers: Content-Type");
        header("content-type: application/json");
        $url = $this->parseURL();
        if (isset($url[1]) && file_exists("../App/Controllers/" . $url[1] . ".php")) {
            $this->controller = $url[1];
            unset($url[1]);
        } elseif (empty($url[1])) {
            $this->controller = "clientes";
        } else {
            $this->controller = "erro404";
        }
        require_once "../App/Controllers/" . $this->controller . ".php";
        $this->controller = new $this->controller;
        $this->httpmethod = $_SERVER["REQUEST_METHOD"];
        switch ($this->httpmethod) {
            case "GET":
                if (!isset($url[2])) {
                    $this->controllerMethod = "index";
                } elseif (is_numeric($url[2])) {
                    $this->controllerMethod = "find";
                    $this->params = [$url[2]];
                } else {
                    http_response_code(400);
                    echo json_encode(
                        ["erro" => "Parâmetro inválido"],
                        JSON_UNESCAPED_UNICODE
                    );
                    exit;
                }
                break;
            case "POST":
                $this->controllerMethod = "inserir";
                break;
            case "PUT":
                // if($this->controller == "saidas"){
                //     $this->controllerMethod = "calcularPreco";
                //     $this->getParams($url);
                // }
                $this->controllerMethod = "update";
                $this->getParams($url);
                break;
            case "DELETE":
                $this->controllerMethod = "delete";
                $this->getParams($url);
                break;
            case "PATCH":
                $this->controllerMethod = "updateSaida";
                $this->getParams($url);
                break;
            default:
                echo "Método não habilitado";
                exit;
        }
        call_user_func_array([$this->controller, $this->controllerMethod], $this->params);
    }
    private function parseURL()
    {
        return explode("/", $_SERVER["SERVER_NAME"] . $_SERVER["REQUEST_URI"]);
    }
    private function getParams($url)
    {
        if (isset($url[2]) && is_numeric($url[2])) {
            $this->params = [$url[2]];
        } else {
            http_response_code(400);
            echo json_encode(["erro" => "Parâmetro inválido"], JSON_UNESCAPED_UNICODE);
            exit;
        }
    }
}
