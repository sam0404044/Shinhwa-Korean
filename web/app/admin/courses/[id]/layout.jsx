import { courses } from '../../../../data/courses';

export function generateStaticParams() {
  return courses.map((course) => ({ id: String(course.id) }));
}

export default function AdminCourseIdLayout({ children }) {
  return children;
}
