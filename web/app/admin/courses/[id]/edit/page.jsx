'use client';

import { useParams } from 'next/navigation';
import AdminCourseEditor from '../../../../../components/admin/AdminCourseEditor';

export default function LegacyCourseEditPage() {
  const { id } = useParams();
  return <AdminCourseEditor routeId={id} />;
}
