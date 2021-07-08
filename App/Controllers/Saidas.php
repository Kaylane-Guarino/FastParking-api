<?php

session_start();

use App\Core\Controller;


class Saidas extends Controller{

    public function retornaDataHora() {
        date_default_timezone_set("America/Sao_Paulo");
        $data_Hora = new DateTime();
        $dataAtual = $data_Hora->format('Y-m-d');
        $horaAtual = $data_Hora->format('H:i');
        return array($dataAtual, $horaAtual);
    }
    
    public function calcularPreco($id){

        $precoModel = $this->model("Preco");
        $precos = $precoModel->listAll();
    
        $clienteSaida = $this->model("Saida");
        $dataHoraDeEntrada = $clienteSaida->getDadosValorApagar($id);
    
        $dataSaida = new DateTime($this->retornaDataHora()[0]);
        $horaSaida = new DateTime($this->retornaDataHora()[1]);
    
        $dataEntrada = new DateTime($dataHoraDeEntrada[0]->dataEntrada);
        $horaEntrada = new DateTime($dataHoraDeEntrada[0]->horaEntrada);
        
        $qtdHorasEstacionado =  $horaSaida->diff($horaEntrada);
    
        $qtdDiasEstacionado = $dataSaida->diff($dataEntrada);

        if ($qtdDiasEstacionado->d == 0) {
    
            $valorPagar = ($precos[0]->valorDemaisHoras * $qtdHorasEstacionado->h + $precos[0]->valorPrimeiraHora);
    
        } else {
            $valorPagar = ($precos[0]->valorDemaisHoras * $qtdDiasEstacionado->d * 24) + $precos[0]->valorDemaisHoras;
        }
        
        return $valorPagar;
    }

    public function update($id){

        $clienteModel = $this->model("Saida");

        if(!$clienteModel){
            http_response_code(404);
            echo json_encode(["erro" => "Cliente não encontrado"]);
            exit;
        }

        $clienteModel->id = $id;
        $clienteModel->valorPagar = $this->calcularPreco($id);

        if ($clienteModel->atualizar()) {   
            http_response_code(204);
        } else {
            http_response_code(500);
            echo json_encode(["erro" => "Problemas para atualizar o cliente"]);
        }

    }
}