const firebase = require('firebase/app');
require('firebase/firestore');
require('firebase/auth');

export class Firebase {

    constructor() {

        this._config = {
            apiKey: "AIzaSyDMqSC5p9hH5McVb-ULvaSu1LHFPDeXlds",
            authDomain: "mia-chat-app.firebaseapp.com",
            databaseURL: "https://mia-chat-app.firebaseio.com",
            projectId: "mia-chat-app",
            storageBucket: "",
            messagingSenderId: "367574296161",
            appId: "1:367574296161:web:fb9b27666a5e0ef9"
        };

        this.onInit();

    }

    onInit() {

        if (!window._initializedFirebase) {

            // Initialize Firebase
            firebase.initializeApp(this._config);

            //Configurações da firestore
            /*firebase.firestore().settings({
                timestampsInSnapshots: true
            });*/

            window._initializedFirebase = true;
        }
    }

    //Aqui no database firestore, gravo as informações
    static db() {
        return firebase.firestore();
    }

    //Aqui no hd, salvo os arquivos
    static hd() {
        return firebase.storage();
    }


    initAuth() {

        return new Promise((success, failure) => {

            let provider = new firebase.auth.GoogleAuthProvider();

            firebase.auth().signInWithPopup(provider)
                .then(result => {

                    let token = result.credential.accessToken;
                    let user = result.user;

                    //console.log(token, user);

                    success({user, token});

                })
                .catch(err => {
                    console.error('erro', err);
                    failure(err);
                });

        });

    }

}