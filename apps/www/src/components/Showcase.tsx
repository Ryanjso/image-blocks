import Image from "next/image";

const examples = [
  {
    title: "Photographers",
    description: "Streamlining workflows for efficient editing.",
  },
  {
    title: "Web Developers",
    description: "Optimizing images for faster websites.",
  },
  {
    title: "Graphic Designers",
    description: "Simplifying bulk edits for consistency.",
  },
];

export default function Showcase() {
  return (
    <section className="py-20 bg-slate-100">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          Perfect for Every Image Processing Need
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {examples.map((example, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <Image
                src="/placeholder.svg"
                alt={example.title}
                width={400}
                height={300}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{example.title}</h3>
                <p className="text-slate-600">{example.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
