<?php
use App\Core\Model;
class Cliente
{
    public $id;
    public $nome;
    public $placa;
    public $dataEntrada;
    public $horaEntrada;
    public $ativo;
    public $valorTotal;

    public function listAll(){
        $sql = "SELECT * from tblRegistro";
        $stmt = Model::getConn()->prepare($sql);
        $stmt->execute();
        if ($stmt->rowCount() > 0) {
            return $stmt->fetchAll(PDO::FETCH_OBJ);
        } else {
            return [];
        }
    }

    public function retornaDataHora(){
        date_default_timezone_set("America/Sao_Paulo");
        $data_Hora = new DateTime();
        $dataAtual = $data_Hora->format('Y-m-d');
        $horaAtual = $data_Hora->format('H:i');
        return array($dataAtual, $horaAtual);
    }

    public function inserir(){

        $sql = "INSERT into tblRegistro 
                    (nome, placa, dataEntrada, horaEntrada, ativo) values(?, ?, ?, ?, ?)";
        $stmt = Model::getConn()->prepare($sql);
        $stmt->bindValue(1, $this->nome);
        $stmt->bindValue(2, $this->placa);
        $stmt->bindValue(3, $this->retornaDataHora()[0]);
        $stmt->bindValue(4, $this->retornaDataHora()[1]);
        $stmt->bindValue(5, $this->ativo);
        
        if ($stmt->execute()) {
            $this->id = Model::getConn()->lastInsertId();
            return $this;
        } else {
            return false;
        }
    }

    public function buscarPorId($id){
        $sql = " SELECT * FROM tblRegistro WHERE id = ? ";
        $stmt = Model::getConn()->prepare($sql);
        $stmt->bindValue(1, $id);
        $stmt->execute();
        if ($stmt->rowCount() > 0) {
            $entrada = $stmt->fetch(PDO::FETCH_OBJ);
            $this->id = $entrada->id;
            $this->nome = $entrada->nome;
            $this->placa = $entrada->placa;
            $this->dataEntrada = $entrada->dataEntrada;
            $this->horaEntrada = $entrada->horaEntrada;
            $this->ativo = $entrada->ativo;
            $this->valorTotal = $entrada->valorTotal;
            return $this;
        } else {
            return false;
        }
    }

    public function atualizar(){
        $sql = "UPDATE tblRegistro set nome = ?, placa = ?, ativo = ? WHERE id = ?";
        
        $stmt = Model::getConn()->prepare($sql);
        $stmt->bindValue(1, $this->nome);
        $stmt->bindValue(2, $this->placa);
        $stmt->bindValue(3, $this->ativo);
        $stmt->bindValue(4, $this->id);

        return $stmt->execute();
    }

    public function saida(){
        $sql = "UPDATE tblRegistro set ativo = false WHERE id = ?";
        
        $stmt = Model::getConn()->prepare($sql);
        $stmt->bindValue(1, $this->id);

        return $stmt->execute();
    }

    public function delete(){
        $sql = "DELETE FROM tblRegistro WHERE id = ?";
        
        $stmt = Model::getConn()->prepare($sql);
        $stmt->bindValue(1, $this->id);
        return $stmt->execute();
    }
}