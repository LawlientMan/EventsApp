import { useEffect, useState } from 'react'
import { Button, Grid, Header } from 'semantic-ui-react'
import ImageWidgetDropzone from './ImageWidgetDropzone';
import ImageWidgetResizeCropper from './ImageWidgetResizeCropper';

interface Props{
    uploadImage: (file : Blob) => void;
    loading: boolean;
}

const ImageUploadWidget = ({uploadImage, loading}:Props) => {
    const [files, setfiles] = useState<any>([]);
    const [cropper, setCropper] = useState<Cropper>()

    function onCrop() {
        if (cropper) {
            cropper.getCroppedCanvas().toBlob(blob => uploadImage(blob!));
        }
    }

    useEffect(() => {
        return () => {
            files.forEach((file: any) => URL.revokeObjectURL(file.preview));
        }
    }, [files]);

    return (
        <Grid>
            <Grid.Column width={4}>
                <Header sub color='teal' content='Step 1 - Add image' />
                <ImageWidgetDropzone setFiles={setfiles} />
            </Grid.Column>
            <Grid.Column width={1} />
            <Grid.Column width={4}>
                <Header sub color='teal' content='Step 1 - Resize image' />
                {files && files.length > 0 && (
                    <ImageWidgetResizeCropper setCropper={setCropper} imagePreview={files[0].preview} />
                )}
            </Grid.Column>
            <Grid.Column width={1} />
            <Grid.Column width={4}>
                <Header sub color='teal' content='Step 1 - Preview & Upload' />
                {files && files.length > 0 && (
                    <>
                        <div className='img-preview' style={{ minHeight: 200, overflow: 'hidden' }}></div>
                        <Button.Group widths={2}>
                            <Button onClick={onCrop} positive icon='check' loading={loading} />
                            <Button onClick={() => setfiles([])} icon='close' disabled={loading} />
                        </Button.Group>
                    </>
                )}
            </Grid.Column>
        </Grid>
    )
}

export default ImageUploadWidget;