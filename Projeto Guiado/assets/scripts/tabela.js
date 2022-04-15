
    
    // cada pessoa da tabela
    class Pessoa{

        constructor(nome='', telefone='', experiencia=false){
            this.nome = nome
            this.tel = telefone
            this.exp = experiencia ? 'Sim': 'Não'
        }

    }

    // funções genéricas de verificação
    isArray = dado => dado instanceof Array
    isObj = dado => dado instanceof Object
    isHTML = dado => dado instanceof HTMLElement


    // cria um elemento HTML com a classe desejada
    function criarElemento(tag, classeId, usarId=false){

        const elemento = document.createElement(tag)

        if(classeId && !usarId) elemento.className = classeId 
        else if(classeId) elemento.id = classeId 
        else return elemento

        return elemento
    }

    // pega qualquer elemento HTML por classe ou id
    function getElemento(classeId, usarId=true){

        if(usarId) return document.getElementById(classeId)
        else return document.getElementsByClassName(classeId)
    }

    // selciona qualquer elemento a partir do query selector
    function selector(selector, all=false, useId=true){

        let simb = useId ? '#' : '.'
        if(all) return document.querySelectorAll(`${simb}${selector}`)
        else return document.querySelector(`${simb}${selector}`)
    }
 
    // transforma qualquer objeto para array
    Object.prototype.toArray = function(){return Object.values(this)}

    class Table{

        constructor(tableId, dados, key) {

            // referente à tabela e aos dados
            this.elemento = getElemento(tableId)
            this.dados = dados // array de dados
            this.tableId = tableId // ID da tabela
            this.key = key // key na local storage

            // head da tabela
            this.head = {
                id: selector(`${tableId} thead`).id, 
                elemento: selector(`${tableId} thead`),
                linha: selector(`${tableId} thead tr`),
                celulas: selector(`${tableId} thead th`, true)
            }

            // body da tabela
            this.body = {
                id: selector(`${tableId} tbody`).id, 
                elemento: selector(`${tableId} tbody`),
                celulas: selector(`${tableId} tbody td`, true),
                linhas: {
                    elementos: (selector(`${tableId} tbody tr`, true)).toArray(),
                    classe: selector(`${tableId} tbody tr`) ? selector(`${tableId} tbody tr`).className : '',
                }
            }

            // configurações iniciais da tabela
            //this.inserirLinhas('table-row', this.dados)
            // configuração inicial do local storage
            localStorage.clear()
            this.inserirLinhas('table-row', this.dados)
        }

        // getters e setters
        get numLinhas(){return this.body.elemento.children.length}
        get numColunas(){return this.head.linha.children.length}

        // métodos de atualização
        atualizarHead(){

            this.head = {
                id: selector(`${this.tableId} thead`).id, 
                elemento: selector(`${this.tableId} thead`),
                linha: selector(`${this.tableId} thead tr`),
                celulas: selector(`${this.tableId} thead th`, true)
            }
        }

        atualizarBody(){

            this.body = {
                id: selector(`${this.tableId} tbody`).id, 
                elemento: selector(`${this.tableId} tbody`),
                celulas: selector(`${this.tableId} tbody td`, true),
                linhas: {
                    elementos: (selector(`${this.tableId} tbody tr`, true)).toArray(),
                    classe: selector(`${this.tableId} tbody tr`) ? selector(`${this.tableId} tbody tr`).className : ''
                }
            }

            this.atualizarBtns()
        }

        atualizarBtns(){

            // para os botões de excluir
            let btnsExcluir = selector('btnExcluir', true, false)

            btnsExcluir.forEach((btn, index) => {
                btn.onclick = e => this.removerLinha(index)
            })

        }

        atualizarDados(){this.dados = localStorage.getObjs(this.key)}

        // atualiza toda a tabela
        atualizar(){

            this.atualizarHead()
            this.atualizarBody()
            this.atualizarDados()
        }

        // insere dado no local storage
        inserirDado(obj){

            // verificando se é um objeto
            if(!isObj(obj)) return false

            // caso não exista uma chave no local storage
            if(!localStorage.keyExists(this.key))
                localStorage.saveObjs(this.key, obj)

            else
                localStorage.insertObjs(this.key, obj)
        
            this.atualizarDados()
            this.atualizarBody()
        }

        // remove uma linha pra sempre
        removerLinha(index){

            // se tiver o index
            if(index <= this.numLinhas - 1){

                // removendo elemento do DOM
                this.body.linhas.elementos[index].remove()

                // atualizando o array de linhas
                this.body.linhas.elementos.splice(index, 1) 

                //atualizando os dados e o localStorage
                localStorage.removeObj(this.key, index)

                // verificando se há objeto para deletar
                //console.log(localStorage.getObjs(this.key));

                this.atualizarBody()

                return true
            }

            // caso não encontre ou não exista
            return false
        }

        // remove todas as linhas da tbela e o local storage
        limpar(){

            // caso tenha linhas para limpar
            if(this.numLinhas > 0){
                while (this.numLinhas) this.removerLinha(0)

                // atualizando a tabela toda
                this.atualizar()

                // limpando o local storage
                localStorage.clear()

                // caso tenha limpado com sucesso
                return true
            }
            // caso não tenha linhas
            else return false
        }

        // cria uma elemento tr(table row) com um objeto
        criarLinha(classeId, obj){

            // verificando se um objeto foi passado
            if(!isObj(obj)) return false

            // transformando o objeto em arrays
            let dados = obj.toArray()
            
            // o número de dados tem que ser igual ao número de colunas
            const linha = criarElemento('tr', classeId)

            for(let dado of dados){

                let td = criarElemento('td')
                td.innerHTML = dado
                linha.appendChild(td)
            }

            // criando os botões
            const btnExcluir = criarElemento('button', 'btnExcluir')
            btnExcluir.innerHTML = 'Excluir'
            const btnAlterar = criarElemento('button', 'btnAlterar')
            btnAlterar.innerHTML = 'Alterar'

            const td = criarElemento('td')
            td.appendChild(btnExcluir)
            td.appendChild(btnAlterar)

            linha.appendChild(td)

            return linha
        }

        // cria várias linhas
        criarLinhas(classeId, ...objs){

            // se tiver apenas um elemento e for um array de objetos
            if(objs.length == 1 && isArray(dados[0])) objs = objs[0]

            let linhas = []

            for(let obj of objs){
                let linha = this.criarLinha(classeId, obj)
                linhas.push(linha)
            }

            return linhas
        }

        // insere uma linha na tabela
        inserirLinha(classeId, obj){

            // verificando se é um objeto
            if(!isObj(obj)) return false

            // criando um elemento tr(table row) e inserindo no body da tabela
            let linha = this.criarLinha(classeId, obj)
            this.body.elemento.appendChild(linha)

            // inserindo o dado no local storage
            this.inserirDado(obj)
        
            // atualizando o body
            this.atualizarBody()
        }

        // insere várias linhas na tabela
        inserirLinhas(classeId, ...objs){

            if(objs.length == 1 && isArray(objs[0])) objs = objs[0]

            // inserindo os objetos na tabela
            objs.forEach(obj => this.inserirLinha(classeId, obj))
        }

        getLinha(index){

            // verificando se o index existe
            if(index > this.numLinhas - 1) return null

            let linha = this.body.linhas.elementos[index]
            return linha
        }

        alterarLinha(index, obj){

            // novosDados pode ser um array ou objeto

            // pegando a linha
            let linha = this.getLinha(index)
            if(!linha) return null // verificando se a linha existe

            // verificando se é um objeto
            if(!isObj(obj)) return false

            // atualizando o objeto no local storage
            localStorage.updateObj(this.key, index, obj)

            // transformando o objeto em array
            let dados = obj.toArray()
            
            // pegando todos os tds(table datas) da linha em forma de array
            let tds = linha.children.toArray()

            // cada elemento de tds será um table data da linha
            for(let i = 0; i < dados.length; i++) tds[i].innerHTML = dados[i]
        }

    }

    // criando métodos para Local Storage --------------------------------------

    // converte um objeto para string
    function objToString(obj){return JSON.stringify(obj)}
    
    // salva um objeto na Local Storage
    Storage.prototype.saveObj = function (key, obj){

        let json = objToString([obj])
        this.setItem(key, json)
    }

    // salva vários objetos na local storage em forma de array
    Storage.prototype.saveObjs = function(key, ...objs){

        if(objs.length == 1 && isArray(objs[0]))objs = objs[0]
        let array = JSON.stringify(objs)
        this.setItem(key, array)
    }

    // pega todos os objetos da local storage de uma determinada key
    Storage.prototype.getObjs = function (key){

        // verificando se algum valor para essa chave
        let strObjArray = this.getItem(key)
        if(!strObjArray) return null

        // transformando cada string obj em array
        let objArray = JSON.parse(strObjArray)
        return objArray
    }

    Storage.prototype.keyExists = function (key){
        return this.getItem(key) ? true : false
    }

    // pega um obj a partir da sua chave e index no array de objetos
    Storage.prototype.getObj = function (key, index){

        // verificando se há alguma item com a key fornecida
        if(!this.keyExists(key)) return null

        let objs = this.getObjs(key) // array de objs

        // verificando se há algum número com este index no array
        if(index > objs.length - 1) return null

        return objs[index]
    }

    // atualizando array de objs
    Storage.prototype.insertObjs = function (key, ...objs){

        if(objs.length == 1 && isArray(objs[0])) objs = objs[0]

        // verificando se a key existe
        if(!this.keyExists(key)) return null

        let arrayObjs = this.getObjs(key)
        let novoArray = [...arrayObjs, ...objs]
        this.saveObjs(key, novoArray)
    }

    // remove um objeto do local storage
    Storage.prototype.removeObj = function(key, index){

        // verificando se a chave existe
        if(!this.keyExists(key)) return null

        let objs = this.getObjs(key)

        // verificando se o index existe
        if(index > objs.lenght - 1) return false

        objs.splice(index, 1)
        this.saveObjs(key, objs)
    }

    // altera um objeto
    Storage.prototype.updateObj = function (key, index, novoObj){

        // verificando se a chave existe
       if(!this.keyExists(key)) return null

       let objProcurado = this.getObj(key, index)

       // verificando se o objeto com aquele index existe
       if(!objProcurado) return null
       let objs = this.getObjs(key)
    
       objs.splice(index, 1, novoObj)
      
       this.saveObjs(key, ...objs)
    }

    // testes
    /*const p1 = new Pessoa('Fudido Fudência', '12314124')
    const p2 = new Pessoa('Ana Aloprada', '11321314', true)
    const p3 = new Pessoa('Clemência Lopes', '4324325', true)
    const p4 = new Pessoa('Eclesiástico Elástico', '44694896')*/

    
    // lista com todas as pessoas
    if(localStorage.pessoas)
        var pessoas = localStorage.getObjs('pessoas')
    else 
        var pessoas = []

    // criando uma tabela
    const table = new Table('lista', pessoas, 'pessoas')

