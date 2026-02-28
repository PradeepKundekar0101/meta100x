import { useState } from "react";

const faqs = [
    {
        question: "Is it free to join?",
        answer: "Yes! You can join and explore the metaverse for free. Some premium items may require purchase.",
    },
    {
        question: "Can I create my own room?",
        answer: "Absolutely. You can create private rooms to hang out with friends or host meetings.",
    },
    {
        question: "What devices are supported?",
        answer: "Our platform is accessible via any modern web browser on desktop and mobile devices.",
    },
    {
        question: "Is voice chat available?",
        answer: "Yes, we support spatial audio so you can hear people closer to you louder, just like real life.",
    },
];

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState(0);

    return (
        <section className="py-20 bg-[#0A0A0B]">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="grid grid-cols-1 md:grid-cols-[1fr_1.5fr] gap-12 md:gap-20 items-start">
                    <h2 className="text-4xl md:text-5xl text-white tracking-tight leading-[1.1]">
                        Frequently Asked Questions
                    </h2>

                    <div>
                        {faqs.map((faq, i) => (
                            <FAQItem
                                key={i}
                                question={faq.question}
                                answer={faq.answer}
                                isOpen={openIndex === i}
                                onToggle={() => setOpenIndex(openIndex === i ? -1 : i)}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FAQ;

const FAQItem = ({
    question,
    answer,
    isOpen,
    onToggle,
}: {
    question: string;
    answer: string;
    isOpen: boolean;
    onToggle: () => void;
}) => (
    <div className="border-b border-white/10 last:border-0">
        <button
            onClick={onToggle}
            className="flex items-center gap-4 w-full py-5 text-left cursor-pointer"
        >
            <span className="text-blue-400 text-xl shrink-0 w-5 flex items-center justify-center select-none">
                {isOpen ? "—" : "+"}
            </span>
            <span className="text-white text-base md:text-lg font-medium">{question}</span>
        </button>
        <div
            className={`grid transition-all duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
        >
            <div className="overflow-hidden">
                <p className="pl-9 pb-5 text-white/50 text-sm md:text-base leading-relaxed">
                    {answer}
                </p>
            </div>
        </div>
    </div>
);
