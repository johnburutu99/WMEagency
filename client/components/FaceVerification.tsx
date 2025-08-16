// @ts-nocheck
import { useState, useEffect, useRef, useCallback } from "react";
import * as faceapi from "face-api.js";
import { Button } from "./ui/button";
import { Loader2, CheckCircle, XCircle, Camera } from "lucide-react";

type LivenessChallenge = {
  key: "smile" | "blink";
  text: string;
  check: (detection: faceapi.WithFaceExpressions<faceapi.WithFaceLandmarks<faceapi.WithFaceDetection<{}>>>) => boolean;
};

const eyeAspectRatio = (eye: faceapi.Point[]) => {
  const p1 = eye[0];
  const p2 = eye[1];
  const p3 = eye[2];
  const p4 = eye[3];
  const p5 = eye[4];
  const p6 = eye[5];
  const d1 = Math.sqrt(Math.pow(p2.x - p6.x, 2) + Math.pow(p2.y - p6.y, 2));
  const d2 = Math.sqrt(Math.pow(p3.x - p5.x, 2) + Math.pow(p3.y - p5.y, 2));
  const d3 = Math.sqrt(Math.pow(p1.x - p4.x, 2) + Math.pow(p1.y - p4.y, 2));
  return (d1 + d2) / (2 * d3);
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
      const leftEAR = eyeAspectRatio(leftEye);
      const rightEAR = eyeAspectRatio(rightEye);
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

  const loadModels = async () => {
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
  };

  const startCamera = async () => {
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
  };

  useEffect(() => {
    loadModels();
  }, []);

  useEffect(() => {
    if (status === 'verifying' && currentChallenge && videoRef.current) {
      intervalRef.current = setInterval(async () => {
        if (videoRef.current && canvasRef.current) {
            const detections = await faceapi.detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
                .withFaceLandmarks()
                .withFaceExpressions();

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
