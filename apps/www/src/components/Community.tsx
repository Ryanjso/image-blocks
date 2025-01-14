import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";

export default function Community() {
  return (
    <section className="py-20 bg-indigo-700 text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-8">
          Join a Growing Community of Creators
        </h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Image Blocks is open-source and community-driven. Contribute, suggest
          features, and be part of our journey to make image processing
          accessible to everyone.
        </p>
        <div className="space-x-4">
          <Button size="lg" variant={"secondary"}>
            <Github className="mr-2" />
            View on GitHub
          </Button>
        </div>
      </div>
    </section>
  );
}
