type Props = {
  place: string;
  score: number;
};

export default function RecommendationCard({
  place,
  score,
}: Props) {
  return (
    <div className="bg-gray-200 p-4 rounded">
      <h3 className="font-bold">{place}</h3>
      <p>Eco Score: {score}</p>
    </div>
  );
}