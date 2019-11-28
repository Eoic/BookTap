import * as React from 'react';
import { timingSafeEqual } from 'crypto';
import Modal from './Modal';

export interface IUploadModalProps {

}

export interface IUploadModalState {
    isOpen: boolean,
    filesToUpload: { name: string, size: number }[],
}

export default class UploadModal extends React.Component<IUploadModalProps, IUploadModalState> {
    constructor(props: IUploadModalProps) {
        super(props);
        this.state = {
            isOpen: false,
            filesToUpload: []
        }

        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
        this.onFilesSelected = this.onFilesSelected.bind(this);
    }

    open = () => this.setState({ isOpen: true });

    close = () => this.setState({ isOpen: false });

    onFilesSelected = (event: any) => {
        let fileList = [];

        for (let i = 0; i < event.target.files.length; i++) {
            fileList.push({
                name: event.target.files[i].name,
                size: event.target.files[i].size,
            });
        }

        this.setState({ filesToUpload: fileList });
    }

    public render() {
        return (
            <>
                <Modal trigger={{ style: "btn btn-green font-medium", icon: "file-upload", text: "UPLOAD" }} 
                       action={<button className="btn btn-blue font-medium"> Upload files </button>}
                       title={"UPLOAD BOOKS"}>
                    <div className="modal-upload-box">
                        <input type="file" name="file" multiple id="file" onChange={this.onFilesSelected} />
                        <i className="fas fa-file-upload fa-5x" style={{ color: "#4e49cc" }} />
                        <h5> .PDF, .EPUB, .MOBI, .DOC </h5>
                        <p> Drag files here upload or <label htmlFor="file" className="input-label"> browse </label> </p>
                        <div style={{ textAlign: "left", maxHeight: 95, overflowY: "auto", borderTop: `${(this.state.filesToUpload.length > 0) ? "1px solid #2f2f2f" : ""}` }}>
                            {this.state.filesToUpload.map((file: any) => (
                                <p> {file.name} | {file.size} </p>
                            ))}
                        </div>
                    </div>
                </Modal>
            </>
        );
    }
}
