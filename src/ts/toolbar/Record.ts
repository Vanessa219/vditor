import recordSVG from "../../assets/icons/record.svg";
import {MenuItemClass} from "./MenuItemClass";
import {uploadFiles} from "../upload/index";
import {i18n} from "../i18n/index";

export class Record extends MenuItemClass {
    constructor(vditor: Vditor, menuItem: MenuItem) {
        super(vditor, menuItem)
        this.element.children[0].innerHTML = menuItem.icon || recordSVG

        this._bindEvent(vditor)
    }

    _bindEvent(vditor: Vditor) {
        let mediaRecorder: any
        this.element.children[0].addEventListener('click', () => {
            if (!mediaRecorder) {
                import(/* webpackChunkName: "vditor" */ 'recordrtc/RecordRTC.js').then(RecordRTC => {
                    navigator.mediaDevices.getUserMedia({audio: true}).then((mediaStream: MediaStream) => {
                        mediaRecorder = new RecordRTC.default(mediaStream, {
                            type: 'audio',
                            mimeType: 'audio/wav',
                        });

                        vditor.upload.element.children[0].innerHTML = i18n[vditor.options.lang].recoding
                        vditor.upload.element.style.opacity = 1
                        vditor.upload.element.className = 'vditor-upload vditor-upload--tip'
                        vditor.editor.element.setAttribute('disabled', 'disabled')
                        mediaRecorder.startRecording()
                    }).catch((err: ErrorEvent) => {
                        console.log('init media error:', err);
                    });
                }).catch(err => {
                    console.log('Failed to load recordrtc', err);
                });
                return
            }

            if ('recording' === mediaRecorder.getState()) {
                mediaRecorder.stopRecording(function () {
                    const blob = mediaRecorder.getBlob();
                    vditor.upload.element.className = 'vditor-upload'
                    uploadFiles(vditor, [blob])
                });
            } else {
                vditor.upload.element.children[0].innerHTML = i18n[vditor.options.lang].recoding
                vditor.upload.element.style.opacity = 1
                vditor.upload.element.className = 'vditor-upload vditor-upload--tip'
                vditor.editor.element.setAttribute('disabled', 'disabled')
                mediaRecorder.startRecording()
            }
        })
    }
}