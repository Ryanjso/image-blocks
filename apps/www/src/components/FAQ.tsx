import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Is it really free?",
    answer:
      "Yes! Image Blocks is completely free and open-source. You can use it without any cost or limitations.",
  },
  {
    question: "What macOS versions are supported?",
    answer:
      "Image Blocks supports macOS 10.15 (Catalina) and later versions. We recommend using the latest macOS for the best experience.",
  },
  {
    question: "How do I suggest new blocks or features?",
    answer:
      "You can suggest new blocks or features by opening an issue on our GitHub repository or discussing it in our community Discord channel.",
  },
  {
    question: "Can I contribute to the project?",
    answer:
      "We welcome contributions from developers of all skill levels. Check out our GitHub repository for contribution guidelines and open issues.",
  },
];

export default function FAQ() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          Got Questions? We've Got Answers
        </h2>
        <Accordion type="single" collapsible className="max-w-2xl mx-auto">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
