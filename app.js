class Expenses {
    constructor(ano, mes, dia, tipo, descricao, valor) {
        this.ano = ano
        this.mes = mes
        this.dia = dia
        this.tipo = tipo
        this.descricao = descricao
        this.valor = valor
    }
    validateData(){
        for(let i in this)
            if(this[i] === undefined || this[i] === '' || this[i] === null){
                return false
            }
        return true
    }
}

class Bd {
    constructor(){
        let id = localStorage.getItem('id')
        if(id === null){
            localStorage.setItem('id', 0)
        }
    }
    getNextId(){
        let nexId = localStorage.getItem('id')
        return parseInt(nexId) + 1
    }
    record(e){
        let id = this.getNextId()
        localStorage.setItem(id, JSON.stringify(e))
        localStorage.setItem('id', id)
    }
    recoverAll(){
        let expenses = []
        let id = localStorage.getItem('id')
        for(let i = 1; i <= id; i++){
            let expense = JSON.parse(localStorage.getItem(i))
            if(expense !== null){
                expense.id = i
                expenses.push(expense)
            }  
        }
        return expenses
    }

    remove(id){
        localStorage.removeItem(id)
    }

    search(expense){
        let filteredExpenses = []
        filteredExpenses = this.recoverAll()

        if(expense.ano != ''){
            filteredExpenses = filteredExpenses.filter(d => d.ano == expense.ano)
        }
        if(expense.mes != ''){
            filteredExpenses = filteredExpenses.filter(d => d.mes == expense.mes)
        }
        if(expense.dia != ''){
            filteredExpenses = filteredExpenses.filter(d => d.dia == expense.dia)
        }
        if(expense.tipo != ''){
            filteredExpenses = filteredExpenses.filter(d => d.tipo == expense.tipo)
        }
        if(expense.descricao != ''){
            filteredExpenses = filteredExpenses.filter(d => d.descricao == expense.descricao)
        }
        if(expense.valor != ''){
            filteredExpenses = filteredExpenses.filter(d => d.valor == expense.valor)
        }
        return filteredExpenses
    }
}

let bd = new Bd()

function loadExpenses(expenses = [], filter = false){
    if(expenses.length == 0 && filter == false){
        expenses = bd.recoverAll()
    }
    let expensesList = document.querySelector('#expensesList')
    expensesList.innerHTML = ''
    expenses.forEach(d => {
        let row = expensesList.insertRow()
        switch(d.tipo){
            case '1': d.tipo = 'alimentação'
                break
            case '2': d.tipo = 'educação'
                break
            case '3': d.tipo = 'lazer'
                break
            case '4': d.tipo = 'saúde'
                break
            case '5': d.tipo = 'transporte'
                break
        }

        row.insertCell(0).innerHTML =  `${d.dia}/${d.mes}/${d.ano}`
        row.insertCell(1).innerHTML = d.tipo
        row.insertCell(2).innerHTML = d.descricao
        row.insertCell(3).innerHTML = d.valor

        let btn = document.createElement('button')
        btn.className = 'btn btn-danger float-right'
        btn.innerHTML = '<i class="fas fa-times"></i>'
        btn.id = `expense_id_${d.id}`
        btn.onclick = function(){
            let id = this.id.replace('expense_id_', '')
            modals.modalRecorded()
            $('#modalRegisterExpense').modal('show')
            const deleteBtn = document.querySelector('#deleteBtn')
            deleteBtn.addEventListener('click', () => {
                bd.remove(id)
                window.location.reload()
            })
        }
        row.insertCell(4).appendChild(btn)
    })
}

class Modals{
    modalError(){
        document.querySelector('#exampleModalLabel').innerHTML = 'Error'
        document.querySelector('.modal-body').innerHTML = 'One or more spaces are blank, fill it!'
        document.querySelector('.modal-header').className = 'modal-header text-danger'
        document.querySelector('#closeBtn').className ='btn btn-danger' 
    }
    modalSuccess(){
        document.querySelector('#exampleModalLabel').innerHTML = 'Done'
        document.querySelector('.modal-body').innerHTML = 'Everything was successfuly recorded!'
        document.querySelector('.modal-header').className = 'modal-header text-success'
        document.querySelector('#closeBtn').className ='btn btn-success' 
    }
    modalRecorded(){
        document.querySelector('#exampleModalLabel').innerHTML = 'Alert!'
        document.querySelector('.modal-body').innerHTML = 'Do you want to delete it?'
        document.querySelector('.modal-header').className = 'modal-header text-danger'
    }
}

let modals = new Modals

function recordExpenses(){
    let ano = document.querySelector('#ano')
    let mes = document.querySelector('#mes')
    let dia = document.querySelector('#dia')
    let tipo = document.querySelector('#tipo')
    let descricao = document.querySelector('#descricao')
    let valor = document.querySelector('#valor')

    let expense = new Expenses(ano.value, 
        mes.value, 
        dia.value, 
        tipo.value, 
        descricao.value, 
        valor.value)
    
    function cleanFields(){
        ano.value = ''
        mes.value = ''
        dia.value = ''
        tipo.value = ''
        descricao.value = ''
        valor.value = ''
    }

    if(expense.validateData()){
        bd.record(expense)
        cleanFields()
        modals.modalSuccess()
        $('#modalRegisterExpense').modal('show')
    } else {
        modals.modalError()
        $('#modalRegisterExpense').modal('show')
    }
}

function searchExpense(){
    let ano = document.querySelector('#ano').value
    let mes = document.querySelector('#mes').value
    let dia = document.querySelector('#dia').value
    let tipo = document.querySelector('#tipo').value
    let descricao = document.querySelector('#descricao').value
    let valor = document.querySelector('#valor').value

    let expense = new Expenses(ano, mes, dia, tipo, descricao, valor)

    let expenses = bd.search(expense)
    loadExpenses(expenses, true)
}
