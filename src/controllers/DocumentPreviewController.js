import { fail } from 'assert';

const pdfLib = require('pdfjs-dist');
const path = require('path');

pdfLib.GlobalWorkerOptions.workerSrc = path.resolve(__dirname, '../../dist/pdf.worker.bundle.js');

export class DocumentPreviewController {

    constructor(file) {

        this._file = file;

    }


    getPreviewData() {

        return new Promise((success, failure) => {


            let reader = new FileReader();

            switch (this._file.type) {

                case 'image/png':
                case 'image/jpeg':
                case 'image/jpg':
                case 'image/gif':

                    reader.onload = e => {

                        success({
                            src: reader.result,
                            info: this._file.name
                        });

                    }

                    reader.onerror = e => {
                        failure(e);

                    }
                    reader.readAsDataURL(this._file);
                    break;

                case 'application/pdf':

                    reader.onload = e => {

                        pdfLib.getDocument(new Uint8Array(reader.result))
                            .then(pdf => {

                                pdf.getPage(1)
                                    .then(page => {

                                        let viewport = page.getViewport(1);

                                        let canvas = document.createElement('canvas');
                                        let canvasContext = canvas.getContext('2d');

                                        canvas.width = viewport.width;
                                        canvas.height = viewport.height;

                                        page.render({
                                            canvasContext,
                                            viewport
                                        })
                                            .then(() => {

                                                //Faz a tratativa do plural do "s"
                                                let _s = (pdf.numPages > 1) ? 's' : '';

                                                success({
                                                    src: canvas.toDataURL('image/png'),
                                                    info: `${pdf.numPages} página${_s}`
                                                });

                                            }).catch(err => {

                                                failure(err);

                                            });

                                    })
                                    .catch(err => {

                                        failure(err);

                                    });
                            })
                            .catch(err => {

                                failure(err);

                            });
                    }

                    reader.readAsArrayBuffer(this._file);

                    break;

                default:
                    failure();


            }


        });



    }
}