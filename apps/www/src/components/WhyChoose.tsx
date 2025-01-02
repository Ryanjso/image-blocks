import { CheckCircle } from "lucide-react";

const reasons = [
  "Free and Open Source: Transparency and no cost.",
  "Designed for Mac: Optimized for macOS performance.",
  "Intuitive Drag-and-Drop Interface: No steep learning curve.",
  "Flexible and Customizable: Create workflows tailored to your needs.",
];

export default function WhyChoose() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          Why Creators Love Image Blocks
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {reasons.map((reason, index) => (
            <div key={index} className="flex items-start">
              <CheckCircle className="w-6 h-6 text-indigo-600 mr-4 flex-shrink-0" />
              <p className="text-lg">{reason}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
