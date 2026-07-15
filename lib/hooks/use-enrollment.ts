'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export interface Enrollment {
  id: string;
  user_id: string;
  course_id: string;
  status: 'active' | 'completed' | 'dropped';
  progress_percentage: number;
  started_at: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

export function useEnrollment(courseId?: string) {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [currentEnrollment, setCurrentEnrollment] = useState<Enrollment | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const supabase = createClient();

  // Load enrollments
  useEffect(() => {
    if (!courseId) {
      setLoading(true);
      loadAllEnrollments();
    } else {
      setLoading(true);
      checkEnrollment(courseId);
    }
  }, [courseId]);

  // Load all user enrollments
  const loadAllEnrollments = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('enrollments')
        .select('*')
        .eq('user_id', user.id)
        .order('started_at', { ascending: false });

      if (error) throw error;
      setEnrollments(data || []);
    } catch (error) {
      console.error('Error loading enrollments:', error);
    } finally {
      setLoading(false);
    }
  };

  // Check if user is enrolled in a specific course
  const checkEnrollment = async (courseId: string) => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('enrollments')
        .select('*')
        .eq('user_id', user.id)
        .eq('course_id', courseId)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows
        throw error;
      }

      setCurrentEnrollment(data);
    } catch (error) {
      console.error('Error checking enrollment:', error);
    } finally {
      setLoading(false);
    }
  };

  // Enroll in a course
  const enroll = async (courseId: string) => {
    setEnrolling(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Not authenticated');
      }

      // Check if already enrolled
      const { data: existing } = await supabase
        .from('enrollments')
        .select('id')
        .eq('user_id', user.id)
        .eq('course_id', courseId)
        .single();

      if (existing) {
        throw new Error('Already enrolled in this course');
      }

      // Create enrollment
      const { data, error } = await supabase
        .from('enrollments')
        .insert({
          user_id: user.id,
          course_id: courseId,
          status: 'active',
          progress_percentage: 0,
        })
        .select()
        .single();

      if (error) throw error;

      setCurrentEnrollment(data);
      return data;
    } catch (error: any) {
      console.error('Error enrolling:', error);
      throw error;
    } finally {
      setEnrolling(false);
    }
  };

  // Update enrollment progress
  const updateProgress = async (courseId: string, progress: number) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Not authenticated');
      }

      const updateData: any = {
        progress_percentage: Math.min(100, Math.max(0, progress)),
        updated_at: new Date().toISOString(),
      };

      // If 100%, mark as completed
      if (progress >= 100) {
        updateData.status = 'completed';
        updateData.completed_at = new Date().toISOString();
      }

      const { data, error } = await supabase
        .from('enrollments')
        .update(updateData)
        .eq('user_id', user.id)
        .eq('course_id', courseId)
        .select()
        .single();

      if (error) throw error;

      setCurrentEnrollment(data);
      return data;
    } catch (error) {
      console.error('Error updating progress:', error);
      throw error;
    }
  };

  // Drop/unenroll from course
  const unenroll = async (courseId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Not authenticated');
      }

      const { error } = await supabase
        .from('enrollments')
        .update({
          status: 'dropped',
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id)
        .eq('course_id', courseId);

      if (error) throw error;

      setCurrentEnrollment(null);
    } catch (error) {
      console.error('Error dropping course:', error);
      throw error;
    }
  };

  // Check if enrolled
  const isEnrolled = !!currentEnrollment && currentEnrollment.status === 'active';

  return {
    enrollments,
    currentEnrollment,
    isEnrolled,
    loading,
    enrolling,
    enroll,
    updateProgress,
    unenroll,
    refresh: courseId ? () => checkEnrollment(courseId) : loadAllEnrollments,
  };
}
