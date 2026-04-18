import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

const faqs = [
  { q: "What is homeopathy?", a: "Homeopathy is a scientific approach to medicine based on the principle that substances which cause symptoms in healthy people can cure similar symptoms in sick people when given in highly diluted forms. It was developed by German physician Dr. Samuel Hahnemann in the 18th century." },
  { q: "How do Homeopathy medicines work?", a: "Homeopathic medicines work by stimulating the body's own healing mechanisms. They are prepared through a process of serial dilution and succussion, which is believed to enhance their therapeutic properties while minimizing side effects." },
  { q: "Does Homeopathic medicine act slowly?", a: "The idea that homeopathic remedies take time to work is inaccurate. They act quickly, but the impact lasts a long time. The length of time needed for relief varies according to how chronic the condition is." },
  { q: "Are there any diet restrictions while taking Homeopathy medicines?", a: "Patients are advised to avoid eating or drinking 15 minutes before or after taking medicine. Coffee, raw onion, raw garlic, paan, and tobacco should be avoided as these can hinder the action of homeopathic medicine." },
  { q: "Is it a fact that Homeopathic medicines don't have any side effects?", a: "Homeopathic medicines do not have any side effects. Unlike conventional treatments, they target the underlying cause of the problem and are chosen to match the patient's symptoms as closely as possible." },
  { q: "Are homeopathy medicines safe for children?", a: "Yes, homeopathy medicines are safe for everyone, even children. They are extremely mild, safe, and efficient. They are particularly beneficial for children because they work by boosting a child's vitality." },
];

const FAQSection = () => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section className="py-20" ref={ref}>
      <div className="container mx-auto px-4 max-w-4xl">
        <div className={`text-center mb-12 transition-all duration-1000 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}>
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-[2px] w-8 bg-primary/20" />
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Knowledge Base</span>
            <div className="h-[2px] w-8 bg-primary/20" />
          </div>
          
          <h2 className="text-4xl md:text-5xl font-black text-primary uppercase font-heading leading-tight mb-4">
            Medical Insights & FAQs
          </h2>
          
          <p className="text-slate-500 text-lg max-w-2xl mx-auto font-medium">
            We are here to clear your doubts and guide you towards a journey of permanent healing.
          </p>
        </div>

        <Accordion type="single" collapsible className={`mt-10 transition-all duration-700 ${isVisible ? "animate-fade-in-up opacity-100" : "opacity-0"}`} style={{ animationDelay: "200ms" }}>
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`faq-${i}`} className="hover:bg-muted/50 transition-colors duration-300 rounded-lg px-2">
              <AccordionTrigger className="text-left font-heading font-semibold text-foreground hover:text-primary transition-colors duration-300">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQSection;
