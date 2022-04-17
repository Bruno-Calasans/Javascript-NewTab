
    // importações
    import {Pessoa, Message, LSConfig, objsConfig} from './classes.js'
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

    // verificando se um index foi enviado
    if(index){

        // verificando se a chave existe no local storage
        if(localStorage.keyExists(key)){

            let pessoa = localStorage.getObj(key, index)

            // verificando se a pessoa com aquele index foi achado
            if(pessoa){
                nome.value = pessoa.nome
                tel.value = pessoa.tel
                if(pessoa.exp == 'Sim') exp[0].checked
                else exp[1].checked
            }
        }
    }
          
    form.onsubmit = e => {

        e.preventDefault()

    
        // criando um objeto pess
        let pessoa = new Pessoa(nome.value, tel.value, exp[0].checked)

        // validando nome
        if(!pessoa.nome){
            msg.erro('O campo "nome" não pode estar vazio')
            return false
        }
        else if(!pessoa.nome.match(/^[a-zA-Z][a-zA-Z\s]+[a-zA-Z]$/)){
            msg.erro('Nome inválido!')
            return false
        }
       
        // validando telefone
        if(!pessoa.tel){
            msg.erro('O campo "telefone" não pode estar vazio')
            return false
        }
        else if(!pessoa.tel.match(/\(\d{2}\) 9\d{4}-\d{4}/)){
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



 
   
