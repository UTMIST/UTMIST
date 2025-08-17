import Image from "next/image"
import blueTick from "@/assets/icons/blue-tick-icon.svg";
import darkBlueTick from "@/assets/icons/dark-blue-tick-icon.svg";
import HeroSection from "@/components/heroSection";
import mlfBackground from "@/assets/photos/ml-fundamentals/mlf-background.svg";

export default function MachineLearningFundamentals() {

    return <main>
      <div className="w-full h-screen flex flex-col items-center text-left relative pt-20">
        {/* Background SVG Image - Extended to cover navbar */}
        <div 
          className="absolute opacity-100"
          style={{
            backgroundImage: `url(${mlfBackground.src})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            width: '100vw',
            height: '100vh',
            top: '-143px', // Adjust this value based on your navbar height
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1,
          }}
        />
        
        {/* Dark overlay - Extended to cover navbar */}
        <div className="absolute bg-opacity-40 z-10" style={{
          width: '100vw',
          height: '100vh',
          top: '-145px', // Same value as background
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 2,
        }}></div>
        
        {/* Content */}
        <div className="relative z-20 w-4/5 max-w-6xl p-8">
          {/* Title and Description */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-white mb-6">
              <span>Machine Learning</span> Fundamentals
            </h1>
            <p className="text-xl text-white max-w-4xl mx-auto leading-relaxed">
              This is your go-to page for everything related to the Machine Learning Fundamentals (MLF) Program by UTMIST. 
              Find all the essential links in one place—from the IBM platform for notebooks and tools, to lecture recordings 
              and key resources to help you stay on track and succeed throughout the program.
            </p>
          </div>
          
          {/* Content Cards */}
          <div className="flex flex-col md:flex-row gap-6">
            <div className="border border-gray-300 mx-4 p-6 text-center rounded-2xl w-full max-w-4xl bg-white bg-opacity-95 backdrop-blur-sm">
              <h2 className="text-2xl font-bold text-black mb-4">
                Gain Technical Skills
              </h2>
              <div className="space-y-3">
                <div className="flex flex-row justify-start items-center">
                  <Image src={blueTick} alt="Blue tick" className="w-5 h-5 mr-3" />
                  <span className="text-sm text-gray-800">Help shape the future of AI and ML at UTMIST</span>
                </div>
                <div className="flex flex-row justify-start items-center">
                  <Image src={blueTick} alt="Blue tick" className="w-5 h-5 mr-3" />
                  <span className="text-sm text-gray-800">Help shape the future of AI and ML at UTMIST</span>
                </div>
                <div className="flex flex-row justify-start items-center">
                  <Image src={blueTick} alt="Blue tick" className="w-5 h-5 mr-3" />
                  <span className="text-sm text-gray-800">Help shape the future of AI and ML at UTMIST</span>
                </div>
              </div>
            </div>
            
            <div className="border border-gray-300 mx-4 p-6 text-center rounded-2xl w-full max-w-4xl bg-white bg-opacity-95 backdrop-blur-sm">
              <h2 className="text-2xl font-bold text-black mb-4">
                Time and Location
              </h2>
              <p className="text-lg text-gray-800 mb-4 font-semibold">BA2100 3pm</p>
              <div className="space-y-3">
                <div className="flex flex-row justify-start items-center">
                  <Image src={darkBlueTick} alt="Dark blue tick" className="w-5 h-5 mr-3" />
                  <span className="text-sm text-gray-800">Help shape the future of AI and ML at UTMIST</span>
                </div>
                <div className="flex flex-row justify-start items-center">
                  <Image src={darkBlueTick} alt="Dark blue tick" className="w-5 h-5 mr-3" />
                  <span className="text-sm text-gray-800">Help shape the future of AI and ML at UTMIST</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
}