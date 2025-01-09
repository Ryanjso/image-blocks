import { Button } from "@/components/ui/button";
import { MAC_DOWNLOAD_URL } from "@/constants";
import Link from "next/link";
import { Github } from "lucide-react";

export default function ClosingCTA() {
  return (
    <section className="py-20 bg-indigo-700 text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-8">Start Editing Smarter Today</h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Join thousands of creators who are streamlining their image processing
          workflows with Image Blocks.
        </p>
        <div className="space-x-4 flex justify-center">
          <Link href={MAC_DOWNLOAD_URL} passHref>
            <Button size="lg" variant={"secondary"}>
              Download for Mac
            </Button>
          </Link>
          <Button size="lg" variant="outline">
            <Github className="mr-2" />
            View on GitHub
          </Button>
        </div>
      </div>
    </section>
  );
}
