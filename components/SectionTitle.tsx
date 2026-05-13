type Props = {
  title: string;
  description?: string;
};

export default function SectionTitle({ title, description }: Props) {
  return (
    <div className="mb-8">
      <h2 className="text-2xl md:text-3xl font-bold text-black">{title}</h2>

      {description && <p className="text-gray mt-2 max-w-2xl">{description}</p>}
    </div>
  );
}
