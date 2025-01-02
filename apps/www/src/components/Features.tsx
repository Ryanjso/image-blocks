import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ScalingIcon as Resize,
  Crop,
  FileText,
  FileImage,
  FileType2,
  FileX,
} from "lucide-react";

const features = [
  {
    title: "Resize Image",
    description: "Quickly adjust dimensions to your needs.",
    icon: Resize,
  },
  {
    title: "Trim Transparent Pixels",
    description: "Remove unwanted space around images.",
    icon: Crop,
  },
  {
    title: "Rename Images in Bulk",
    description: "Stay organized with ease.",
    icon: FileText,
  },
  {
    title: "Compress Images",
    description: "Optimize files without losing quality.",
    icon: FileImage,
  },
  {
    title: "Convert Formats",
    description: "Seamlessly change file types.",
    icon: FileType2,
  },
  {
    title: "Remove Metadata",
    description: "Protect your privacy with one click.",
    icon: FileX,
  },
];

export default function Features() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          Streamline Your Image Processing with Customizable Blocks
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index}>
              <CardHeader>
                <feature.icon className="w-10 h-10 text-indigo-600 mb-2" />
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
