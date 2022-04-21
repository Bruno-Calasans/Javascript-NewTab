

    // funcções genéricas
    function isArray(dado){return dado instanceof Array}
    function isObj(dado){return dado instanceof Object}
    function isHTML(dado){return dado instanceof HTMLElement}
    function isString(dado){return dado.constructor == String}



     // cria um elemento HTML com a classe desejada
    function criarElemento(tag, classeId, usarId=false){

        const elemento = document.createElement(tag)

        if(!usarId) elemento.className = classeId 
        else if(classeId) elemento.id = classeId 
        else return elemento

        return elemento
    }

    // pega qualquer elemento HTML por classe ou id
    function getElemento(classeId, usarId=true){

        if(usarId) return document.getElementById(classeId)
        else return document.getElementsByClassName(classeId)
    }

    function inserirDentro(elementoPai, ...elementos){

        if(elementos.length == 1 && isArray(elementos[0])) 
        elementos = elementos[0]

        for(let elemento of elementos) elementoPai.appendChild(elemento)

        return elementoPai
    }

    // selciona qualquer elemento a partir do query selector
    function selector(selector, all=false, useId=true){

        let simb = useId ? '#' : '.'
        if(all) return document.querySelectorAll(`${simb}${selector}`)
        else return document.querySelector(`${simb}${selector}`)
    }

    function validarTel(valor, formato=0){

        const formatos = [
            /(\(?\d{2}\)?)(\s?9)(\d{4})([ -]?)(\d{4})/,
            /(\(\d{2}\))( 9)(\d{4})-(\d{4})/
        ]

        return formatos[formato].test(valor)
    }

    function isNumber(valor){

        const regexNumber = /[^\D]/g
        return regexNumber.test(valor)
    }

    function isLetter(valor, formato=0){

        const formatos = [
            /[ a-zA-Z]/, // com espaço
            /[a-zA-Z]/ // sem espaço
        ]
        return formatos[formato].test(valor)
    }

    function validarNome(nome){

        const regexNome = /^[a-zA-Z][a-zA-Z ]+[a-zA-Z]$/
        return regexNome.test(nome)

    }



    export {
        isArray, isObj, isString, isHTML, criarElemento, getElemento, 
        validarTel, isNumber, validarNome, isLetter, inserirDentro,selector}

