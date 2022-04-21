
    // importações
    import {Pessoa, Message, LSConfig, objsConfig} from './classes.js'
    import {isNumber, validarTel, isLetter, validarNome} from './functions.js'

    const key = 'pessoas'

    // criando um obj para mostrar mensagens
    let msg = new Message('area-msgs')

    // formulário principal
    const form = document.getElementById('cadastro')

    // variáveis principais
    const nome = document.getElementById('nome')
    const tel = document.getElementById('telefone')
    const exp = document.getElementsByName('exp')

    // alterando formulário caso seja uma edição de usuário
    let url = new URL(location.href)
    let index = url.searchParams.get('index')

    // verificando se uma query string(index) foi enviada
    if(index){

        // verificando se a chave existe no local storage
        if(localStorage.keyExists(key)){

            let pessoa = localStorage.getObj(key, index)

            // verificando se a pessoa com aquele index foi achado
            if(pessoa){
                nome.value = pessoa.nome
                tel.value = pessoa.tel
                if(pessoa.exp == 'Sim') 
                    exp[0].checked = true
                else 
                    exp[1].checked = true
            }
        }
    }

    // eventos para o campo telefone
    tel.onblur = function(){if(!validarTel(this.value, 1)) this.value = ''}
    
    tel.onkeypress = function(e){
        
        e.preventDefault()

        let tecla = e.key // tecla digitada
        let tamanho = this.value.length // tamanho do campo
        
        // só insere se for número e o campo for menor que 10 caracteres
        if(isNumber(tecla) && tamanho < 15){

            // configurando o auto-preenchimento
            if(tamanho == 0) this.value += `(`
            if(tamanho == 3) this.value += `) 9`
            if(tamanho == 10) this.value += '-'

            // inserindo a tecla
            this.value += tecla
        } 
    }

    // eventos para o campo nome
    nome.onkeydown = function(e){
        let tecla = e.key
        if(!isLetter(tecla)) e.preventDefault()
        
    }

    // validando o copy and paste
    document.onpaste = e => {

        const elemento = e.target

        if(elemento.id == 'telefone'){

            let dado = e.clipboardData.getData('text')
            if(!validarTel(dado, 1)) e.preventDefault()
        }
    }
          
    // validando ao enviar
    form.onsubmit = e => {

        e.preventDefault()

        // criando um objeto pess
        let pessoa = new Pessoa(nome.value, tel.value, exp[0].checked)

        // validando nome
        if(!pessoa.nome){
            msg.erro('O campo "nome" não pode estar vazio')
            return false
        }
        else if(!validarNome(pessoa.nome)){
            msg.erro('Nome inválido!')
            return false
        }
       
        // validando telefone
        if(!pessoa.tel){
            msg.erro('O campo "telefone" não pode estar vazio')
            return false
        }
        else if(!validarTel(pessoa.tel, 1)){
            msg.erro('Número de telefone inválido!')
            return false
        }

        // salvando no local storage
        if(!localStorage.keyExists(key)){
            localStorage.saveObjs(key, pessoa)
            msg.sucesso(`Usuário <b>${pessoa.nome}</b> adicionado com sucesso!`)

        }else{

            // se quiser editar um usuário
            if(index){

                // verificando se a chave existe no local storage
                if(localStorage.keyExists(key)){
                    localStorage.updateObj(key, index, pessoa)
                    msg.sucesso(`Usuário <b>${pessoa.nome}</b> alterado com sucesso!`)
                }

            // caso queira adicionar um usuário
            }else{

                // se o usuário existir
                if(localStorage.objExists(key, pessoa, 'nome')){
                    msg.aviso(`Usuário <b>${pessoa.nome}</b> já existe!`)
                }
                // se usuário não existir
                else{
                    localStorage.insertObjs(key, pessoa)
                    msg.sucesso(`Usuário <b>${pessoa.nome}</b> adicionado com sucesso!`)
                }
                    
            }
            
        }

    }



 
   
