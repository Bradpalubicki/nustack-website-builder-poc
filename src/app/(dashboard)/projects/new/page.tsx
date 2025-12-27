'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { NewProjectWizard } from '@/components/projects/NewProjectWizard';

export default function NewProjectPage() {
  const router = useRouter();

  const handleComplete = (projectId: string) => {
    router.push(`/projects/${projectId}/builder`);
  };

  const handleCancel = () => {
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-background">
      <NewProjectWizard onComplete={handleComplete} onCancel={handleCancel} />
    </div>
  );
}
