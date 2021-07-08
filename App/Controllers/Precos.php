<?php

use App\Core\Controller;

class Precos extends Controller{
    public function index(){

        $precoModel = $this->model("Preco");

        $dados = $precoModel->listAll();

        echo json_encode($dados, JSON_UNESCAPED_UNICODE);

    }

    public function inserir(){

        $json = file_get_contents("php://input");
        $novoPrecoModel = json_decode($json);

        $precoModel = $this->model("Preco");
        $precoModel->valorPrimeiraHora = $novoPrecoModel->valorPrimeiraHora;
        $precoModel->valorDemaisHoras = $novoPrecoModel->valorDemaisHoras;

        $precoModel = $precoModel->inserir();

        if($precoModel){
            http_response_code(201);
            echo json_encode($precoModel);

        }else{
            http_response_code(500);
            echo json_encode(["erro" => "Problemas ao cadastrar preço"]);
        }

    }

    public function update($id){
        $json = file_get_contents("php://input");

        $editValor = json_decode($json);
        $precoModel = $this->model("Preco");
        $precoModel = $precoModel->buscarPorId($id);

        if(!$precoModel){
            http_response_code(404);
            echo json_encode(["erro" => "Preço não encontrado"]);
            exit;
        }

        $precoModel->valorPrimeiraHora = $editValor->valorPrimeiraHora;
        $precoModel->valorDemaisHoras = $editValor->valorDemaisHoras;

        if ($precoModel->atualizar()) {   
            http_response_code(204);
        } else {
            http_response_code(500);
            echo json_encode(["erro" => "Problemas para atualizar o preço"]);
        }
    }
}

?>