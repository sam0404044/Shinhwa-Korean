import { instructors } from '../../../../data/instructors';

export function generateStaticParams() {
  return instructors.map((instructor) => ({ id: String(instructor.id) }));
}

export default function AdminInstructorIdLayout({ children }) {
  return children;
}
