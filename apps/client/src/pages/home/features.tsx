const Features = () => {
    return (
        <section className="overflow-hidden lg:py-32 bg-cover pt-16 pb-16 relative " id="resources">

            {/* Decorative grid lines */}
            <div className="pointer-events-none z-0 absolute inset-0">
                <div className="absolute inset-y-0 left-[12.5%] w-px bg-gradient-to-b from-transparent via-white/5 to-transparent"></div>
                <div className="absolute inset-y-0 left-[37.5%] w-px bg-gradient-to-b from-transparent via-white/5 to-transparent"></div>
                <div className="absolute inset-y-0 left-1/2 w-px bg-gradient-to-b from-transparent via-white/8 to-transparent"></div>
                <div className="absolute inset-y-0 left-[62.5%] w-px bg-gradient-to-b from-transparent via-white/5 to-transparent"></div>
                <div className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-8">
                {/* Section header */}
                <div className="max-w-3xl">
                    <div className="inline-flex text-[11px] ring-1 ring-white/10 animate-on-scroll [animation:fadeSlideIn_1s_ease-out_0.05s_both] font-medium text-white/70 font-geist bg-white/5 rounded-full pt-1.5 pr-3 pb-1.5 pl-3 gap-x-2 gap-y-2 items-center">Features</div>
                    <h2 className="mt-4 sm:text-5xl md:text-6xl text-4xl font-normal tracking-tighter font-geist animate-on-scroll [animation:fadeSlideIn_1s_ease-out_0.15s_both] text-white">
                        Why Choose Our Metaverse?
                    </h2>
                    <p className="md:mt-4 mt-3 md:text-lg text-base text-white/70 leading-relaxed font-geist animate-on-scroll [animation:fadeSlideIn_1s_ease-out_0.25s_both]">
                        Experience features designed to bring people together in a fun, interactive, and secure environment.
                    </p>
                </div>

                {/* Features grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mt-10 gap-x-6 gap-y-6">
                    {/* Card 1 */}
                    <div className="md:p-6 overflow-hidden animate-on-scroll [animation:fadeSlideIn_1s_ease-out_0.2s_both] bg-slate-900/50 ring-white/10 ring-1 rounded-3xl pt-5 pr-5 pb-5 pl-5 backdrop-blur-md">
                        <h3 className="text-xl md:text-2xl font-normal tracking-tighter font-geist text-white">Real-time Interaction</h3>
                        <p className="mt-2 text-sm text-white/70 font-geist">
                            Connect with friends and meet new people instantly through voice, video, and chat.
                        </p>

                        {/* Mini transcript UI */}
                        <div className="mt-5 rounded-2xl bg-black/30 ring-1 ring-white/10 p-4">
                            <div className="flex items-center justify-between">
                                <div className="inline-flex items-center gap-2 text-xs text-slate-300 font-geist">
                                    <svg className="w-4 h-4 opacity-80" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M2 10v3"></path>
                                        <path d="M6 6v11"></path>
                                        <path d="M10 3v18"></path>
                                        <path d="M14 8v7"></path>
                                        <path d="M18 5v13"></path>
                                        <path d="M22 10v3"></path>
                                    </svg>
                                    Real-time
                                </div>
                                <div className="inline-flex items-center gap-2 bg-white/5 ring-1 ring-white/10 px-2 py-1 rounded-full">
                                    <div className="w-1.5 h-1.5 rounded-full bg-orange-300"></div>
                                    <span className="text-[10px] text-slate-200 font-geist">Live</span>
                                </div>
                            </div>
                            <div className="mt-3 space-y-2">
                                <div className="h-2.5 rounded bg-white/10"></div>
                                <div className="h-2.5 rounded bg-white/10 w-11/12"></div>
                                <div className="h-2.5 rounded bg-white/10 w-4/5"></div>
                                <div className="h-2.5 rounded bg-white/10 w-3/4"></div>
                            </div>
                        </div>
                    </div>

                    {/* Card 2 (highlight) */}
                    <div className="relative rounded-3xl overflow-hidden ring-1 ring-white/15 bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-md animate-on-scroll [animation:fadeSlideIn_1s_ease-out_0.28s_both]">
                        <div className="absolute inset-0">
                            <img src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/459579f4-e2d0-4218-a12d-f974a4b89651_800w.jpg" alt="Seamless connection" className="opacity-70 w-full h-full object-cover" />
                            <div className="bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent absolute top-0 right-0 bottom-0 left-0"></div>
                        </div>
                        <div className="relative p-5 md:p-6">
                            <h3 className="text-xl md:text-2xl font-normal tracking-tighter font-geist text-white">Immersive Gaming</h3>
                            <p className="mt-2 text-sm text-white/70 font-geist">
                                Play mini-games, compete in challenges, and explore interactive worlds together.
                            </p>
                        </div>
                        <div className="relative p-5 md:p-6 pt-0">
                            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-[11px] text-white/80 ring-1 ring-white/15 font-geist">
                                <svg className="w-3.5 h-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path>
                                    <path d="M5 3v4"></path>
                                    <path d="M19 17v4"></path>
                                    <path d="M3 5h4"></path>
                                    <path d="M17 19h4"></path>
                                </svg>
                                Interactive
                            </div>
                        </div>
                    </div>

                    {/* Card 3 */}
                    <div className="md:p-6 overflow-hidden animate-on-scroll [animation:fadeSlideIn_1s_ease-out_0.36s_both] bg-slate-900/50 ring-white/10 ring-1 rounded-3xl pt-5 pr-5 pb-5 pl-5 backdrop-blur-md">
                        <h3 className="text-xl md:text-2xl font-normal tracking-tighter font-geist text-white">Safe &amp; Secure</h3>
                        <p className="mt-2 text-sm text-white/70 font-geist">
                            Your privacy is our priority. Enjoy a safe environment with robust moderation tools.
                        </p>

                        {/* Template preview */}
                        <div className="mt-5 rounded-2xl bg-[radial-gradient(ellipse_at_top_left,rgba(255,255,255,0.06),rgba(2,6,23,0.6))] ring-1 ring-white/10 p-4">
                            <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-lg bg-white/10 ring-1 ring-white/10 flex items-center justify-center">
                                    <svg className="w-4 h-4 text-slate-200" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                                        <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
                                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm font-normal text-white font-geist">Trusted Environment</p>
                                    <p className="text-[11px] text-white/70 font-geist">Built with robust moderation tools</p>
                                </div>
                            </div>

                            <div className="mt-4 grid grid-cols-2 gap-3 text-[11px] text-white/70 font-geist">
                                <div className="flex items-center gap-2">
                                    <svg className="w-3.5 h-3.5 opacity-80" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                                        <rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect>
                                        <line x1="16" x2="16" y1="2" y2="6"></line>
                                        <line x1="8" x2="8" y1="2" y2="6"></line>
                                        <line x1="3" x2="21" y1="10" y2="10"></line>
                                    </svg>
                                    <span>Privacy Controls</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <svg className="w-3.5 h-3.5 opacity-80" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                                    </svg>
                                    <span>Community Safety</span>
                                </div>
                            </div>

                            <div className="mt-4 space-y-2">
                                <p className="text-[11px] text-white/70 font-geist"><span className="text-white/70">Subject:</span> Privacy-first platform experiences</p>
                                <p className="text-[11px] text-white/70 font-geist"><span className="text-white/70">Focus:</span> Security that scales with your community</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Features;