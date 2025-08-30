import Image from 'next/image';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { dummyReports, type Report } from '@/lib/dummy-data';
import { cn } from '@/lib/utils';
import { MapPin } from 'lucide-react';

const statusColors: Record<Report['status'], string> = {
  Pending: 'bg-yellow-400/20 text-yellow-700 border-yellow-400/50',
  'In Review': 'bg-blue-400/20 text-blue-700 border-blue-400/50',
  Resolved: 'bg-green-400/20 text-green-700 border-green-400/50',
};

export default function ReportsPage() {
  return (
    <div className="p-4">
      <header className="mb-6">
        <h1 className="text-3xl font-bold font-headline text-primary">My Reports</h1>
        <p className="text-muted-foreground">A history of your contributions.</p>
      </header>
      <div className="space-y-4">
        {dummyReports.map((report) => (
          <Card key={report.id} className="overflow-hidden shadow-md">
            <div className="relative h-40 w-full">
              <Image
                src={report.imageUrl}
                alt={report.title}
                fill
                className="object-cover"
                data-ai-hint="environmental incident"
              />
            </div>
            <CardHeader>
              <CardTitle className="font-headline text-lg">{report.title}</CardTitle>
              <div className="flex items-center text-sm text-muted-foreground pt-1">
                <MapPin className="h-4 w-4 mr-1.5"/>
                <span>{report.location}</span>
                <span className="mx-2">•</span>
                <span>{report.date}</span>
              </div>
            </CardHeader>
            <CardContent>
                <Badge variant="outline" className={cn("font-semibold", statusColors[report.status])}>
                  {report.status}
                </Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
