const Footer = () => {
    return (
        <footer className="bg-[#0A0A0B] text-white pt-20 pb-10 overflow-hidden relative">
            <div className="container mx-auto px-4 max-w-7xl relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-20 gap-10">
                    <div className="max-w-sm">
                        <h3 className="text-2xl font-bold mb-4 tracking-tight">
                            Metaverse
                        </h3>
                        <p className="text-white/50 text-sm leading-relaxed">
                            Connecting people through immersive virtual experiences. Build, explore, and interact in a world without limits.
                        </p>
                    </div>

                    <div className="flex gap-16 md:gap-24">
                        <div>
                            <h4 className="font-semibold mb-6 text-sm tracking-wider uppercase text-white/40">Platform</h4>
                            <ul className="space-y-4 text-sm font-medium text-white/80">
                                <li>
                                    <a href="#" className="hover:text-white transition-colors">Features</a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-white transition-colors">Pricing</a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-white transition-colors">Blog</a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-6 text-sm tracking-wider uppercase text-white/40">Social</h4>
                            <ul className="space-y-4 text-sm font-medium text-white/80">
                                <li>
                                    <a href="#" className="hover:text-white transition-colors">Twitter</a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-white transition-colors">Discord</a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Big Text */}
                <div className="w-full flex justify-center items-center mt-10 mb-10 select-none pointer-events-none">
                    <h1 className="text-[15vw] leading-none font-black tracking-tighter text-white/[0.03] uppercase">
                        METAVERSE
                    </h1>
                </div>

                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-white/40">
                        &copy; {new Date().getFullYear()} Metaverse Inc. All rights reserved.
                    </p>
                    <div className="flex space-x-6 text-sm text-white/40">
                        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer