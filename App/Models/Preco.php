<?php

use App\Core\Model;

class Preco{

    public $id;
    public $valorPrimeiraHora;
    public $valorDemaisHoras;

    public function listAll(){
        $sql = "SELECT * from tbl_preco";

        $stmt = Model::getConn()->prepare($sql);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            return $stmt->fetchAll(PDO::FETCH_OBJ);
        } else {
            return [];
        }
    }

    public function inserir(){
        $sql = "INSERT into tbl_preco
                    (valorPrimeiraHora,
                    valorDemaisHoras) 
                        values(?,
                                ?)";

        $stmt = Model::getConn()->prepare($sql);
        $stmt->bindValue(1, $this->valorPrimeiraHora);
        $stmt->bindValue(2, $this->valorDemaisHoras);

        if ($stmt->execute()) {
            $this->id = Model::getConn()->lastInsertId();
            return $this;
        } else {
            return false;
        }
    }

    public function buscarPorId($id){
        $sql = " SELECT * FROM tbl_preco WHERE id = ? ";

        $stmt = Model::getConn()->prepare($sql);
        $stmt->bindValue(1, $id);
        $stmt->execute();
        if ($stmt->rowCount() > 0) {
            $preco = $stmt->fetch(PDO::FETCH_OBJ);
            $this->id = $preco->id;
            $this->valorPrimeiraHora = $preco->valorPrimeiraHora;
            $this->valorDemaisHoras = $preco->valorDemaisHoras;

            return $this;
        } else {
            return false;
        }
    }

    public function atualizar(){
        $sql = "UPDATE tbl_preco set valorPrimeiraHora = ?, valorDemaisHoras = ? WHERE id = ?";
        
        $stmt = Model::getConn()->prepare($sql);
        $stmt->bindValue(1, $this->valorPrimeiraHora);
        $stmt->bindValue(2, $this->valorDemaisHoras);
        $stmt->bindValue(3, $this->id);

        return $stmt->execute();
    }
}

?>