type Props = {
  title: string;
};

export default function DashboardCard({ title }: Props) {
  return (
    <div className="bg-gray-200 p-10 text-center rounded">
      <h3>{title}</h3>
    </div>
  );
}