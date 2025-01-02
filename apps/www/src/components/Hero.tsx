import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="bg-indigo-700 text-white py-20">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-10 md:mb-0">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Effortless Image Editing and Processing for Mac
          </h1>
          <p className="text-xl mb-8">
            Drag, Drop, and Customize Image Workflows with Open-Source Power.
          </p>
          <div className="space-x-4">
            <Button
              size="lg"
              className="bg-white text-indigo-700 hover:bg-indigo-100"
            >
              Download for Free
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-white border-white hover:bg-indigo-600"
            >
              View on GitHub
            </Button>
          </div>
        </div>
        <div className="md:w-1/2">
          <Image
            src="/placeholder.svg"
            alt="Image Blocks App Screenshot"
            width={600}
            height={400}
            className="rounded-lg shadow-xl"
          />
        </div>
      </div>
    </section>
  );
}
