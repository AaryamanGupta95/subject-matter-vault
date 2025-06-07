
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Image, Video, Search, Filter, Upload as UploadIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface UploadedFile {
  id: string;
  subject: string;
  fileName: string;
  fileType: 'text' | 'image' | 'video';
  uploadDate: string;
  status: string;
}

const Content = () => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [filteredFiles, setFilteredFiles] = useState<UploadedFile[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedFileType, setSelectedFileType] = useState<string>('all');
  
  const navigate = useNavigate();

  // Load files from localStorage on component mount
  useEffect(() => {
    const storedFiles = JSON.parse(localStorage.getItem('uploadedFiles') || '[]');
    setFiles(storedFiles);
    setFilteredFiles(storedFiles);
  }, []);

  // Filter files based on search term, subject, and file type
  useEffect(() => {
    let filtered = files;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(file =>
        file.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        file.subject.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by subject
    if (selectedSubject !== 'all') {
      filtered = filtered.filter(file => file.subject === selectedSubject);
    }

    // Filter by file type
    if (selectedFileType !== 'all') {
      filtered = filtered.filter(file => file.fileType === selectedFileType);
    }

    setFilteredFiles(filtered);
  }, [files, searchTerm, selectedSubject, selectedFileType]);

  const getFileTypeIcon = (type: string) => {
    switch (type) {
      case 'text':
        return <FileText className="h-5 w-5" />;
      case 'image':
        return <Image className="h-5 w-5" />;
      case 'video':
        return <Video className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  const getSubjectColor = (subject: string) => {
    const colors: { [key: string]: string } = {
      'mathematics': 'bg-blue-100 text-blue-800',
      'science': 'bg-green-100 text-green-800',
      'english': 'bg-purple-100 text-purple-800',
      'history': 'bg-orange-100 text-orange-800',
      'geography': 'bg-teal-100 text-teal-800',
      'art': 'bg-pink-100 text-pink-800',
      'music': 'bg-yellow-100 text-yellow-800',
      'physical-education': 'bg-red-100 text-red-800'
    };
    return colors[subject] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getUniqueSubjects = () => {
    const subjects = [...new Set(files.map(file => file.subject))];
    return subjects.sort();
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedSubject('all');
    setSelectedFileType('all');
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Content Library</h1>
              <p className="text-muted-foreground">
                Browse and manage your uploaded educational content
              </p>
            </div>
            <Button onClick={() => navigate('/')}>
              <UploadIcon className="mr-2 h-4 w-4" />
              Upload New Content
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters & Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search files..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>

              {/* Subject Filter */}
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger>
                  <SelectValue placeholder="All subjects" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subjects</SelectItem>
                  {getUniqueSubjects().map(subject => (
                    <SelectItem key={subject} value={subject}>
                      {subject.charAt(0).toUpperCase() + subject.slice(1).replace('-', ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* File Type Filter */}
              <Select value={selectedFileType} onValueChange={setSelectedFileType}>
                <SelectTrigger>
                  <SelectValue placeholder="All file types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All File Types</SelectItem>
                  <SelectItem value="text">Text Documents</SelectItem>
                  <SelectItem value="image">Images</SelectItem>
                  <SelectItem value="video">Videos</SelectItem>
                </SelectContent>
              </Select>

              {/* Clear Filters */}
              <Button variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            Showing {filteredFiles.length} of {files.length} files
          </p>
        </div>

        {/* Content Grid */}
        {filteredFiles.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Content Found</h3>
              <p className="text-muted-foreground text-center mb-4">
                {files.length === 0 
                  ? "You haven't uploaded any content yet. Start by uploading your first file!"
                  : "No files match your current filters. Try adjusting your search criteria."
                }
              </p>
              <Button onClick={() => navigate('/')}>
                <UploadIcon className="mr-2 h-4 w-4" />
                Upload Content
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFiles.map((file) => (
              <Card key={file.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {getFileTypeIcon(file.fileType)}
                      <CardTitle className="text-lg truncate">
                        {file.fileName}
                      </CardTitle>
                    </div>
                  </div>
                  <Badge 
                    variant="secondary" 
                    className={`w-fit ${getSubjectColor(file.subject)}`}
                  >
                    {file.subject.charAt(0).toUpperCase() + file.subject.slice(1).replace('-', ' ')}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">File Type:</span>
                      <span className="capitalize">{file.fileType}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Uploaded:</span>
                      <span>{formatDate(file.uploadDate)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Status:</span>
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        {file.status}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t">
                    <Button variant="outline" size="sm" className="w-full">
                      View File
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Content;
