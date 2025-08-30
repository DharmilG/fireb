'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Camera, Check, Image as ImageIcon, Loader2, MapPin, Upload, ShieldX, Bot } from 'lucide-react';
import { Logo } from '@/components/logo';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { verifyReport } from '@/ai/flows/verify-report-flow';
import type { VerifyReportOutput } from '@/ai/types/report-verification';


const totalSteps = 4;

export default function ReportPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    image: null as string | null,
    location: 'Current Location',
    title: '',
    description: '',
    type: '',
  });
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<VerifyReportOutput | null>(null);

  const router = useRouter();
  const { toast } = useToast();

  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;
    if (step === 1) {
      const getCameraPermission = async () => {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          console.error('Camera API not supported');
          setHasCameraPermission(false);
          toast({
            variant: 'destructive',
            title: 'Camera Not Supported',
            description: 'Your browser does not support camera access.',
          });
          return;
        }

        try {
          stream = await navigator.mediaDevices.getUserMedia({ video: true });
          setHasCameraPermission(true);

          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (error) {
          console.error('Error accessing camera:', error);
          setHasCameraPermission(false);
          toast({
            variant: 'destructive',
            title: 'Camera Access Denied',
            description: 'Please enable camera permissions in your browser settings to use this feature.',
          });
        }
      };

      getCameraPermission();
    }
      
    return () => {
      stopCameraStream();
    }
  }, [step, toast]);

  const handleNext = () => setStep((s) => Math.min(s + 1, totalSteps));
  const handleBack = () => {
    if (step === 1) {
      router.push('/home');
    } else {
      setStep((s) => Math.max(s - 1, 1));
    }
  };

  const handleImageSelect = () => {
    setFormData(prev => ({ ...prev, image: 'https://picsum.photos/400/300?random=10' }));
    handleNext();
  };
  
  const stopCameraStream = () => {
      if (videoRef.current && videoRef.current.srcObject) {
          const stream = videoRef.current.srcObject as MediaStream;
          stream.getTracks().forEach(track => track.stop());
          videoRef.current.srcObject = null;
      }
  }

  const handleTakePhoto = () => {
    if (videoRef.current && canvasRef.current && hasCameraPermission) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        const dataUrl = canvas.toDataURL('image/png');
        setFormData(prev => ({ ...prev, image: dataUrl }));
        stopCameraStream();
        handleNext();
      }
    } else {
        toast({
            variant: 'destructive',
            title: 'Camera not ready',
            description: 'Please grant camera permission to take a photo.',
        });
    }
  };
  
  const handleSubmit = async () => {
      if (!formData.image || !formData.title || !formData.type) {
          toast({
              variant: 'destructive',
              title: 'Missing Information',
              description: 'Please fill out the title and type before submitting.',
          });
          return;
      }
      setIsVerifying(true);
      try {
        const result = await verifyReport({
            photoDataUri: formData.image,
            title: formData.title,
            description: formData.description,
        });
        setVerificationResult(result);
      } catch (error) {
          console.error('Verification failed', error);
          toast({
              variant: 'destructive',
              title: 'Verification Failed',
              description: 'Could not verify the report. Please try again.',
          });
      } finally {
        setIsVerifying(false);
        handleNext();
      }
  }

  const progress = (step / totalSteps) * 100;

  const isReportOk = verificationResult && !verificationResult.isSpam && !verificationResult.isAiGenerated;

  return (
    <div className="flex h-full flex-col bg-muted/20">
      <header className="flex items-center gap-2 border-b bg-background p-4">
        <Button variant="ghost" size="icon" onClick={handleBack} disabled={isVerifying}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-grow">
            <p className="text-sm font-semibold font-headline">Report an Incident</p>
            <Progress value={progress} className="h-1.5 mt-1" />
        </div>
      </header>
      
      <main className="flex-grow p-4">
        {step === 1 && (
          <div className="text-center space-y-4 flex flex-col items-center">
            <h2 className="text-2xl font-bold font-headline">Upload an Image</h2>
            <p className="text-muted-foreground">A picture is worth a thousand words. Show us what you see.</p>
            <Card className="w-full max-w-sm h-64 flex flex-col justify-center items-center border-dashed border-2 overflow-hidden">
                <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
                <canvas ref={canvasRef} className="hidden" />
            </Card>

            {hasCameraPermission === false && (
                <Alert variant="destructive" className="max-w-sm">
                    <AlertTitle>Camera Access Required</AlertTitle>
                    <AlertDescription>
                        Please allow camera access to use this feature. You might need to change permissions in your browser or system settings.
                    </AlertDescription>
                </Alert>
            )}

            <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
                <Button size="lg" onClick={handleTakePhoto} disabled={!hasCameraPermission}><Camera className="mr-2 h-4 w-4" /> Take Photo</Button>
                <Button size="lg" variant="outline" onClick={handleImageSelect}><Upload className="mr-2 h-4 w-4" /> From Library</Button>
            </div>
          </div>
        )}
        {step === 2 && (
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold font-headline">Tag the Location</h2>
            <p className="text-muted-foreground">Pinpoint the incident on the map or use your current location.</p>
            <Card className="w-full h-80 relative overflow-hidden">
                {formData.image ? (
                   <Image src={formData.image} alt="Incident" fill className="object-cover" />
                ) : (
                   <Image src="https://picsum.photos/800/600" data-ai-hint="coastline aerial" alt="Map" fill className="object-cover" />
                )}
            </Card>
            <Button size="lg" className="w-full max-w-sm" onClick={handleNext}>Confirm Location</Button>
          </div>
        )}
        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold font-headline text-center">Add Details</h2>
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" placeholder="e.g., Plastic waste on beach" value={formData.title} onChange={(e) => setFormData(p => ({...p, title: e.target.value}))} disabled={isVerifying}/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Incident Type</Label>
              <Select onValueChange={(value) => setFormData(p => ({...p, type: value}))} disabled={isVerifying}>
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select a type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pollution">Pollution</SelectItem>
                  <SelectItem value="deforestation">Deforestation</SelectItem>
                  <SelectItem value="illegal-fishing">Illegal Fishing</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" placeholder="Provide more details about the incident." value={formData.description} onChange={(e) => setFormData(p => ({...p, description: e.target.value}))} disabled={isVerifying}/>
            </div>
            <Button size="lg" className="w-full" onClick={handleSubmit} disabled={isVerifying}>
                {isVerifying ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Verifying...
                    </>
                ) : (
                    'Review Report'
                )}
            </Button>
          </div>
        )}
        {step === 4 && (
          <div className="text-center flex flex-col justify-center items-center h-full">
            {isReportOk ? (
                <>
                    <div className="h-24 w-24 rounded-full bg-green-100 flex items-center justify-center mb-4">
                      <Check className="h-12 w-12 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold font-headline">Thank You!</h2>
                    <p className="text-muted-foreground mb-6">Your report has been submitted. We appreciate your help in protecting our coasts.</p>
                </>
            ) : (
                <>
                    <div className="h-24 w-24 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
                      <ShieldX className="h-12 w-12 text-destructive" />
                    </div>
                    <h2 className="text-2xl font-bold font-headline">Report Flagged</h2>
                    <p className="text-muted-foreground mb-6">Our AI system flagged this report for the following reasons. It will be manually reviewed.</p>
                </>
            )}

            <Card className="w-full max-w-sm text-left mb-6">
                <CardContent className="p-4 space-y-3">
                    {verificationResult?.isSpam && (
                        <Alert variant="destructive">
                           <ShieldX className="h-4 w-4"/>
                           <AlertTitle>Flagged as Spam</AlertTitle>
                           <AlertDescription>{verificationResult.spamReason}</AlertDescription>
                        </Alert>
                    )}
                     {verificationResult?.isAiGenerated && (
                        <Alert variant="destructive">
                           <Bot className="h-4 w-4"/>
                           <AlertTitle>AI-Generated Image Detected</AlertTitle>
                           <AlertDescription>{verificationResult.aiGeneratedReason}</AlertDescription>
                        </Alert>
                    )}
                    {!isReportOk && <div className="pt-2"/>}
                    <p><strong>Title:</strong> {formData.title || 'Plastic waste on beach'}</p>
                    <p><strong>Type:</strong> {formData.type || 'Pollution'}</p>
                    <p><strong>Location:</strong> {formData.location}</p>
                </CardContent>
            </Card>
            <Button size="lg" className="w-full max-w-sm" onClick={() => router.push('/home')}>Back to Home</Button>
          </div>
        )}
      </main>
    </div>
  );
}
