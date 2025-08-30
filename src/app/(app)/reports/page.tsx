
'use client';

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/auth-context';
import { useMemo } from 'react';

const statusColors: Record<Report['status'], string> = {
  Pending: 'bg-yellow-400/20 text-yellow-700 border-yellow-400/50',
  'In Review': 'bg-blue-400/20 text-blue-700 border-blue-400/50',
  Resolved: 'bg-green-400/20 text-green-700 border-green-400/50',
};

const ReportList = ({ reports }: { reports: Report[] }) => {
    if (reports.length === 0) {
        return (
            <div className="text-center py-10">
                <p className="text-muted-foreground">You haven't created any reports yet.</p>
            </div>
        )
    }

    return (
      <div className="space-y-4">
        {reports.map((report) => (
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
    );
}

export default function ReportsPage() {
  const { user } = useAuth();

  const myReports = useMemo(() => {
    // In a real app, the user ID would come from the authenticated user.
    // Since we are using dummy data, we'll use a hardcoded ID for "John Doe"
    const currentUserId = "user-1"; 
    return dummyReports.filter(report => report.userId === currentUserId);
  }, []);

  return (
    <div className="p-4">
      <header className="mb-6">
        <h1 className="text-3xl font-bold font-headline text-primary">Reports</h1>
        <p className="text-muted-foreground">Track incident reports.</p>
      </header>
      <Tabs defaultValue="all-reports" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="all-reports">All Reports</TabsTrigger>
          <TabsTrigger value="my-reports">My Reports</TabsTrigger>
        </TabsList>
        <TabsContent value="all-reports">
          <ReportList reports={dummyReports} />
        </TabsContent>
        <TabsContent value="my-reports">
          <ReportList reports={myReports} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
