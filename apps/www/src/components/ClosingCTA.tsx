import { Button } from "@/components/ui/button";

export default function ClosingCTA() {
  return (
    <section className="py-20 bg-indigo-700 text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-8">Start Editing Smarter Today</h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Join thousands of creators who are streamlining their image processing
          workflows with Image Blocks.
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
    </section>
  );
}
