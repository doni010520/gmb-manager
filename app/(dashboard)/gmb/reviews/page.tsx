import { getGmbReviews } from "../actions";
import { ReviewsClient } from "./reviews-client";

export default async function ReviewsPage() {
  const reviews = await getGmbReviews();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Avaliacoes</h1>
        <p className="text-muted-foreground">Gerencie as avaliacoes do seu Google Meu Negocio</p>
      </div>
      <ReviewsClient initialReviews={reviews} />
    </div>
  );
}
