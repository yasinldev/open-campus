'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, Search, Eye, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { getStatusLabel, getStatusVariant } from '@/types/faculty';
import type { FacultyApplication } from '@/types/faculty';

export default function FacultyReviewsPage() {
  const params = useParams();
  const locale = params.locale as string;
  const isEnglish = locale === 'en';
  const supabase = createClient();

  const [applications, setApplications] = useState<FacultyApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('faculty_applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (error) {
      console.error('Failed to fetch applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.field_of_expertise?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.user_id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: applications.length,
    pending: applications.filter((a) => ['submitted', 'in_review'].includes(a.status)).length,
    approved: applications.filter((a) => ['approved_fellow', 'approved_faculty'].includes(a.status)).length,
    rejected: applications.filter((a) => a.status === 'rejected').length,
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="mb-2 text-3xl font-bold tracking-tight text-foreground">
          {isEnglish ? 'Faculty Application Reviews' : 'Öğretim Görevlisi Başvuru İncelemeleri'}
        </h1>
        <p className="text-muted-foreground">
          {isEnglish
            ? 'Review and manage faculty applications'
            : 'Öğretim görevlisi başvurularını inceleyin ve yönetin'}
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>{isEnglish ? 'Total Applications' : 'Toplam Başvuru'}</CardDescription>
            <CardTitle className="text-3xl">{stats.total}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>{isEnglish ? 'Pending Review' : 'İnceleme Bekleyen'}</CardDescription>
            <CardTitle className="text-3xl text-yellow-600">{stats.pending}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>{isEnglish ? 'Approved' : 'Onaylanan'}</CardDescription>
            <CardTitle className="text-3xl text-green-600">{stats.approved}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>{isEnglish ? 'Rejected' : 'Reddedilen'}</CardDescription>
            <CardTitle className="text-3xl text-red-600">{stats.rejected}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="flex-1">
              <Label htmlFor="search">{isEnglish ? 'Search' : 'Ara'}</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder={isEnglish ? 'Search by field or user ID...' : 'Alan veya kullanıcı ID\'sine göre ara...'}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div className="w-full sm:w-[200px]">
              <Label htmlFor="status">{isEnglish ? 'Status' : 'Durum'}</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{isEnglish ? 'All Statuses' : 'Tüm Durumlar'}</SelectItem>
                  <SelectItem value="submitted">{isEnglish ? 'Submitted' : 'Gönderildi'}</SelectItem>
                  <SelectItem value="in_review">{isEnglish ? 'In Review' : 'İncelemede'}</SelectItem>
                  <SelectItem value="pilot_active">{isEnglish ? 'Pilot Active' : 'Pilot Aktif'}</SelectItem>
                  <SelectItem value="approved_fellow">{isEnglish ? 'Approved Fellow' : 'Onaylanan Fellow'}</SelectItem>
                  <SelectItem value="rejected">{isEnglish ? 'Rejected' : 'Reddedilen'}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Applications List */}
      <div className="space-y-4">
        {filteredApplications.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground">
                {isEnglish ? 'No applications found' : 'Başvuru bulunamadı'}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredApplications.map((app) => (
            <Card key={app.id} className="border-border/50">
              <CardContent className="p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold text-foreground">
                        {app.field_of_expertise || (isEnglish ? 'No field specified' : 'Alan belirtilmedi')}
                      </h3>
                      <Badge variant={getStatusVariant(app.status)}>
                        {getStatusLabel(app.status, locale)}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        {app.status === 'submitted' ? (
                          <Clock className="h-4 w-4" />
                        ) : app.status === 'approved_fellow' || app.status === 'approved_faculty' ? (
                          <CheckCircle2 className="h-4 w-4" />
                        ) : app.status === 'rejected' ? (
                          <XCircle className="h-4 w-4" />
                        ) : (
                          <Clock className="h-4 w-4" />
                        )}
                        <span>{new Date(app.created_at).toLocaleDateString(locale === 'en' ? 'en-US' : 'tr-TR')}</span>
                      </div>
                      <div>
                        <span className="font-medium">{isEnglish ? 'Score:' : 'Puan:'}</span> {app.total_score}/100
                      </div>
                      <div>
                        <span className="font-medium">{isEnglish ? 'Experience:' : 'Deneyim:'}</span>{' '}
                        {app.teaching_experience_years} {isEnglish ? 'years' : 'yıl'}
                      </div>
                      <div>
                        <span className="font-medium">{isEnglish ? 'Reviews:' : 'İnceleme:'}</span> {app.review_count}/
                        {app.review_required_count}
                      </div>
                    </div>
                    {app.motivation && (
                      <p className="text-sm text-muted-foreground line-clamp-2">{app.motivation}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="mr-2 h-4 w-4" />
                      {isEnglish ? 'View' : 'Görüntüle'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

