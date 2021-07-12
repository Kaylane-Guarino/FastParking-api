'use strict'

const openModal = () => document.querySelector('#modal')
    .classList.add('active')

const closeModal = () => document.querySelector('#modal')
    .classList.remove('active')

const openModalEntrada = () => document.querySelector('#modal-entrada')
    .classList.add('active')

const closeModalEntrada = () => document.querySelector('#modal-entrada')
    .classList.remove('active')

const openModalExit = () => document.querySelector('#modal-saida')
    .classList.add('active')

const closeModalExit = () => document.querySelector('#modal-saida')
    .classList.remove('active')


const getPrice = async (url) => {
    const response = await fetch(url)
    const json = await response.json()
    return await json
}

const setPrice = async (newPrice) => {
    const url = 'http://apilocal.fastparking.com.br/precos'
    const options = {
        method: 'POST',
        body: JSON.stringify(newPrice)
    }
    await fetch(url, options)
}

const updatePrice = async (newPrice) => {
    const url = 'http://apilocal.fastparking.com.br/precos/1'
    const options = {
        method: 'PUT',
        body: JSON.stringify(newPrice)
    }
    await fetch(url, options)
}

const isValidFormPrice = () => document.querySelector('.form-modal').reportValidity()

const savePrice = async () => {
    if (isValidFormPrice) {
        const newPrice = {
            "valorPrimeiraHora": document.querySelector('#umaHora').value.replace(",", "."),
            "valorDemaisHoras": document.querySelector('#demaisHoras').value.replace(",", ".")
        }
        if (await getPrice('http://apilocal.fastparking.com.br/precos') == undefined) {
            setPrice(newPrice)
        } else {
            updatePrice(newPrice)
        }
        closeModal()
    }
}

const getClient = async (url) => {
    const response = await fetch(url)
    const json = await response.json()
    return await json
}

const getSaidas = async (url) => {
    const response = await fetch(url)
    const json = await response.json()
    return await json
}

const updateTable = async () => {
    clearTable()
    const client = await getClient('http://apilocal.fastparking.com.br/clientes')
    client.forEach(createRow)
}

const clearInput = () => {
    document.querySelector('#nome').value = ''
    document.querySelector('#placa').value = ''
}

const clearTable = () => {
    const recordClient = document.querySelector('#tabelaClientes tbody')
    while (recordClient.firstChild) {
        recordClient.removeChild(recordClient.lastChild)
    }
}

const createRow = async (client) => {
    const recordClient = document.querySelector('#tabelaClientes tbody')
    const newTr = document.createElement('tr')
    const data = client.dataEntrada
    const dataFormatada = data.split("-").reverse().join('/')
    const statusClient = await client.ativo

    if (statusClient == 1) {
        newTr.innerHTML = `
        <td>${client.nome}</td>
        <td>${client.placa}</td>
        <td>${dataFormatada}</td>
        <td>${client.horaEntrada}</td>
        <td>
            <button type='button' class='button green' data-action="comp-${client.id}">Comprovante</button>
            <button type='button' class='button blue' data-action="editar-${client.id}">Editar</button>
            <button type='button' class='button red' data-action="saida-${client.id}" >Saida</button>
        </td>
    `
        recordClient.appendChild(newTr)
    }


}

const setClient = async (newClient) => {
    const url = 'http://apilocal.fastparking.com.br/clientes'
    const options = {
        method: 'POST',
        body: JSON.stringify(newClient)
    }
    console.log(newClient)
    await fetch(url, options)
}

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
    let seconds = today.getSeconds()
    let currentTime = (hours) + ":" + minutes + ":" + seconds
    return currentTime
}

const isValidForm = () => document.querySelector('.form').reportValidity()

const saveClient = async () => {
    if (isValidForm()) {

        const newClient = {
            nome: document.querySelector('#nome').value,
            placa: document.querySelector('#placa').value,
            ativo: true
        }

        const index = document.querySelector('#nome').dataset.index

        if (index == '') {
            await setClient(newClient)
            alert("Salvo com sucesso!")
        } else {
            updateClient(newClient, index)
            alert("Editado com sucesso!")
        }

        clearInput()
        updateTable()
        location.reload();

    }
}

const updateSaidas = async (id) => {
    const url = `http://apilocal.fastparking.com.br/saidas/${id}`
    const options = {
        method: 'PUT',
        body: []
    }
    console.log("Update Saida")
    await fetch(url, options)
    compExitClient(id)
}

const compClient = async (index) => {
    openModalEntrada()
    const client = await getClient(`http://apilocal.fastparking.com.br/clientes/${index}`)
    const data = client.dataEntrada
    const dataFormatada = data.split("-").reverse().join('/')

    document.querySelector('#nomeEntrada').dataset.index = index

    document.querySelector('#nomeEntrada').value = await client.nome
    document.querySelector('#placaEntrada').value = await client.placa
    document.querySelector('#dataEntrada').value = await dataFormatada
    document.querySelector('#horaEntrada').value = await client.horaEntrada
}

const compExitClient = async (index) => {
    openModalExit()
    const client = await getClient(`http://apilocal.fastparking.com.br/clientes/${index}`)
    const data = client.dataEntrada
    const dataFormatada = data.split("-").reverse().join('/')

    document.querySelector('#nomeSaida').dataset.index = index

    document.querySelector('#nomeSaida').value = await client.nome
    document.querySelector('#placaSaida').value = await client.placa
    document.querySelector('#dataEnter').value = await dataFormatada
    document.querySelector('#horaEnter').value = await client.horaEntrada
    document.querySelector('#dataSaida').value = date()
    document.querySelector('#horaSaida').value = hour()
    document.querySelector('#valorTotal').value = await client.valorTotal
}

const clientPago = async (id) => {
    const client = await getClient(`http://apilocal.fastparking.com.br/clientes/${id}`)
    const index = document.querySelector('#nomeSaida').dataset.index
    const resp = confirm('O cliente realizou o pagamento?')

    if (resp) {
        const editStatus = {
            "ativo": false
        }
        const url = `http://apilocal.fastparking.com.br/clientes/${client.id}`
        const options = {
            method: 'PATCH',
            body: JSON.stringify(editStatus)
        }
        await fetch(url, options)
        console.log(client.valorTotal)
        updateTable()
        compExitClient(id)
        closeModalExit()
    }
}

const updateClient = async (newClient, id) => {
    const client = await getClient(`http://apilocal.fastparking.com.br/clientes/${id}`)
    const url = `http://apilocal.fastparking.com.br/clientes/${client.id}`
    const options = {
        method: 'PUT',
        body: JSON.stringify(newClient)
    }
    await fetch(url, options)
}

const editClient = async (id) => {
    const client = await getClient(`http://apilocal.fastparking.com.br/clientes/${id}`)
    document.querySelector('#nome').value = client.nome
    document.querySelector('#placa').value = client.placa
    document.querySelector('#nome').dataset.index = id
}

const actionButttons = (event) => {
    const element = event.target
    if (element.type === 'button') {
        const action = element.dataset.action.split('-')
        if (action[0] === 'comp') {
            compClient(action[1])
        } else if (action[0] === 'editar') {
            editClient(action[1])
        } else {
            updateSaidas(action[1])
        }
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
    .addEventListener('click', () => {
        openModal()
    })

document.querySelector('#btnCancelarComp')
    .addEventListener('click', closeModalEntrada)

document.querySelector('#closeEntrada')
    .addEventListener('click', closeModalEntrada)

document.querySelector('#cancelar')
.addEventListener('click', closeModal)

document.querySelector('#close')
.addEventListener('click', closeModal)

document.querySelector('#btnSalvarPreco')
    .addEventListener('click', savePrice)

document.querySelector('#btnPago')
    .addEventListener('click', clientPago)

document.querySelector('#close')
    .addEventListener('click', () => {
        closeModal();
        clearInput()
    })

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
    .addEventListener('click', () => {
        window.print()
    })


updateTable()