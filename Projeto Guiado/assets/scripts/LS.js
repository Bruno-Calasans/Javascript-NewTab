isArray = dado => dado instanceof Array
isObj = dado => dado instanceof Object

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

export {localStorage}

