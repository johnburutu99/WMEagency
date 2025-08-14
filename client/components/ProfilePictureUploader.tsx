import { useState, useRef, useCallback } from "react";
import { Button } from "./ui/button";
import { Camera, RefreshCw, Upload, X } from "lucide-react";

export const ProfilePictureUploader = () => {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = useCallback(async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setIsCameraOpen(true);
        setCapturedImage(null);
        setError(null);
      } catch (err) {
        console.error("Error accessing camera:", err);
        setError("Could not access camera. Please check permissions.");
      }
    } else {
      setError("Camera not supported on this device.");
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    setIsCameraOpen(false);
  }, []);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext("2d");
      if (context) {
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        const dataUrl = canvas.toDataURL("image/jpeg");
        setCapturedImage(dataUrl);
        stopCamera();
      }
    }
  };

  const handleUpload = async () => {
    if (!capturedImage) return;
    console.log("Uploading image...");
    // Here you would call your API to upload the image
    // For now, we'll just log the base64 string
    console.log(capturedImage.substring(0, 100) + "..."); // Log a snippet
    // In a real app, you'd probably show a success message and update the UI
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="w-40 h-40 bg-muted rounded-full flex items-center justify-center overflow-hidden">
        {!isCameraOpen && !capturedImage && <span className="text-muted-foreground">No Image</span>}
        {capturedImage && <img src={capturedImage} alt="Captured" className="w-full h-full object-cover" />}
        <video ref={videoRef} autoPlay playsInline className={`w-full h-full object-cover ${isCameraOpen ? 'block' : 'hidden'}`} />
        <canvas ref={canvasRef} className="hidden" />
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {!isCameraOpen && !capturedImage && (
        <Button onClick={startCamera}>
          <Camera className="w-4 h-4 mr-2" />
          Open Camera
        </Button>
      )}

      {isCameraOpen && (
        <div className="flex gap-2">
          <Button onClick={handleCapture}>Capture</Button>
          <Button variant="ghost" onClick={stopCamera}><X className="w-4 h-4" /></Button>
        </div>
      )}

      {capturedImage && (
        <div className="flex gap-2">
          <Button onClick={handleUpload}>
            <Upload className="w-4 h-4 mr-2" />
            Save Picture
          </Button>
          <Button variant="outline" onClick={startCamera}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Retake
          </Button>
        </div>
      )}
    </div>
  );
};
