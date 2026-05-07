import Link from 'next/link';

export function AdminPageShell({ title, description, actions, children }) {
  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">{title}</h1>
          {description ? <p className="admin-page-desc">{description}</p> : null}
        </div>
        {actions ? <div className="admin-toolbar">{actions}</div> : null}
      </div>
      {children}
    </>
  );
}

export function AdminCard({ title, description, actions, children, tight = false }) {
  return (
    <section className={`admin-card${tight ? ' admin-card--tight' : ''}`}>
      {title || description || actions ? (
        <div className="admin-card__header">
          <div>
            {title ? <h2 className="admin-section-title">{title}</h2> : null}
            {description ? <p className="admin-section-desc">{description}</p> : null}
          </div>
          {actions ? <div className="admin-toolbar">{actions}</div> : null}
        </div>
      ) : null}
      {children}
    </section>
  );
}

export function AdminPrimaryLink({ href, children }) {
  return <Link href={href} className="admin-btn admin-btn--primary">{children}</Link>;
}

export function AdminSecondaryLink({ href, children }) {
  return <Link href={href} className="admin-btn admin-btn--secondary">{children}</Link>;
}
