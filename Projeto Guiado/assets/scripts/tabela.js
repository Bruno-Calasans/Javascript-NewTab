

    // cada pessoa da tabela
    class Pessoa{

        constructor(nome='', telefone='', experiencia=false){
            this.nome = nome
            this.tel = telefone
            this.exp = experiencia ? 'Sim': 'Não'
        }

    }

    // funções genéricas
    isArray = dado => dado.constructor == Array
    isObj = dado =>  dado instanceof Object

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
   
   function transformArray(collection){

        let array = []

        if(collection instanceof NodeList || collection instanceof HTMLAllCollection)
            for(let item of collection) array.push(item)
        
        // se for um objeto
        else 
            for(let atrb in collection) array.push(collection[atrb])

       return array
      
   }

   function selector(selector, all=false){

       if(all) return document.querySelectorAll(selector)
       else return document.querySelector(selector)
   }

    class Table{

        constructor(tableId, dados, key) {

            // referente à tabela e aos dados
            this.elemento = getElemento(tableId)
            this.dados = dados // array de dados
            this.tableId = tableId // ID da tabela
            this.key = key // key na local storage

            // head da tabela
            this.head = {
                id: selector(`#${tableId} thead`).id, 
                elemento: selector(`#${tableId} thead`),
                linha: selector(`#${tableId} thead tr`),
                celulas: selector(`#${tableId} thead th`, true)
            }

            // body da tabela
            this.body = {
                id: selector(`#${tableId} tbody`).id, 
                elemento: selector(`#${tableId} tbody`),
                celulas: selector(`#${tableId} tbody td`, true),
                linhas: {
                    elementos: transformArray(selector(`#${tableId} tbody tr`, true)),
                    classe: selector(`#${tableId} tbody tr`) ? selector(`#${tableId} tbody tr`).className : '',
                }
            }

            // configurações iniciais da tabela
            this.inserirLinhas('table-row', this.dados)
        }

        // getters e setters
        get numLinhas(){return this.body.elemento.children.length}
        get numColunas(){return this.head.linha.children.length}

        // atualiza os dados da tabela
        atualizarDados(){this.dados = localStorage.getObjs(this.key)}

        inserirDado(novoDado){

            if(!localStorage.keyExists(this.key))
                localStorage.saveObjs(this.key, novoDado)

            else 
                localStorage.insertObjs(this.key, novoDado)
        
            this.atualizarDados()
        }

        // remove uma linha pra sempre
        removerLinha(index){

            // se tiver o index
            if(index <= this.numLinhas - 1){

                this.body.linhas.elementos[index].remove()

                // atualizando o array de linhas
                this.body.linhas.elementos.splice(index, 1) 

                //atualizando os dados e o localStorage
                localStorage.removeObj(this.key, index)
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
                localStorage.clear()
                this.atualizar()

                // caso tenha limpado com sucesso
                return true
            }
            // caso não tenha linhas
            else return false
        }

        // atualiza o head da tabela
        atualizarHead(){

            this.head = {
                id: selector(`#${this.tableId} thead`).id, 
                elemento: selector(`#${this.tableId} thead`),
                linha: selector(`#${this.tableId} thead tr`),
                celulas: selector(`#${this.tableId} thead th`, true)
            }

        }

        // atualizado  body da tabela
        atualizarBody(){

            this.body = {
                id: selector(`#${this.tableId} tbody`).id, 
                elemento: selector(`#${this.tableId} tbody`),
                celulas: selector(`#${this.tableId} tbody td`, true),
                linhas: {
                    elementos: transformArray(selector(`#${this.tableId} tbody tr`, true)),
                    classe: selector(`#${this.tableId} tbody tr`) ? selector(`#${this.tableId} tbody tr`).className : ''
                }
            }

        }

        atualizarLinhas(){
            this.inserirLinhas('table-row', this.dados)
            this.atualizar()
        }

        atualizar(){

            // atualizando o head
            this.atualizarHead()
           
            // atualizando body
            this.atualizarBody()

            // atualizando dados
            this.atualizarDados()
        }

        // cria uma linha
        criarLinha(classeId, dados){

            // dados pode ser um array ou objeto
            dados = isObj(dados) ? transformArray(dados) : dados
            
            // o número de dados tem que ser igual ao número de colunas
            const linha = criarElemento('tr', classeId)

            for(let dado of dados){

                let td = criarElemento('td')
                td.innerHTML = dado
                linha.appendChild(td)
            }

            // criando o botão
            const btn = criarElemento('button', 'btnAlterar')
            const td = criarElemento('td')
            btn.innerHTML = 'Alterar'
            td.appendChild(btn)
            linha.appendChild(td)

            return linha
        }

        // cria várias linhas
        criarLinhas(classeId, ...dados){

            let linhas = []

            if(dados.length == 1) dados = dados[0]

            for(let dado of dados){
                let linha = this.criarLinha(classeId, dado)
                linhas.push(linha)
            }

            return linhas
        }

        // insere uma linha na tabela
        inserirLinha(linha, classeId){

            // se não for um elemento HTML
            if(!(linha instanceof HTMLElement)){

                if(isObj(linha)) this.inserirDado(linha)

                classeId = classeId ?? 'table-row'
                let novaLinha = this.criarLinha(classeId, linha)
                this.body.elemento.appendChild(novaLinha)

            // se for um elemento HTML
            }else{
                this.body.elemento.appendChild(linha)
            }

            // atualizando o body
            this.atualizarBody()
        }

        // insere várias linhas na tabela
        inserirLinhas(classeId, ...dados){

            if(dados.length == 1 && isArray(dados[0])) dados = dados[0]

            // se for um objeto
            dados.forEach(dado => {if(isObj(dado)) this.inserirDado(dado)})
            
            let linhas = this.criarLinhas(classeId, dados)
            
            linhas.forEach(linha => this.inserirLinha(linha))
        }

        getLinha(index){

            // verificando se oi index existe
            if(index > this.numLinhas - 1) return null
            let linha = this.body.linhas.elementos[index]
            return linha
        }

        alterarLinha(index, novosDados){

            // novosDados pode ser um array ou objeto

            // pegando a linha
            let linha = this.getLinha(index)
            if(!linha) return null // verificando se a linha existe

            let dados = novosDados

            // caso seja um objeto, será transformado em array
            if(isObj(novosDados)){
                dados = transformArray(novosDados)
                localStorage.updateObj(this.key, index, novosDados)
            }
           
            // pegando todos os tds(table datas) da linha em forma de array
            let tds = transformArray(linha.children)

            // cada elemento de tds será um table data da linha
            for(let i = 0; i < dados.length; i++) tds[i].innerHTML = dados[i]
        }

    }

    // criando métodos para Local Storage --------------------------------------

    // converte um objeto para string
    objToString = obj => JSON.stringify(obj)
    
    // salva um objeto na Local Storage
    Storage.prototype.saveObj = function (key, obj){

        let json = objToString([obj])
        this.setItem(key, json)
    }

    // salva vários objetos na local storage em forma de array
    Storage.prototype.saveObjs = function(key, ...objs){

        if(objs.length == 1 && isArray(objs[0])) objs = objs[0]

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
        if(index > objs.lenght - 1) return null

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
    const p1 = new Pessoa('Fudido Fudência', '12314124')
    const p2 = new Pessoa('Ana Aloprada', '11321314', true)
    const p3 = new Pessoa('Clemência Lopes', '4324325', true)
    const p4 = new Pessoa('Eclesiástico Elástico', '44694896')


    // lista com todas as pessoas
    if(localStorage.pessoas)
        var pessoas = localStorage.getObjs('pessoas')
    else 
        var pessoas = []

    // criando uma tabela
    const table = new Table('lista', pessoas, 'pessoas')
   
