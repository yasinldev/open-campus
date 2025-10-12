import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { FacultyApplication, FacultyDocument } from '@/types/faculty';

export function useFacultyApplication() {
  const [application, setApplication] = useState<FacultyApplication | null>(null);
  const [documents, setDocuments] = useState<FacultyDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    fetchApplication();
  }, []);

  const fetchApplication = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setError('Not authenticated');
        return;
      }

      // Fetch application
      const { data: appData, error: appError } = await supabase
        .from('faculty_applications')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (appError && appError.code !== 'PGRST116') {
        throw appError;
      }

      setApplication(appData);

      // Fetch documents if application exists
      if (appData) {
        const { data: docsData, error: docsError } = await supabase
          .from('faculty_documents')
          .select('*')
          .eq('application_id', appData.id)
          .order('display_order', { ascending: true });

        if (docsError) throw docsError;
        setDocuments(docsData || []);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createApplication = async (data: Partial<FacultyApplication>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: newApp, error } = await supabase
        .from('faculty_applications')
        .insert({
          user_id: user.id,
          ...data,
        })
        .select()
        .single();

      if (error) throw error;
      setApplication(newApp);
      return newApp;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const updateApplication = async (data: Partial<FacultyApplication>) => {
    try {
      if (!application) throw new Error('No application to update');

      const { data: updated, error } = await supabase
        .from('faculty_applications')
        .update(data)
        .eq('id', application.id)
        .select()
        .single();

      if (error) throw error;
      setApplication(updated);
      return updated;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const uploadDocument = async (
    documentType: string,
    title: string,
    file: File,
    description?: string
  ) => {
    try {
      if (!application) throw new Error('No application found');
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Upload file to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${documentType}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('faculty-applications')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Create document record
      const { data: doc, error: docError } = await supabase
        .from('faculty_documents')
        .insert({
          application_id: application.id,
          document_type: documentType,
          title,
          description,
          file_path: filePath,
          file_size: file.size,
          mime_type: file.type,
          display_order: documents.length,
        })
        .select()
        .single();

      if (docError) throw docError;
      setDocuments([...documents, doc]);
      return doc;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const deleteDocument = async (documentId: string) => {
    try {
      const doc = documents.find(d => d.id === documentId);
      if (!doc) throw new Error('Document not found');

      // Delete file from storage
      if (doc.file_path) {
        await supabase.storage
          .from('faculty-applications')
          .remove([doc.file_path]);
      }

      // Delete document record
      const { error } = await supabase
        .from('faculty_documents')
        .delete()
        .eq('id', documentId);

      if (error) throw error;
      setDocuments(documents.filter(d => d.id !== documentId));
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const submitApplication = async () => {
    try {
      if (!application) throw new Error('No application to submit');

      const { data: updated, error } = await supabase
        .from('faculty_applications')
        .update({
          status: 'submitted',
          submitted_at: new Date().toISOString(),
        })
        .eq('id', application.id)
        .select()
        .single();

      if (error) throw error;
      setApplication(updated);
      return updated;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  return {
    application,
    documents,
    loading,
    error,
    createApplication,
    updateApplication,
    uploadDocument,
    deleteDocument,
    submitApplication,
    refetch: fetchApplication,
  };
}

