import { ClassEventUtils } from "../utils/ClassEventUtils";


export class MicrophoneController extends ClassEventUtils {

    constructor() {

        // Lembrando, esta classe está extendendo de outra classe, sendo assim, este constructor sobreescreve o constructor pai
        // Para que este construtor consiga chamar o construtor pai dele utilizar a função abaixo
        super();

        this._available = false;
        this._mimeType = 'audio/webm';


        //Metodo nativo JS para solicitar acesso a midia de usuario
        navigator.mediaDevices.getUserMedia({
            audio: true // Faço a solicitação de video para o usuario;
        }).then(stream => {


            this._available = true;
            this._stream = stream;


            this.trigger('ready', this._stream);

        }).catch(err => {
            console.error(err);
        });

    }

    isAvailable() {
        return this._available;
    }

    stop() {

        this._stream.getTracks().forEach(track => {

            track.stop();

        });
    }

    //Inicia a gravação do microfone
    startRecorder() {

        if (this.isAvailable()) {

            this._mediaRecorder = new MediaRecorder(this._stream, {
                mimeType: this._mimeType
            });

            this._recordedChunks = []; //pedaços do arquivo que foi gravado;

            this._mediaRecorder.addEventListener('dataavailable', e => {

                if (e.data.size > 0) {

                    this._recordedChunks.push(e.data);

                }

            });

            this._mediaRecorder.addEventListener('stop', e => {

                //Aqui pega todos os pedaços de arquivo que foram gravados no array e junta tudo e compacta e o tranforma em um blob
                let blob = new Blob(this._recordedChunks, {
                    mimeType: this._mimeType
                })

                let fileName = `rec${Date.now()}.webm`;

                //Transforme esse blob em um arquivo("fisico" -> "digital");
                let file = new File([blob], fileName, {
                    type: this._mimeType,
                    lastModified: Date.now()
                });

                /*console.log('file', file);

                let reader = new FileReader();

                reader.onload = e => {

                    let audio = new Audio(reader.result);

                    audio.play();

                }
                reader.readAsDataURL(file);*/

            });

            this._mediaRecorder.start();
            this.startTimer();
        }
    }

    //Paro a gravação do microfone
    stopRecorder() {

        if (this.isAvailable()) {

            this._mediaRecorder.stop(); //Para de gravar o microfone

            this.stop(); //Para de ouvir o microfone
            this.stopTimer(); //Para o tempo do microfone

        }
    }
    //   clearInterval(this._recordMicrophoneInterval);

    startTimer() {

        let start = Date.now();

        this._recordMicrophoneInterval = setInterval(() => {

            this.trigger('recordtimer', Date.now() - start );            

        }, 100);
    }

    stopTimer() {
        clearInterval(this._recordMicrophoneInterval);
    }
}