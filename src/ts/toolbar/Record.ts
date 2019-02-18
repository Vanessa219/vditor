import recordSVG from "../../assets/icons/record.svg";
import {i18n} from "../i18n/index";
import {uploadFiles} from "../upload/index";
import {MediaRecorder} from "../util/MediaRecorder";
import {MenuItem} from "./MenuItem";

export class Record extends MenuItem {
    constructor(vditor: IVditor, menuItem: IMenuItem) {
        super(vditor, menuItem);
        this.element.children[0].innerHTML = menuItem.icon || recordSVG;

        this._bindEvent(vditor);
    }

    public _bindEvent(vditor: IVditor) {
        let mediaRecorder: MediaRecorder;
        this.element.children[0].addEventListener("click", () => {
            if (!mediaRecorder) {
                navigator.mediaDevices.getUserMedia({audio: true}).then((mediaStream: MediaStream) => {
                    mediaRecorder = new MediaRecorder(mediaStream);
                    mediaRecorder.recorder.onaudioprocess = (e: AudioProcessingEvent) => {
                        // Do nothing if not recording:
                        if (!mediaRecorder.isRecording) {
                            return;
                        }

                        // Copy the data from the input buffers;
                        const left = e.inputBuffer.getChannelData(0);
                        const right = e.inputBuffer.getChannelData(1);
                        mediaRecorder.cloneChannelData(left, right);
                    };
                    mediaRecorder.startRecordingNewWavFile();
                    vditor.upload.element.children[0].innerHTML = i18n[vditor.options.lang].recording;
                    vditor.upload.element.style.opacity = "1";
                    vditor.upload.element.className = "vditor-upload vditor-upload--tip";
                    vditor.editor.element.setAttribute("disabled", "disabled");
                }).catch((err: ErrorEvent) => {
                    console.error("init media error:", err);
                });
                return;
            }

            if (mediaRecorder.isRecording) {
                mediaRecorder.stopRecording();
                vditor.upload.element.className = "vditor-upload";
                const file: File = new File([mediaRecorder.buildWavFileBlob()],
                    `record${(new Date()).getTime()}.wav`, {type: "video/webm"});
                uploadFiles(vditor, [file]);
            } else {
                vditor.upload.element.children[0].innerHTML = i18n[vditor.options.lang].recording;
                vditor.upload.element.style.opacity = "1";
                vditor.upload.element.className = "vditor-upload vditor-upload--tip";
                vditor.editor.element.setAttribute("disabled", "disabled");
                mediaRecorder.startRecordingNewWavFile();
            }
        });
    }
}
