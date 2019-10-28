export class CameraController {

    constructor(videoEl) {

        this._videoEl = videoEl;


        //Metodo nativo JS para solicitar acesso a midia de usuario
        navigator.mediaDevices.getUserMedia({
            video: true // Faço a solicitação de video para o usuario;
        }).then(stream => {

            this._stream = stream;
            this._videoEl.srcObject = stream;
            this._videoEl.play();

        }).catch(err => {
            console.error(err);
        });

    }

    stop() {

        this._stream.getTracks().forEach(track => {

            track.stop();

        });

    }

    takePicture(mimeType = 'image/png') {

        let canvas = document.createElement('canvas');

        canvas.setAttribute('height', this._videoEl.videoHeight);
        canvas.setAttribute('width', this._videoEl.videoWidth);

        let context = canvas.getContext('2d'); //Defino se a imagem sera 2d, 3d etc, como é imagem estatica sera 2d

        context.drawImage(this._videoEl, 0, 0, canvas.width, canvas.height);//Desenho a foto

        return canvas.toDataURL(mimeType); //retorno um base64

    }


}

