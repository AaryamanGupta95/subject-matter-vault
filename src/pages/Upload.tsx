
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload as UploadIcon, FileText, Image, Video, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface UploadState {
  subject: string;
  fileType: 'text' | 'image' | 'video' | '';
  file: File | null;
  isUploading: boolean;
  assessmentResult: any;
}

const Upload = () => {
  const [uploadState, setUploadState] = useState<UploadState>({
    subject: '',
    fileType: '',
    file: null,
    isUploading: false,
    assessmentResult: null
  });
  
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubjectChange = (subject: string) => {
    setUploadState(prev => ({ ...prev, subject }));
  };

  const handleFileTypeChange = (fileType: 'text' | 'image' | 'video') => {
    setUploadState(prev => ({ 
      ...prev, 
      fileType, 
      file: null,
      assessmentResult: null 
    }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadState(prev => ({ 
        ...prev, 
        file,
        assessmentResult: null 
      }));
    }
  };

  const getAcceptedTypes = () => {
    switch (uploadState.fileType) {
      case 'text':
        return '.txt,.pdf,.docx';
      case 'image':
        return '.jpg,.jpeg,.png,.gif,.bmp';
      case 'video':
        return '.mp4,.avi,.mov,.wmv,.flv';
      default:
        return '';
    }
  };

  const assessFile = async () => {
    if (!uploadState.file || !uploadState.subject) {
      toast({
        title: "Missing Information",
        description: "Please select a subject and upload a file.",
        variant: "destructive"
      });
      return;
    }

    setUploadState(prev => ({ ...prev, isUploading: true }));

    try {
      const formData = new FormData();
      
      // Map file types to the Python API parameter names
      const fileParamMap = {
        'text': 'text_file',
        'image': 'image',
        'video': 'video'
      };
      
      const paramName = fileParamMap[uploadState.fileType];
      formData.append(paramName, uploadState.file);

      const response = await fetch('http://localhost:8000/assess', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Assessment failed');
      }

      const result = await response.json();
      setUploadState(prev => ({ ...prev, assessmentResult: result }));

      // Check if the file is safe
      const fileResult = result.assessment[paramName];
      if (fileResult === 'safe') {
        // Save file metadata locally with subject info
        const fileData = {
          id: Date.now().toString(),
          subject: uploadState.subject,
          fileName: uploadState.file.name,
          fileType: uploadState.fileType,
          uploadDate: new Date().toISOString(),
          status: 'safe',
          filePath: `static/uploads/${uploadState.file.name}`
        };
        
        const existingFiles = JSON.parse(localStorage.getItem('uploadedFiles') || '[]');
        existingFiles.push(fileData);
        localStorage.setItem('uploadedFiles', JSON.stringify(existingFiles));

        toast({
          title: "Upload Successful!",
          description: "Your file has been safely uploaded and stored.",
        });

        // Reset form
        setUploadState({
          subject: '',
          fileType: '',
          file: null,
          isUploading: false,
          assessmentResult: null
        });
      } else {
        toast({
          title: "Upload Rejected",
          description: "The file contains inappropriate content and cannot be uploaded.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Failed",
        description: "There was an error processing your file. Please try again.",
        variant: "destructive"
      });
    } finally {
      setUploadState(prev => ({ ...prev, isUploading: false }));
    }
  };

  const getFileTypeIcon = (type: string) => {
    switch (type) {
      case 'text':
        return <FileText className="h-8 w-8" />;
      case 'image':
        return <Image className="h-8 w-8" />;
      case 'video':
        return <Video className="h-8 w-8" />;
      default:
        return <UploadIcon className="h-8 w-8" />;
    }
  };

  const renderAssessmentResult = () => {
    if (!uploadState.assessmentResult) return null;

    const fileParamMap = {
      'text': 'text_file',
      'image': 'image',
      'video': 'video'
    };
    
    const paramName = fileParamMap[uploadState.fileType];
    const result = uploadState.assessmentResult.assessment[paramName];
    const isSafe = result === 'safe';

    return (
      <Card className="mt-4">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            {isSafe ? (
              <CheckCircle className="h-6 w-6 text-green-500" />
            ) : (
              <XCircle className="h-6 w-6 text-red-500" />
            )}
            <div>
              <p className="font-medium">
                {isSafe ? 'Content Approved' : 'Content Rejected'}
              </p>
              <p className="text-sm text-muted-foreground">
                {isSafe 
                  ? 'Your file has passed all safety checks and has been saved to static/uploads.'
                  : 'The file contains inappropriate content and cannot be uploaded.'
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Upload Educational Content</h1>
          <p className="text-muted-foreground">
            Upload files for your courses. All content goes through safety verification and is saved to static/uploads.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>File Upload</CardTitle>
            <CardDescription>
              Select the subject and file type, then upload your content.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Subject Selection */}
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Select value={uploadState.subject} onValueChange={handleSubjectChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mathematics">Mathematics</SelectItem>
                  <SelectItem value="science">Science</SelectItem>
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="history">History</SelectItem>
                  <SelectItem value="geography">Geography</SelectItem>
                  <SelectItem value="art">Art</SelectItem>
                  <SelectItem value="music">Music</SelectItem>
                  <SelectItem value="physical-education">Physical Education</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* File Type Selection */}
            <div className="space-y-2">
              <Label>File Type</Label>
              <div className="grid grid-cols-3 gap-4">
                {(['text', 'image', 'video'] as const).map((type) => (
                  <Button
                    key={type}
                    variant={uploadState.fileType === type ? "default" : "outline"}
                    className="h-20 flex-col gap-2"
                    onClick={() => handleFileTypeChange(type)}
                  >
                    {getFileTypeIcon(type)}
                    <span className="capitalize">{type}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* File Upload */}
            {uploadState.fileType && (
              <div className="space-y-2">
                <Label htmlFor="file">
                  Upload {uploadState.fileType.charAt(0).toUpperCase() + uploadState.fileType.slice(1)} File
                </Label>
                <Input
                  id="file"
                  type="file"
                  accept={getAcceptedTypes()}
                  onChange={handleFileChange}
                  className="cursor-pointer"
                />
                {uploadState.file && (
                  <p className="text-sm text-muted-foreground">
                    Selected: {uploadState.file.name}
                  </p>
                )}
              </div>
            )}

            {/* Assessment Result */}
            {renderAssessmentResult()}

            {/* Submit Button */}
            <div className="flex gap-4">
              <Button
                onClick={assessFile}
                disabled={!uploadState.file || !uploadState.subject || uploadState.isUploading}
                className="flex-1"
              >
                {uploadState.isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <UploadIcon className="mr-2 h-4 w-4" />
                    Upload & Assess
                  </>
                )}
              </Button>
              
              <Button
                variant="outline"
                onClick={() => navigate('/content')}
              >
                View Content Library
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Upload;
