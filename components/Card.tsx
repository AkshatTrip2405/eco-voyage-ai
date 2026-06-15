interface CardProps {
  title: string;
  description: string;
}

export default function Card({ title, description }: CardProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition duration-300">
      <h3 className="text-2xl font-bold text-gray-900 mb-3">
        {title}
      </h3>

      <p className="text-gray-700">
        {description}
      </p>
    </div>
  );
}