'use strict'

const readDB = () => JSON.parse(localStorage.getItem('db')) ?? []
const setDB = (db) => localStorage.setItem('db', JSON.stringify(db))
const readDBPrice = () => JSON.parse(localStorage.getItem('bankPrice')) ?? []
const setDBPrice = (bankPrice) => localStorage.setItem('bankPrice', JSON.stringify(bankPrice))


const insertDB = (client) => {
    const db = readDB()
    db.push(client)
    setDB(db)
}

const insertDBPrice = (registrationPrice) => {
    const bankPrice = readDBPrice()
    bankPrice.push(registrationPrice)
    setDBPrice(bankPrice)
}

const updateClient = (client, index) => {
    const db = readDB()
    db[index] = client
    setDB(db)
}


const clearTable = () => {
    const recordClient = document.querySelector('#tabelaClientes tbody')
    while (recordClient.firstChild) {
        recordClient.removeChild(recordClient.lastChild)
    }
}

const openModal = () => document.querySelector('#modal')
    .classList.add('active')

const closeModal = () => document.querySelector('#modal')
    .classList.remove('active')

const openModalExit = () => document.querySelector('#modal-saida')
    .classList.add('active')

const closeModalExit = () => document.querySelector('#modal-saida')
    .classList.remove('active')


const date = () => {
    let date = new Date()
    let morning = String(date.getDate()).padStart(2, '0')
    let month = String(date.getMonth() + 1).padStart(2, '0')
    let year = date.getFullYear()
    let currentDate = morning + '/' + month + '/' + year;
    return currentDate
}

const hour = () => {
    let today = new Date()
    let hours = ('00' + today.getHours()).slice(-2)
    let minutes = ('00' + today.getMinutes()).slice(-2)
    let currentTime = (hours) + ":" + minutes
    return currentTime
}

const createRow = (client, index) => {
    const recordClient = document.querySelector('#tabelaClientes tbody')
    const newTr = document.createElement('tr')
    newTr.innerHTML = `
        <td>${client.nome}</td>
        <td>${client.placa}</td>
        <td>${client.dataEntrada}</td>
        <td>${client.horaEntrada}</td>
        <td>
            <button type='button' class='button blue' data-action="deletar-${index}">Deletar</button>
            <button type='button' class='button blue' data-action="editar-${index}">Editar</button>
            <button type='button' class='button red' data-action="saida-${index}" >Saida</button>
        </td>
    `
    recordClient.appendChild(newTr)
}

const updateTable = () => {
    clearTable()
    const db = readDB()
    db.forEach(createRow)
}

const clearInput = () => {
    document.querySelector('#nome').value = ''
    document.querySelector('#placa').value = ''
}

const isValidForm = () => document.querySelector('.form').reportValidity()

const saveClient = () => {
    if (isValidForm()) {

        const newClient = {
            nome: document.querySelector('#nome').value,
            placa: document.querySelector('#placa').value,
            horaEntrada: hour(),
            dataEntrada: date(),
        }

        const index = document.querySelector('#nome').dataset.index

        if (index == '') {
            insertDB(newClient)
        } else {
            updateClient(newClient, index)
        }

        clearInput()
        alert("Salvo com sucesso!")
        updateTable()
        location.reload();

    }
}

const isValidFormPrice = () => document.querySelector('.form-modal').reportValidity()

const savePrice = () => {
    const dbPrice = readDBPrice()

    if (isValidFormPrice()) {

        const price = {
            umaHora: document.querySelector('#umaHora').value,
            demaisHoras: document.querySelector('#demaisHoras').value
        }

        if (dbPrice == '') {
            insertDBPrice(price)
        } else {
            dbPrice[0] = price
            setDBPrice(dbPrice)
        }
        closeModal()

    }
}

const deleteClient = (index) => {
    const db = readDB()
    const resp = confirm(`Deseja realmente deletar ${db[index].nome}?`)

    if (resp) {
        db.splice(index, 1)
        setDB(db)
        updateTable()
    }
}

const editClient = (index) => {
    const db = readDB()
    document.querySelector('#nome').value = db[index].nome
    document.querySelector('#placa').value = db[index].placa
    document.querySelector('#nome').dataset.index = index
}

const exitClient = (index) => {
    openModalExit()
    const db = readDB()
    const dbPrice = readDBPrice()

    document.querySelector('#nomeSaida').dataset.index = index

    document.querySelector('#nomeSaida').value = db[index].nome
    document.querySelector('#placaSaida').value = db[index].placa
    document.querySelector('#dataEntrada').value = db[index].dataEntrada
    document.querySelector('#horaEntrada').value = db[index].horaEntrada
    document.querySelector('#dataSaida').value = date()
    document.querySelector('#horaSaida').value = hour()
    document.querySelector('#valorTotal').value = dbPrice[0].umaHora
}

const showModalPrice = () => {
    const dbPrice = readDBPrice()
    document.querySelector('#umaHora').value = dbPrice[0].umaHora
    document.querySelector('#demaisHoras').value = dbPrice[0].demaisHoras
}

const actionButttons = (event) => {
    const element = event.target
    if (element.type === 'button') {
        const action = element.dataset.action.split('-')
        if (action[0] === 'deletar') {
            deleteClient(action[1])
        } else if (action[0] === 'editar') {
            editClient(action[1])
        } else {
            exitClient(action[1])
        }
    }
}

const clientPago = () => {
    const db = readDB()
    const index = document.querySelector('#nomeSaida').dataset.index
    const resp = confirm('O cliente realizou o pagamento?')
    if (resp) {
        db.splice(index, 1)
        setDB(db)
        updateTable()
        closeModalExit()
    }
}


const applyNumericMask = (number) => {
    number = number.replace(/\D/g, "")
    number = number.replace(/(\d{1})(\d{5})$/, "$1.$2")
    number = number.replace(/(\d{1})(\d{1,2})$/, "$1,$2")
    return number
}

const applyCarMask = (carPlate) => {
    carPlate = carPlate.replace(/[^a-zA-Z0-9]/, "")
    carPlate = carPlate.replace(/(.{3})(.)/, "$1-$2");
    return carPlate
}

const applyMask = (event) => {
    event.target.value = applyNumericMask(event.target.value)
}

const applyMaskCar = (event) => {
    event.target.value = applyCarMask(event.target.value)
}


document.querySelector('#closeSaida')
    .addEventListener('click', closeModalExit)

document.querySelector('#btnCancelarSaida')
    .addEventListener('click', closeModalExit)

document.querySelector('#precos')
    .addEventListener('click', () => { openModal(); showModalPrice() })

document.querySelector('#cancelar')
    .addEventListener('click', closeModal)

document.querySelector('#close')
    .addEventListener('click', closeModal)

document.querySelector('#btnSalvarPreco')
    .addEventListener('click', savePrice)

document.querySelector('#btnPago')
    .addEventListener('click', clientPago)

document.querySelector('#close')
    .addEventListener('click', () => { closeModal(); clearInput() })

document.querySelector('#salvar')
    .addEventListener('click', saveClient)

document.querySelector('#tabelaClientes')
    .addEventListener('click', actionButttons)

document.querySelector('#placa')
    .addEventListener('keyup', applyMaskCar)

document.querySelector('#umaHora')
    .addEventListener('keyup', applyMask)

document.querySelector('#demaisHoras')
    .addEventListener('keyup', applyMask)

document.querySelector('#btnComprovante')
    .addEventListener('click', () => { window.print() })

updateTable()