import * as React from 'react';
import Modal from './Modal';
import { uploadBook } from "../actions/BookActions"
import { STORE_EVENTS, bookStore } from "../stores/BookStore";

enum UploadStatus {
    Selecting,
    Uploading,
    Completed,
    Failed,
}

export interface IUploadModalProps {

}

export interface IUploadModalState {
    isOpen: boolean,
    filesToUpload: { name: string, size: number }[],
    uploadStatus: UploadStatus,
}

const UploadStatusInfo = (props: { icon: string, text: React.ReactNode[] }) => (
    <div style={{ marginTop: 25 }}>
        <i className={props.icon} />
        {props.text.map((node) => (node))}
    </div>
)

export default class UploadModal extends React.Component<IUploadModalProps, IUploadModalState> {
    constructor(props: IUploadModalProps) {
        super(props);
        this.state = {
            isOpen: false,
            filesToUpload: [],
            uploadStatus: UploadStatus.Selecting
        }

        this.uploadFiles = this.uploadFiles.bind(this);
        this.onFilesSelected = this.onFilesSelected.bind(this);
        this.setStatusSuccessful = this.setStatusSuccessful.bind(this);
        this.setStatusFailed = this.setStatusFailed.bind(this);
    }

    setStatusSuccessful() {
        this.setState({ uploadStatus: UploadStatus.Completed, filesToUpload: [] });
    }

    setStatusFailed() {
        this.setState({ uploadStatus: UploadStatus.Failed, filesToUpload: [] });
    }

    componentDidMount() {
        bookStore.on(STORE_EVENTS.UPLOAD_SUCCESSFUL, this.setStatusSuccessful);
        bookStore.on(STORE_EVENTS.UPLOAD_FAILED, this.setStatusFailed);
    }

    componentWillUnmount() {
        bookStore.removeListener(STORE_EVENTS.UPLOAD_SUCCESSFUL, this.setStatusSuccessful);
        bookStore.removeListener(STORE_EVENTS.UPLOAD_FAILED, this.setStatusFailed);
    }

    onFilesSelected = (event: any) => {
        let fileList = [];

        for (let i = 0; i < event.target.files.length; i++) {
            const file = event.target.files[i];
            const fileType = String(file.type);

            if (fileType.endsWith("pdf") || fileType.endsWith("epub+zip"))
                fileList.push(file);
        }

        this.setState({ filesToUpload: fileList });
    }

    uploadFiles = () => {
        if (this.state.filesToUpload.length > 0) {
            uploadBook(this.state.filesToUpload);
            this.setState({ uploadStatus: UploadStatus.Uploading });
        }
    }

    displayUploadStatus() {
        switch (this.state.uploadStatus) {
            case UploadStatus.Selecting: {
                return <UploadStatusInfo icon={"fas fa-file-upload fa-4x color-purple"} text={[
                    <h5 key={1}> .PDF, .EPUB, .MOBI, .DOC </h5>,
                    <p key={2}> Drag files here upload or <label htmlFor="file" className="input-label"> browse </label> </p>
                ]} />
            }
            case UploadStatus.Uploading: {
                return <UploadStatusInfo icon={"fas fa-sync fa-spin fa-4x color-green"} text={[
                    <h3 key={1} className="color-gray"> Uploading... </h3>
                ]} />
            }
            case UploadStatus.Completed: {
                return <UploadStatusInfo icon={"fas fa-check-circle fa-4x color-green"} text={[
                    <h3 key={1} className="color-gray"> Upload completed </h3>
                ]} />
            }

            case UploadStatus.Failed: {
                return <UploadStatusInfo icon={"fas fa-times-circle fa-4x color-red"} text={[
                    <h3 key={1} className="color-gray"> Upload failed </h3>
                ]} />
            }
        }
    }

    setModalAction() {
        let onClickAction: () => void = () => { };
        let actionText = "";

        switch (this.state.uploadStatus) {
            case UploadStatus.Selecting: {
                onClickAction = this.uploadFiles;
                actionText = "Upload files";
                break;
            }
            case UploadStatus.Uploading: {
                return undefined;
            }
            case UploadStatus.Failed: {
                onClickAction = () => {
                    this.setState({
                        uploadStatus: UploadStatus.Selecting
                    });
                }
                actionText = "Try again";
                break;
            }

            case UploadStatus.Completed: {
                onClickAction = () => {
                    this.setState({
                        uploadStatus: UploadStatus.Selecting,
                    });
                }
                actionText = "Upload more";
            }
        }

        return <button onClick={onClickAction} className="btn btn-blue font-medium"> {actionText} </button>
    }

    public render() {
        return (
            <>
                <Modal trigger={{ style: "btn btn-green font-medium", icon: "file-upload", text: "UPLOAD" }}
                    action={this.setModalAction()}
                    title={"UPLOAD BOOKS"} onCloseEvent={() => this.setState({ filesToUpload: [], uploadStatus: UploadStatus.Selecting })}>
                    <div className="modal-upload-box">
                        <input type="file" name="file" multiple id="file" onChange={this.onFilesSelected} />
                        {this.displayUploadStatus()}
                        {this.state.uploadStatus === UploadStatus.Selecting && <div style={{ textAlign: "left", maxHeight: 120, overflowY: "auto", borderTop: `${(this.state.filesToUpload.length > 0) ? "1px solid #2f2f2f" : ""}` }}>
                            {this.state.filesToUpload.map((file: any, index) => (
                                <p key={index} className="clip-overflow"> {1 + index}. {file.name} </p>
                            ))}
                        </div>}
                    </div>
                </Modal>
                <hr className="divider" />
            </>
        );
    }
}
