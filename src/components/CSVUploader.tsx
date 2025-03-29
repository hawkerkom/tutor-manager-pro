
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Upload } from 'lucide-react';
import { toast } from 'sonner';

interface CSVUploaderProps {
  title: string;
  description: string;
  onUpload: (csvContent: string) => void;
  acceptedFormat?: string;
}

const CSVUploader = ({ 
  title, 
  description, 
  onUpload,
  acceptedFormat = "Μορφή: School,Department,Course" 
}: CSVUploaderProps) => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!file) {
      toast.error('Παρακαλώ επιλέξτε ένα αρχείο CSV');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        const content = e.target.result as string;
        onUpload(content);
        toast.success('Το αρχείο φορτώθηκε επιτυχώς');
        setFile(null);
      }
    };
    reader.onerror = () => {
      toast.error('Σφάλμα κατά την ανάγνωση του αρχείου');
    };
    reader.readAsText(file);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="flex items-center gap-4">
            <Input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="flex-1"
            />
            <Button onClick={handleUpload} disabled={!file}>
              <Upload className="mr-2 h-4 w-4" />
              Μεταφόρτωση
            </Button>
          </div>
          <div className="text-sm text-muted-foreground">
            {acceptedFormat}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CSVUploader;
