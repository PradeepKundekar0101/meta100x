import { useState } from "react";

const faqs = [
    {
        question: "Do my friends need to download an app to join?",
        answer: "Not at all! It is entirely web-based. They just need the Space ID to jump into the map directly from their browser.",
    },
    {
        question: "How exactly does the proximity video work?",
        answer: "It mimics real life. When your avatar gets close to another player, a private communication bubble forms, automatically turning on your video and audio.",
    },
    {
        question: "Can we present work to each other?",
        answer: "Yes! Whenever you are in an active conversation with someone, you can easily share your screen to present code, slide decks, or designs.",
    },
    {
        question: "Is there a text chat feature if I can't use my microphone?",
        answer: "Absolutely. We have a built-in chat window so you can type messages to people nearby or broadcast to the whole room.",
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
