function ReviewCard({ quote, source }) {
  return (
    <li className="review-card">
      <p className="review-card-quote">&ldquo;{quote}&rdquo;</p>
      <p className="review-card-source">&mdash; {source}</p>
    </li>
  );
}

export default ReviewCard;
