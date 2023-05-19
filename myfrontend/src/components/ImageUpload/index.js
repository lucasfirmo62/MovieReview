import React, { useState, useRef, useEffect } from 'react';
import { MdInsertPhoto, MdClose } from 'react-icons/md';
import './styles.css';

function ImageUpload(props) {
    const { selectedFile, setSelectedFile } = props;
    const [isDragOver, setIsDragOver] = useState(false);
    const fileInput = useRef(null);

    const handleFileInputChange = (e) => {
        const file = e.target.files[0];
        setSelectedFile(file);

        e.target.value = null;
    };

    const handleClearImage = () => {
        setSelectedFile(null);
    };

    const shouldRenderInput = !selectedFile || window.matchMedia("(min-width: 768px)").matches;

    return (
        <div className="image-upload-container">
            <div
                className={`image-upload-dropzone ${isDragOver ? 'drag-over' : ''}`}
                onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragOver(true);
                }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={(e) => {
                    e.preventDefault();
                    setIsDragOver(false);
                    const file = e.dataTransfer.files[0];
                    setSelectedFile(file);
                }}
            >
                {shouldRenderInput &&
                    <input
                        className="image-upload-input"
                        type="file"
                        accept="image/*"
                        onChange={handleFileInputChange}
                        ref={fileInput}
                        title=""
                    />
                }
                {selectedFile ? (
                    <div className="preview-image-container">
                        <img
                            className="preview-image"
                            src={URL.createObjectURL(selectedFile)}
                            alt="Imagem selecionada"
                        />
                        <button className="clear-image-button" onClick={handleClearImage}>
                            <MdClose size={16} />
                        </button>
                    </div>
                ) : (
                    <div className="image-upload-prompt">
                        <MdInsertPhoto size={24} />
                        <span>Arraste aqui</span>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ImageUpload;
