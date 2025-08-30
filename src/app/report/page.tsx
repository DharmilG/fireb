'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Camera, Check, Image as ImageIcon, MapPin, Upload } from 'lucide-react';
import { Logo } from '@/components/logo';

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
  const router = useRouter();

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
  
  const handleSubmit = () => {
      // In a real app, you would submit the data here.
      handleNext();
  }

  const progress = (step / totalSteps) * 100;

  return (
    <div className="flex h-full flex-col bg-muted/20">
      <header className="flex items-center gap-2 border-b bg-background p-4">
        <Button variant="ghost" size="icon" onClick={handleBack}>
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
            <Card className="w-full max-w-sm h-64 flex flex-col justify-center items-center border-dashed border-2">
                <ImageIcon className="h-16 w-16 text-muted-foreground/50"/>
            </Card>
            <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
                <Button size="lg" variant="outline" onClick={handleImageSelect}><Camera className="mr-2 h-4 w-4" /> Take Photo</Button>
                <Button size="lg" variant="outline" onClick={handleImageSelect}><Upload className="mr-2 h-4 w-4" /> From Library</Button>
            </div>
          </div>
        )}
        {step === 2 && (
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold font-headline">Tag the Location</h2>
            <p className="text-muted-foreground">Pinpoint the incident on the map or use your current location.</p>
            <Card className="w-full h-80 relative overflow-hidden">
                <Image src="https://picsum.photos/800/600" data-ai-hint="coastline aerial" alt="Map" fill className="object-cover" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <MapPin className="h-12 w-12 text-destructive animate-bounce" />
                </div>
            </Card>
            <Button size="lg" className="w-full max-w-sm" onClick={handleNext}>Confirm Location</Button>
          </div>
        )}
        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold font-headline text-center">Add Details</h2>
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" placeholder="e.g., Plastic waste on beach" value={formData.title} onChange={(e) => setFormData(p => ({...p, title: e.target.value}))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Incident Type</Label>
              <Select onValueChange={(value) => setFormData(p => ({...p, type: value}))}>
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
              <Textarea id="description" placeholder="Provide more details about the incident." value={formData.description} onChange={(e) => setFormData(p => ({...p, description: e.target.value}))}/>
            </div>
            <Button size="lg" className="w-full" onClick={handleSubmit}>Review Report</Button>
          </div>
        )}
        {step === 4 && (
          <div className="text-center flex flex-col justify-center items-center h-full">
            <div className="h-24 w-24 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <Check className="h-12 w-12 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold font-headline">Thank You!</h2>
            <p className="text-muted-foreground mb-6">Your report has been submitted. We appreciate your help in protecting our coasts.</p>
            <Card className="w-full max-w-sm text-left mb-6">
                <CardContent className="p-4 space-y-2">
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
