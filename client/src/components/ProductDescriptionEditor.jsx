import React, { useImperativeHandle, forwardRef, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const ProductDescriptionEditor = forwardRef((_, ref) => {
    const [description, setDescription] = useState('');

    const handleDescriptionChange = (value) => {
        setDescription(value);
    };

    useImperativeHandle(ref, () => ({
        getDescription: () => description,
    }));

    return (
        <div>
            <ReactQuill
                value={description}
                onChange={handleDescriptionChange}
                placeholder="Mô tả sản phẩm"
                modules={{
                    toolbar: [
                        [{ header: '1' }, { header: '2' }, { font: [] }],
                        [{ size: [] }],
                        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                        [{ list: 'ordered' }, { list: 'bullet' }],
                    ],
                }}
                formats={[
                    'header',
                    'font',
                    'size',
                    'bold',
                    'italic',
                    'underline',
                    'strike',
                    'blockquote',
                    'list',
                    'bullet',
                    'indent',
                    'link',
                    'image',
                ]}
            />
        </div>
    );
});

export default ProductDescriptionEditor;
