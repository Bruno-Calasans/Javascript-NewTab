
    // cria linhas em forma de elementos html
    function criarLinhasHTML(...objs){

        // caso o araay objs tenha um outro array dentro
        if(objs.length == 1 && isArray(objs[0])) objs = objs[0]
        const linhas = []

        for(let obj of objs){

            //criando uma linha para cada obj
            const linha = criarElemento('tr')

            for(let atributo in obj){

                // criando dado para cada atributo do obj
                let dado = criarElemento('td')
                dado.innerHTML = obj[atributo]
                linha.appendChild(dado)
            }

            // criando o botão da classe 'btnAlterar'
            const btn = criarElemento('button', 'btnAlterar')
            btn.innerHTML = 'Alterar'

            // criando um elementro td(table data) para o botão
            const tdBtn = criarElemento('td')

            // inserindo o botão dentro de td
            tdBtn.appendChild(btn) 

            // inserindo td dentro da linha
            linha.appendChild(tdBtn)

            // guardando cada linha dentro do array
            linhas.push(linha)
        }
        return linhas
    }
 
    // cria linhas em forma de texto
    function criarLinhasTxt(...objs){

        if(objs.length == 1 && isArray(objs[0])) objs = objs[0]

        let linhas = []

        for(let obj of objs){

            // table datas
            let tds = ''
            for(let atributo in obj){

                // valor do atributo atual
                let valor = obj[atributo]

                // caso seja o atributo da experiência
                if(atributo == 'exp'){
                    
                    let cor = (valor == 'Sim') ? 'green': 'red'
                    let style = `style='color: ${cor}; font-weight: bold;'`
                    var td = `<td ${style}>${valor}</td>`

                // caso seja outro atributo
                }else{
                    var td = `<td>${valor}</td>`
                }

                tds += td
            }

            let linha = 
                `
                    <tr class='${this.body.linhas.classe}'>
                        ${tds}
                        <td> <button class="btnAlterar">Alterar</button> </td>
                    </tr>
            
                `
            linhas.push(linha)
        }
        return linhas

    }

    function inserirTxtDentro(elemento, ...txts){

        if(txts.length == 1 && isArray(txts[0])) txts = txts[0]
        for(let txt of txts) elemento.innerHTML += txt
    }

    function excluirElemento(classeId, userId=true){

        let elementos = getElemento(classeId, userId)
        
        if(userId) elementos.remove() 

        // caso seja um classe
        else{
            let array = transformArray(elementos)
            array.forEach(elemento => elemento.remove())
        
        }
    }

    // insere vários elementos HTML dentro de outro
    function inserirHtmlDentro(nomeElementoPai, usarId, ...elementos){

        const pai = getElemento(nomeElementoPai, usarId)
        elementos[0].forEach(elemento => pai.appendChild(elemento))
    }
