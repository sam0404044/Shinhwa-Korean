import { plans } from '../../../../data/plans';

export function generateStaticParams() {
  return plans.map((plan) => ({ id: String(plan.id) }));
}

export default function AdminPlanIdLayout({ children }) {
  return children;
}
