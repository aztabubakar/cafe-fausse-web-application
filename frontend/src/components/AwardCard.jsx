function AwardCard({ title, year, source }) {
  return (
    <li className="award-card">
      <p className="award-card-title">{title}</p>
      <p className="award-card-meta">
        {source ? `${source}, ` : ""}
        {year}
      </p>
    </li>
  );
}

export default AwardCard;
