import recordSVG from "../../assets/icons/record.svg";
import {i18n} from "../i18n/index";
import {uploadFiles} from "../upload/index";
import {getEventName} from "../util/compatibility";
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
        this.element.children[0].addEventListener(getEventName(), (event) => {
            if (this.element.firstElementChild.classList.contains("vditor-menu--disabled")) {
                return;
            }
            event.preventDefault();
            const editorElement = vditor.currentMode === "wysiwyg" ? vditor.wysiwyg.element : vditor.editor.element;
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
                    vditor.tip.show(i18n[vditor.options.lang].recording);
                    editorElement.setAttribute("contenteditable", "false");
                    this.element.children[0].classList.add("vditor-menu--current");
                }).catch(() => {
                    vditor.tip.show(i18n[vditor.options.lang]["record-tip"]);
                });
                return;
            }

            if (mediaRecorder.isRecording) {
                mediaRecorder.stopRecording();
                vditor.tip.hide();
                const file: File = new File([mediaRecorder.buildWavFileBlob()],
                    `record${(new Date()).getTime()}.wav`, {type: "video/webm"});
                uploadFiles(vditor, [file]);
                this.element.children[0].classList.remove("vditor-menu--current");
            } else {
                vditor.tip.show(i18n[vditor.options.lang].recording);
                editorElement.setAttribute("contenteditable", "false");
                mediaRecorder.startRecordingNewWavFile();
                this.element.children[0].classList.add("vditor-menu--current");
            }
        });
    }
}
