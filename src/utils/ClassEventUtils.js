export class ClassEventUtils {

    constructor() {

        this._events = {};
    }


    on(eventName, fn) {

        if (!this._events[eventName]) this._events[eventName] = new Array();

        this._events[eventName].push(fn);

    }

    trigger(){

        //recebe os argumentos que foram passados por parâmetros, se não tiver nenhum parametro, arguments é undefined
        //Utilizo arguments quando não preciso controlar a quantidade de parâmetros, podendo enviar 1 ou 1milhão de argumentos
        let args = [...arguments];

        let eventName = args.shift(); //shift, remove a primeira posição do array e retorna ele mesmo;

        args.push(new Event(eventName));

        if(this._events[eventName] instanceof Array) {

            this._events[eventName].forEach(fn => {

                fn.apply(null, args);
                
            });

        }


    }

}