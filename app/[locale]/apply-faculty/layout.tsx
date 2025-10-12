import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export default async function ApplyFacultyLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Redirect to auth if not logged in
  if (!user) {
    redirect(`/${params.locale}/auth`);
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {children}
      </div>
    </div>
  );
}

