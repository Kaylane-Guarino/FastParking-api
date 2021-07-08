<?php
use App\Core\Model;

class Saida{

    public $id;
    public $valorPagar;

    public function getDadosValorApagar($id) {

        $sql = " SELECT dataEntrada, horaEntrada from tblRegistro WHERE id = ? ";

        $stmt = Model::getConn()->prepare($sql);
        $stmt->bindValue(1, $id);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            $resultado = $stmt->fetchAll(\PDO::FETCH_OBJ);
            return $resultado;
        } else {
            return "Cliente não encontrado";
        }
    }

    public function retornaDataHora() {
        date_default_timezone_set("America/Sao_Paulo");
        $data_Hora = new DateTime();
        $dataAtual = $data_Hora->format('Y-m-d');
        $horaAtual = $data_Hora->format('H:i');
        return array($dataAtual, $horaAtual);
    }

    public function atualizar(){

        $sql = " UPDATE tblRegistro SET dataSaida = ?, horaSaida = ?, ativo = ?, valorTotal = ? WHERE id = ? ";

        $stmt = Model::getConn()->prepare($sql);
        $stmt->bindValue(1, $this->retornaDataHora()[0]);
        $stmt->bindValue(2, $this->retornaDataHora()[1]);
        $stmt->bindValue(3, 0);
        $stmt->bindValue(4, $this->valorPagar);
        $stmt->bindValue(5, $this->id);

        return $stmt->execute();
    }
}