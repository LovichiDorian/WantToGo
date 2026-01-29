import { useRef, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Camera, SwitchCamera, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PhotoCaptureProps {
  onCapture: (blob: Blob) => void;
  onClose: () => void;
}

/**
 * Full-screen photo capture component using MediaDevices API
 */
export function PhotoCapture({ onCapture, onClose }: PhotoCaptureProps) {
  const { t } = useTranslation();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [hasMultipleCameras, setHasMultipleCameras] = useState(false);

  // Start camera stream
  const startCamera = async (facing: 'user' | 'environment') => {
    setIsLoading(true);
    setError(null);

    // Stop existing stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }

    try {
      // Check for multiple cameras
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter((d) => d.kind === 'videoinput');
      setHasMultipleCameras(videoDevices.length > 1);

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facing,
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      setIsLoading(false);
    } catch (err) {
      console.error('Camera error:', err);
      if (err instanceof Error) {
        if (err.name === 'NotAllowedError') {
          setError(t('camera.permissionDenied'));
        } else if (err.name === 'NotFoundError') {
          setError(t('camera.notFound'));
        } else {
          setError(t('camera.error'));
        }
      }
      setIsLoading(false);
    }
  };

  // Initialize camera on mount
  useEffect(() => {
    startCamera(facingMode);

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Switch between front and back camera
  const handleSwitchCamera = () => {
    const newFacing = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(newFacing);
    startCamera(newFacing);
  };

  // Capture photo
  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    // Set canvas dimensions to video dimensions
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame to canvas
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0);

    // Convert to blob
    canvas.toBlob(
      (blob) => {
        if (blob) {
          onCapture(blob);
        }
      },
      'image/jpeg',
      0.9
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-black">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 px-4 py-3 flex items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="text-white hover:bg-white/20"
        >
          <X className="h-6 w-6" />
        </Button>
        
        {hasMultipleCameras && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSwitchCamera}
            className="text-white hover:bg-white/20"
            disabled={isLoading}
          >
            <SwitchCamera className="h-6 w-6" />
          </Button>
        )}
      </div>

      {/* Video preview */}
      <video
        ref={videoRef}
        className="h-full w-full object-cover"
        playsInline
        muted
        autoPlay
      />

      {/* Hidden canvas for capture */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Loading/Error overlay */}
      {(isLoading || error) && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80">
          {isLoading ? (
            <Loader2 className="h-12 w-12 text-white animate-spin" />
          ) : error ? (
            <div className="text-center px-6">
              <p className="text-white text-lg mb-4">{error}</p>
              <Button variant="secondary" onClick={onClose}>
                {t('common.close')}
              </Button>
            </div>
          ) : null}
        </div>
      )}

      {/* Capture button */}
      {!isLoading && !error && (
        <div className="absolute bottom-8 left-0 right-0 flex justify-center">
          <button
            onClick={handleCapture}
            className="w-20 h-20 rounded-full bg-white border-4 border-gray-300 flex items-center justify-center transition-transform active:scale-95 hover:bg-gray-100"
          >
            <Camera className="h-8 w-8 text-gray-800" />
          </button>
        </div>
      )}
    </div>
  );
}
