const PageHero = ({ eyebrow, title, subtitle, compact = false, children }) => {
  return (
    <section className={`hero-section ${compact ? 'compact' : ''}`}>
      <div className="hero-copy">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="page-title">{title}</h1>
        {subtitle && <p className="page-subtitle">{subtitle}</p>}
      </div>
      {children}
    </section>
  );
};

export default PageHero;
