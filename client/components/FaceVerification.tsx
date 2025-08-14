import { useState, useEffect, useRef, useCallback } from "react";
import * as faceapi from "face-api.js";
import { Button } from "./ui/button";
import { Loader2, CheckCircle, XCircle, Camera } from "lucide-react";

type LivenessChallenge = {
  key: "smile" | "blink";
  text: string;
  check: (detection: faceapi.WithFaceExpressions<faceapi.WithFaceLandmarks<faceapi.WithFaceDescriptor<faceapi.FaceDetection>>>) => boolean;
};

const challenges: LivenessChallenge[] = [
  {
    key: "smile",
    text: "Please Smile",
    check: (d) => d.expressions.happy > 0.8,
  },
  {
    key: "blink",
    text: "Please Blink",
    check: (d) => {
      const leftEye = d.landmarks.getLeftEye();
      const rightEye = d.landmarks.getRightEye();
      const eyeAspectRatio = (p1, p2, p3, p4, p5, p6) => {
          const d1 = p2.distanceTo(p6);
          const d2 = p3.distanceTo(p5);
          const d3 = p1.distanceTo(p4);
          return (d1 + d2) / (2 * d3);
      };
      const leftEAR = eyeAspectRatio(leftEye[0], leftEye[1], leftEye[2], leftEye[3], leftEye[4], leftEye[5]);
      const rightEAR = eyeAspectRatio(rightEye[0], rightEye[1], rightEye[2], rightEye[3], rightEye[4], rightEye[5]);
      // A simple blink detection threshold
      return (leftEAR + rightEAR) / 2 < 0.2;
    }
  },
];

export const FaceVerification = () => {
  const [status, setStatus] = useState<"loading" | "ready" | "verifying" | "success" | "error">("loading");
  const [currentChallenge, setCurrentChallenge] = useState<LivenessChallenge | null>(null);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const intervalRef = useRef<NodeJS.Timeout>();

  const loadModels = useCallback(async () => {
    // In a real app, these models should be in your /public/models folder
    const modelPath = "/models";
    try {
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(modelPath),
        faceapi.nets.faceLandmark68Net.loadFromUri(modelPath),
        faceapi.nets.faceRecognitionNet.loadFromUri(modelPath),
        faceapi.nets.faceExpressionNet.loadFromUri(modelPath),
      ]);
      setStatus("ready");
    } catch (err) {
      setError("Failed to load AI models. Please ensure they are available at " + modelPath);
      setStatus("error");
    }
  }, []);

  const startCamera = useCallback(async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        setError("Could not access camera. Please check permissions.");
        setStatus("error");
      }
    } else {
      setError("Camera not supported on this device.");
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    loadModels();
  }, [loadModels]);

  useEffect(() => {
    if (status === 'verifying' && currentChallenge && videoRef.current) {
      intervalRef.current = setInterval(async () => {
        if (videoRef.current && canvasRef.current) {
            const detections = await faceapi.detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
                .withFaceLandmarks()
                .withFaceExpressions()
                .withFaceDescriptors();

            if (detections.length === 1) {
                const d = detections[0];
                // Draw face detection box and landmarks for visual feedback
                const canvas = canvasRef.current;
                const dims = faceapi.matchDimensions(canvas, videoRef.current, true);
                const resizedDetections = faceapi.resizeResults(detections, dims);
                faceapi.draw.drawDetections(canvas, resizedDetections);
                faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);

                if (currentChallenge.check(d)) {
                    // Move to next challenge or success
                    const currentIndex = challenges.findIndex(c => c.key === currentChallenge.key);
                    if (currentIndex + 1 < challenges.length) {
                        setCurrentChallenge(challenges[currentIndex + 1]);
                    } else {
                        setStatus("success");
                        clearInterval(intervalRef.current);
                    }
                }
            }
        }
      }, 500); // Check every 500ms
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [status, currentChallenge]);

  const handleStartVerification = async () => {
    await startCamera();
    setCurrentChallenge(challenges[0]);
    setStatus("verifying");
  };

  const renderStatus = () => {
    switch (status) {
      case "loading":
        return <div className="flex items-center gap-2"><Loader2 className="animate-spin" /> Loading AI Models...</div>;
      case "ready":
        return <Button onClick={handleStartVerification}><Camera className="mr-2"/> Start Verification</Button>;
      case "verifying":
        return <div className="text-lg font-semibold">{currentChallenge?.text}</div>;
      case "success":
        return <div className="flex items-center gap-2 text-green-500"><CheckCircle /> Verification Successful!</div>;
      case "error":
        return <div className="flex items-center gap-2 text-red-500"><XCircle /> {error}</div>;
    }
  };

  return (
    <div className="border p-4 rounded-lg">
      <div className="relative w-full max-w-lg mx-auto aspect-video bg-muted rounded-md overflow-hidden">
        <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
        <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />
      </div>
      <div className="mt-4 text-center h-10 flex items-center justify-center">
        {renderStatus()}
      </div>
    </div>
  );
};
