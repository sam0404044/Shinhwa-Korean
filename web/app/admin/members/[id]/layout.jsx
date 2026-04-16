import { members } from '../../../../data/members';

export function generateStaticParams() {
  return members.map((member) => ({ id: String(member.id) }));
}

export default function AdminMemberIdLayout({ children }) {
  return children;
}
