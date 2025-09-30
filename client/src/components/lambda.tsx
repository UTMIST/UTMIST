
import { Button } from "@/components/ui/button";

export default function LamdaSection() {
    return (
        <div className="p-px rounded-[14px] max-w-[1000px] mx-auto flex flex-col [background:linear-gradient(280deg,rgba(245,205,235,0)_0%,rgba(255,141,230,1)_100%),linear-gradient(128deg,#98cdf9_0%,#799fe6_22%,#1e19b1_100%)]">
        <div className="flex-1 flex flex-col justify-center [background:radial-gradient(circle_800px_at_center,rgba(255,255,255,0)_0%,rgba(107,141,253,0.277)_100%),white] rounded-[12px] p-[15px]">
            <h2 className="text-center text-[5rem] bg-[image:var(--gradient-bl1)] bg-clip-text [-webkit-text-fill-color:transparent] [font-family:var(--system-font)]">
            Ax = λx
            </h2>
            <div className="flex flex-wrap justify-center gap-4 mb-4">
                <Button variant="outline" className="px-5 py-2.5 bg-[#dae5ff] font-sans font-light text-base text-[#1e19b1] border-4 border-transparent rounded-[30px] cursor-pointer [background-image:linear-gradient(#dae5ff,#dae5ff),linear-gradient(70deg,#a4a1fa_0%,#4843dd_100%)] [background-origin:border-box] [background-clip:padding-box,border-box]">
                    Computer Vision
                </Button>
                <Button variant="outline" className="px-5 py-2.5 bg-[#dae5ff] font-sans font-light text-base text-[#1e19b1] border-4 border-transparent rounded-[30px] cursor-pointer [background-image:linear-gradient(#dae5ff,#dae5ff),linear-gradient(70deg,#a4a1fa_0%,#4843dd_100%)] [background-origin:border-box] [background-clip:padding-box,border-box]">
                    ML in Health
                </Button>
                <Button variant="outline" className="px-5 py-2.5 bg-[#dae5ff] font-sans font-light text-base text-[#1e19b1] border-4 border-transparent rounded-[30px] cursor-pointer [background-image:linear-gradient(#dae5ff,#dae5ff),linear-gradient(70deg,#a4a1fa_0%,#4843dd_100%)] [background-origin:border-box] [background-clip:padding-box,border-box]">
                Generative AI
                </Button>
            </div>
            <div className="flex flex-wrap justify-center gap-4 mb-4">
                <Button variant="outline" className="px-5 py-2.5 bg-[#dae5ff] font-sans font-light text-base text-[#1e19b1] border-4 border-transparent rounded-[30px] cursor-pointer [background-image:linear-gradient(#dae5ff,#dae5ff),linear-gradient(70deg,#a4a1fa_0%,#4843dd_100%)] [background-origin:border-box] [background-clip:padding-box,border-box]">
                    FinTech
                </Button>
                <Button variant="outline" className="px-5 py-2.5 bg-[#dae5ff] font-sans font-light text-base text-[#1e19b1] border-4 border-transparent rounded-[30px] cursor-pointer [background-image:linear-gradient(#dae5ff,#dae5ff),linear-gradient(70deg,#a4a1fa_0%,#4843dd_100%)] [background-origin:border-box] [background-clip:padding-box,border-box]">
                    High Performance Computing
                </Button>
                <Button variant="outline" className="px-5 py-2.5 bg-[#dae5ff] font-sans font-light text-base text-[#1e19b1] border-4 border-transparent rounded-[30px] cursor-pointer [background-image:linear-gradient(#dae5ff,#dae5ff),linear-gradient(70deg,#a4a1fa_0%,#4843dd_100%)] [background-origin:border-box] [background-clip:padding-box,border-box]">
                ML in Robotics
                </Button>
            </div>
            <div className="flex flex-wrap justify-center gap-4 mb-4">
                <Button variant="outline" className="px-5 py-2.5 bg-[#dae5ff] font-sans font-light text-base text-[#1e19b1] border-4 border-transparent rounded-[30px] cursor-pointer [background-image:linear-gradient(#dae5ff,#dae5ff),linear-gradient(70deg,#a4a1fa_0%,#4843dd_100%)] [background-origin:border-box] [background-clip:padding-box,border-box]">
                    ML Infrastructure
                </Button>
                <Button variant="outline" className="px-5 py-2.5 bg-[#dae5ff] font-sans font-light text-base text-[#1e19b1] border-4 border-transparent rounded-[30px] cursor-pointer [background-image:linear-gradient(#dae5ff,#dae5ff),linear-gradient(70deg,#a4a1fa_0%,#4843dd_100%)] [background-origin:border-box] [background-clip:padding-box,border-box]">
                    AI Research
                </Button>
                <Button variant="outline" className="px-5 py-2.5 bg-[#dae5ff] font-sans font-light text-base text-[#1e19b1] border-4 border-transparent rounded-[30px] cursor-pointer [background-image:linear-gradient(#dae5ff,#dae5ff),linear-gradient(70deg,#a4a1fa_0%,#4843dd_100%)] [background-origin:border-box] [background-clip:padding-box,border-box]">
                    NLP
                </Button>
            </div>
            <h2 className="text-[2rem] font-light text-center bg-[image:var(--gradient-bl1)] bg-clip-text [-webkit-text-fill-color:transparent] [font-family:var(--system-font)] px-8">
            We bring together different eigenvectors - special kind of vectors often times with varying magnitudes and directions
            </h2>
        </div>
        </div>
    )
}