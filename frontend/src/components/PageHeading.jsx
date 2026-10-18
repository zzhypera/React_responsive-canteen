export default function PageHeading({ eyebrow, title, description, action, compact = false }) {
  return (
    <div className={`page-heading ${compact ? 'page-heading-compact' : ''}`}>
      <div>
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {action && <div className="page-heading-action">{action}</div>}
    </div>
  )
}
