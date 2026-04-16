import { testimonials } from '../../../../data/testimonials';

export function generateStaticParams() {
  return testimonials.map((testimonial) => ({ id: String(testimonial.id) }));
}

export default function AdminTestimonialIdLayout({ children }) {
  return children;
}
