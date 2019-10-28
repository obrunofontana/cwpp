import { ClassEventUtils } from "../utils/ClassEventUtils";

//Classe intermediaria, pois nem todos os eventos precisam manipular os dados.
export class ModelGeneric extends ClassEventUtils {

    constructor() {
        super();

        this._data = {}
    }

    fromJSON(json) {

        //Mesclo os dois, se o que estiver vindo no json, não tiver no firestore, inclui, o que esta lá mantém
        this._data = Object.assign(this._data, json);

        this.trigger('datachange', this.toJSON());

    }

    toJSON() {
        return this._data;
    }
}