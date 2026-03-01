import { Briefcase, BookOpen, PartyPopper } from "lucide-react";
import { GlowingEffect } from "@/components/ui/glowing-effect";

const useCases = [
    {
        icon: Briefcase,
        label: "Virtual Office",
        title: "Remote Work, Without the Isolation",
        description:
            "Recreate the spontaneous hallway chats and quick desk drop-ins that make offices work. Your team stays visible, approachable, and connected throughout the day\u2014no calendar invite required.",
        iconColor: "text-blue-400",
        area: "md:[grid-area:1/1/2/7]",
    },
    {
        icon: BookOpen,
        label: "Study Groups",
        title: "Focus Together, Anywhere",
        description:
            "Set up a virtual library or study hall where classmates can quietly co-work, then walk over to a friend to ask a quick question or start a group review session with screen sharing.",
        iconColor: "text-emerald-400",
        area: "md:[grid-area:1/7/2/13]",
    },
    {
        icon: PartyPopper,
        label: "Hangouts",
        title: "Just Hang Out, Like You Used To",
        description:
            "Host a watch party, game night, or casual hangout. Pick a fun map, invite your friends, and let the conversations happen naturally as you wander around the space together.",
        iconColor: "text-amber-400",
        area: "md:[grid-area:2/1/3/13]",
    },
];

const UseCases = () => {
    return (
        <section className="py-20 md:py-28 bg-[#0A0A0B] relative overflow-hidden" id="use-cases">
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute -top-60 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-indigo-600/5 blur-[120px]" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-8">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <div className="inline-flex text-[11px] ring-1 ring-white/10 font-medium text-white/70 bg-white/5 rounded-full px-3 py-1.5 mb-6">
                        Use Cases
                    </div>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl text-white tracking-tight leading-[1.1]">
                        Built for Every Kind of Together
                    </h2>
                    <p className="mt-5 text-base md:text-lg text-white/60 leading-relaxed">
                        Whether you are working, studying, or just hanging out, our spaces adapt to how you connect.
                    </p>
                </div>

                <ul className="grid grid-cols-1 grid-rows-none gap-4 md:grid-cols-12 md:grid-rows-2 lg:gap-6">
                    {useCases.map((uc) => (
                        <li key={uc.label} className={`min-h-[14rem] list-none ${uc.area}`}>
                            <div className="relative h-full rounded-2xl border border-white/10 p-2 md:rounded-3xl md:p-3">
                                <GlowingEffect
                                    spread={40}
                                    glow={true}
                                    disabled={false}
                                    proximity={64}
                                    inactiveZone={0.01}
                                />
                                <div className="relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl p-6 md:p-8 shadow-[0px_0px_27px_0px_#2D2D2D]">
                                    <div className="relative flex flex-1 flex-col justify-between gap-3">
                                        <div className="w-fit rounded-lg border border-white/10 p-2">
                                            <uc.icon className={`h-4 w-4 ${uc.iconColor}`} />
                                        </div>
                                        <div className="space-y-3">
                                            <span className="text-xs font-medium uppercase tracking-wider text-white/40 block">
                                                {uc.label}
                                            </span>
                                            <h3 className="text-xl md:text-2xl font-semibold tracking-tight text-white text-balance">
                                                {uc.title}
                                            </h3>
                                            <p className="text-sm md:text-base text-white/50 leading-relaxed">
                                                {uc.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
};

export default UseCases;
