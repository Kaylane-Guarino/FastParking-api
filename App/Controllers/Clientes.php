<?php

session_start();

use App\Core\Controller;

class Clientes extends Controller{

    public function index(){

        $clienteModel = $this->model("Cliente");

        $dados = $clienteModel->listAll();

        echo json_encode($dados, JSON_UNESCAPED_UNICODE);
    }

    public function inserir(){
        $json = file_get_contents("php://input");
        $novoCliente = json_decode($json);

        $clienteModel = $this->model("Cliente");
        $clienteModel->nome = $novoCliente->nome;
        $clienteModel->placa = $novoCliente->placa;
        $clienteModel->ativo = $novoCliente->ativo;

        $clienteModel = $clienteModel->inserir();

        if($clienteModel){
            http_response_code(201);
            echo json_encode($clienteModel);

        }else{
            http_response_code(500);
            echo json_encode(["erro" => "Problemas ao cadastrar novo cliente"]);
        }
    }

    public function update($idCliente){
        $json = file_get_contents("php://input");

        $editClient = json_decode($json);
        $clienteModel = $this->model("Cliente");
        $clienteModel = $clienteModel->buscarPorId($idCliente);

        if(!$clienteModel){
            http_response_code(404);
            echo json_encode(["erro" => "Cliente não encontrado"]);
            exit;
        }

        $clienteModel->nome = $editClient->nome;
        $clienteModel->placa = $editClient->placa;
        $clienteModel->ativo = $editClient->ativo;

        if ($clienteModel->atualizar()) {   
            http_response_code(204);
        } else {
            http_response_code(500);
            echo json_encode(["erro" => "Problemas para atualizar o cliente"]);
        }
    }

    public function delete($idCliente){

        $clienteModel = $this->model("Cliente");
        $clienteModel = $clienteModel->buscarPorId($idCliente);

        if(!$clienteModel){
            http_response_code(404);
            echo json_encode(["erro" => "Cliente não encontrado"]);
            exit;
        }

        if ($clienteModel->delete()) {
            http_response_code(204);
        } else {
            http_response_code(500);
            echo json_encode(["erro" => "Problemas ao deletar o cliente"]);
        }
    }

    public function find($idCliente){
        $clienteModel = $this->model("Cliente");
        $cliente = $clienteModel->buscarPorId($idCliente);

        if($cliente){
            echo json_encode($cliente, JSON_UNESCAPED_UNICODE);
        }else{
            http_response_code(404);
            echo json_encode(["erro" => "Cliente não encontrado"]);
        }
    }

    public function updateSaida($idCliente){
        $clienteEditar = $this->getRequestBody();

        $clienteModel = $this->model("Cliente");
        $clienteModel = $clienteModel->buscarPorId($idCliente);

        if (!$clienteModel) {

            http_response_code(404);
            echo json_encode(["ERRO" => "Cliente não encontrada"]);
            exit;
        }

        $clienteModel->ativo = $clienteEditar->ativo;

        if ($clienteModel->saida()) {

            http_response_code(204);
        } else {

            http_response_code(500);
            echo json_encode(["ERRO" => "Problemas ao editar entrada"]);
        }
    }

}

?>