import { useState, ChangeEvent, FormEvent } from 'react';
import '../App.css';
import axios from 'axios';

function App() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imageURL, setImageURL] = useState('');

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const file: File | null = e.target.files?.[0] || null;
    setSelectedImage(file);
  };

  const handleCapturePhoto = async (): Promise<void> => {
    try {
      const mediaDevices: MediaDevices = navigator.mediaDevices; // Acceder a la API de MediaDevices
      if (mediaDevices && mediaDevices.getUserMedia) {
        // Verificar si getUserMedia está disponible
        const stream: MediaStream = await mediaDevices.getUserMedia({
          video: true, // Habilitar el acceso a la cámara del dispositivo
        });
        const video: HTMLVideoElement = document.createElement('video'); // Crear un elemento de video
        const captureCanvas: HTMLCanvasElement =
          document.createElement('canvas'); // Crear un elemento de lienzo para capturar la imagen

        video.srcObject = stream; // Establecer el flujo de la cámara en el elemento de video
        video.play(); // Reproducir el video

        video.onloadedmetadata = () => {
          captureCanvas.width = video.videoWidth; // Establecer el ancho del lienzo de captura
          captureCanvas.height = video.videoHeight; // Establecer la altura del lienzo de captura

          captureCanvas
            .getContext('2d')
            ?.drawImage(video, 0, 0, captureCanvas.width, captureCanvas.height); // Capturar la imagen del video en el lienzo de captura

          const capturedImage: string = captureCanvas.toDataURL('image/jpeg'); // Obtener la imagen capturada como una URL de datos en formato JPEG
          setSelectedImage(dataURLtoFile(capturedImage, 'captured-photo.jpg')); // Convertir la URL de datos en un archivo y establecerlo en el estado
          stream.getTracks().forEach((track) => track.stop()); // Detener el flujo de la cámara
        };
      }
    } catch (error) {
      console.log(error); // Manejar cualquier error ocurrido al acceder a la cámara del dispositivo
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (selectedImage) {
      const formData = new FormData();
      formData.append('file', selectedImage);
      formData.append('upload_preset', 'x1ryjgeq');

      try {
        const response = await axios.post(
          'https://api.cloudinary.com/v1_1/dm8b2resp/image/upload',
          formData
        );
        setImageURL(response.data.secure_url);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const dataURLtoFile = (dataURL: string, filename: string): File => {
    const arr = dataURL.split(',');
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime }); // Convertir una URL de imagen en un archivo de imagen
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <label htmlFor="image">Ingresa tu foto</label>
        <input
          name="image"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />
        <button type="submit">Enviar foto</button>
        <span>URL:</span>
        <p> {imageURL}</p>
      </form>
      <button onClick={handleCapturePhoto}>Tomar foto</button>
    </>
  );
}

export default App;
