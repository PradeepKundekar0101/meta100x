"use client";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";


export default function ScrollDemo() {
    return (
        <div className="flex flex-col overflow-hidden">
            <ContainerScroll
                titleComponent={
                    <>
                        <h1 className="text-4xl text-white dark:text-white">
                            Explore the Metaverse <br />
                            <span className="text-4xl md:text-[6rem] font-bold mt-1 leading-none">
                                in 2D
                            </span>
                        </h1>
                    </>
                }
            >
                <img
                    src={`/cta.png`}
                    alt="hero"
                    height={720}
                    width={1400}
                    className="mx-auto rounded-2xl object-cover h-full object-left-top"
                    draggable={false}
                />
            </ContainerScroll>
        </div>
    );
}
