import { ArrowRight } from 'lucide-react'

const CTA = () => {
    return (
        <section className="py-20 md:py-28 bg-[#0A0A0B] relative overflow-hidden">
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-blue-600/8 blur-[120px]" />
                <div className="absolute -bottom-40 right-0 w-[400px] h-[400px] rounded-full bg-indigo-500/6 blur-[100px]" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
                    <div className="max-w-lg">
                        <div className="inline-flex text-[11px] ring-1 ring-white/10 font-medium text-white/70 bg-white/5 rounded-full px-3 py-1.5 mb-6">
                            Get Started
                        </div>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl text-white tracking-tight leading-[1.1]">
                            Ready to Dive In?
                        </h2>
                        <p className="mt-5 text-base md:text-lg text-white/60 leading-relaxed">
                            Join thousands of users already exploring the future of social
                            interaction.
                        </p>
                        <div className="mt-8 flex flex-wrap gap-3">
                            <a
                                href="/createroom"
                                className="inline-flex items-center gap-2 rounded-full bg-white text-neutral-900 px-6 py-3 text-sm font-semibold hover:bg-neutral-100 transition-colors"
                            >
                                Get Started Now
                                <ArrowRight className="w-4 h-4" />
                            </a>
                            <a
                                href="#resources"
                                className="inline-flex items-center gap-2 rounded-full bg-white/10 text-white ring-1 ring-white/15 px-6 py-3 text-sm font-medium hover:bg-white/15 transition-colors"
                            >
                                Learn More
                            </a>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-blue-500/10 via-transparent to-indigo-500/10 blur-2xl" />
                        <div className="relative rounded-2xl overflow-hidden ring-1 ring-white/10">
                            <img
                                src="/cta.png"
                                alt="Virtual metaverse world"
                                className="w-full h-full object-cover aspect-[4/3]"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0B]/60 via-transparent to-transparent" />

                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default CTA
