import Image from "next/image";

const steps = [
  {
    title: "Drag Your Images",
    description: "Import files directly into the app.",
  },
  {
    title: "Add Blocks",
    description: "Customize your workflow with drag-and-drop simplicity.",
  },
  { title: "Export Results", description: "Let Image Blocks handle the rest." },
];

export default function HowItWorks() {
  return (
    <section className="py-20 bg-slate-100">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          How It Works in 3 Simple Steps
        </h2>
        <div className="flex flex-col md:flex-row justify-evenly items-center md:space-x-4 max-w-7xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="mb-8 md:mb-0 text-center">
              <div className="bg-indigo-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                {index + 1}
              </div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-slate-600">{step.description}</p>
            </div>
          ))}
        </div>
        <div className="mt-12">
          <Image
            src="/placeholder.svg"
            alt="How Image Blocks Works"
            width={800}
            height={400}
            className="rounded-lg shadow-xl mx-auto"
          />
        </div>
      </div>
    </section>
  );
}
