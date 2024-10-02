import React, { useState } from 'react';

const DragAndDropImage = () => {
    const [images, setImages] = useState([]);

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const handleDrop = (event) => {
        event.preventDefault();
        const files = event.dataTransfer.files;
        const imageFiles = Array.from(files).filter((file) => file.type.startsWith('image/'));
        if (imageFiles.length > 0) {
            addImages(imageFiles);
        }
    };

    const handleImageUpload = (event) => {
        const files = event.target.files;
        const imageFiles = Array.from(files).filter((file) => file.type.startsWith('image/'));
        if (imageFiles.length > 0) {
            addImages(imageFiles);
        }
    };

    const addImages = (imageFiles) => {
        const readers = imageFiles.map((file) => {
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.readAsDataURL(file);
            });
        });

        Promise.all(readers).then((newImages) => {
            const updatedImages = [...images, ...newImages];
            setImages(updatedImages);
            console.log(`Đã chọn ${updatedImages.length} tệp`, updatedImages);
        });
    };

    return (
        <div>
            <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                style={{
                    border: '2px dashed #cccccc',
                    padding: '20px',
                    textAlign: 'center',
                }}
            >
                {images.length > 0 ? (
                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                        {images.map((src, index) => (
                            <div
                                key={index}
                                style={{
                                    margin: '5px',
                                    width: '100px',
                                    height: '100px',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    border: '1px solid',
                                }}
                            >
                                <img src={src} alt={`Uploaded ${index}`} style={{ cursor: 'pointer' }} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>Kéo thả hình ảnh vào đây hoặc chọn tệp tin</p>
                )}
                <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    style={{ marginTop: '10px', display: 'none' }} // Ẩn nút chọn tệp
                    id="file-upload"
                />
                <label
                    htmlFor="file-upload"
                    style={{
                        cursor: 'pointer',
                        marginTop: '10px',
                        display: 'inline-block',
                        padding: '10px',
                        backgroundColor: '#cccccc',
                    }}
                >
                    Chọn tệp
                </label>
            </div>
        </div>
    );
};

export default DragAndDropImage;
