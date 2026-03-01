import { MessageSquareText, UserRound, Monitor } from "lucide-react";

const features = [
    {
        icon: MessageSquareText,
        title: "Organic Proximity Chat",
        description:
            "Forget clunky meeting links. Just walk your avatar up to someone to instantly connect via video and audio. Walk away, and the conversation naturally fades.",
        accent: "orange",
    },
    {
        icon: UserRound,
        title: "Express Yourself",
        description:
            "Ditch the boring profile pictures. Pick a unique avatar that matches your vibe\u2014from a snowman to a zombie\u2014and hang out in customizable environments like a sunny garden or a winter wonderland.",
        accent: "indigo",
    },
    {
        icon: Monitor,
        title: "Seamless Collaboration",
        description:
            "Need to work through a problem? Instantly share your screen or drop a message in the global text chat. Everything you need to collaborate, built right into the browser.",
        accent: "emerald",
    },
];

const Features = () => {
    return (
        <section className="overflow-hidden lg:py-32 bg-cover pt-16 pb-16 relative" id="resources">
            <div className="pointer-events-none z-0 absolute inset-0">
                <div className="absolute inset-y-0 left-[12.5%] w-px bg-gradient-to-b from-transparent via-white/5 to-transparent"></div>
                <div className="absolute inset-y-0 left-[37.5%] w-px bg-gradient-to-b from-transparent via-white/5 to-transparent"></div>
                <div className="absolute inset-y-0 left-1/2 w-px bg-gradient-to-b from-transparent via-white/8 to-transparent"></div>
                <div className="absolute inset-y-0 left-[62.5%] w-px bg-gradient-to-b from-transparent via-white/5 to-transparent"></div>
                <div className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-8">
                <div className="max-w-3xl">
                    <div className="inline-flex text-[11px] ring-1 ring-white/10 animate-on-scroll [animation:fadeSlideIn_1s_ease-out_0.05s_both] font-medium text-white/70 font-geist bg-white/5 rounded-full pt-1.5 pr-3 pb-1.5 pl-3 gap-x-2 gap-y-2 items-center">
                        Features
                    </div>
                    <h2 className="mt-4 sm:text-5xl md:text-6xl text-4xl font-normal tracking-tighter font-geist animate-on-scroll [animation:fadeSlideIn_1s_ease-out_0.15s_both] text-white">
                        Why Choose Us?
                    </h2>
                    <p className="md:mt-4 mt-3 md:text-lg text-base text-white/70 leading-relaxed font-geist animate-on-scroll [animation:fadeSlideIn_1s_ease-out_0.25s_both]">
                        Built for teams, friends, and communities who want connection that feels real.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mt-10">
                    {features.map((feature, i) => (
                        <div
                            key={feature.title}
                            className="group md:p-6 overflow-hidden animate-on-scroll bg-slate-900/50 ring-white/10 ring-1 rounded-3xl p-5 backdrop-blur-md hover:ring-white/20 transition-all duration-300"
                            style={{ animation: `fadeSlideIn 1s ease-out ${0.2 + i * 0.08}s both` }}
                        >
                            <div className="w-10 h-10 rounded-xl bg-white/5 ring-1 ring-white/10 flex items-center justify-center mb-5 group-hover:bg-indigo-500/10 group-hover:ring-indigo-500/20 transition-all duration-300">
                                <feature.icon className="w-5 h-5 text-indigo-400" />
                            </div>
                            <h3 className="text-xl md:text-2xl font-normal tracking-tighter font-geist text-white">
                                {feature.title}
                            </h3>
                            <p className="mt-3 text-sm text-white/70 font-geist leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;
