interface Props {
  about: string;
}

export default function AboutSection({
  about,
}: Props) {
  return (
    <>
      <h2 className="mb-4 text-2xl font-bold text-[#1A216D]">
        About
      </h2>

      <p className="leading-6 text-base text-gray-600">
        {about}
      </p>
    </>
  );
}