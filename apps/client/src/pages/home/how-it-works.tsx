

import { CardSpotlight } from "@/components/ui/card-spotlight";
import ScrollStack, { ScrollStackItem } from '@/components/ScrollStack';

const HowItWorks = () => {
    return <section className="py-20 bg-[#0A0A0B]">
        <div className="container mx-auto px-4">
            <div className="text-center mb-16">
                <h2 className="text-3xl text-white mb-4">
                    How It Works
                </h2>
                <p className="text-white/70 max-w-2xl mx-auto">
                    Getting started is easy. Jump into the metaverse in just three
                    simple steps.
                </p>
            </div>

            <div className="max-w-3xl mx-auto">
                <ScrollStack useWindowScroll={true} itemDistance={400} itemStackDistance={24} baseScale={0.9}>
                    <ScrollStackItem itemClassName="!p-0 !bg-transparent !shadow-none">
                        <Step
                            number="01"
                            title="Create Your Avatar"
                            description="Customize your digital identity with unique outfits and accessories."
                            defaultActive
                        />
                    </ScrollStackItem>
                    <ScrollStackItem itemClassName="!p-0 !bg-transparent !shadow-none">
                        <Step
                            number="02"
                            title="Join a Space"
                            description="Enter public squares or create private rooms for you and your friends."
                        />
                    </ScrollStackItem>
                    <ScrollStackItem itemClassName="!p-0 !bg-transparent !shadow-none">
                        <Step
                            number="03"
                            title="Start Exploring"
                            description="Walk around, chat, play games, and attend virtual events."
                        />
                    </ScrollStackItem>
                </ScrollStack>
            </div>
        </div>
    </section>
}

export default HowItWorks


const Step = ({
    number,
    title,
    description,
    defaultActive = false,
}: {
    number: string;
    title: string;
    description: string;
    defaultActive?: boolean;
}) => (
    <CardSpotlight defaultActive={defaultActive} className="w-full h-80 rounded-3xl border border-white/10 bg-[#0A0A0B] p-10 flex flex-col justify-center shadow-2xl shadow-black/80">
        <div className="relative z-20 flex flex-col items-start">
            <div className="mb-6 text-6xl font-bold text-white/10">
                {number}
            </div>
            <h3 className="mb-3 text-2xl font-bold text-white">{title}</h3>
            <p className="text-white/50 text-lg">{description}</p>
        </div>
    </CardSpotlight>
);