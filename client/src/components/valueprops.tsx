import React from 'react';
import { Pen, Laptop, Wrench } from 'lucide-react';

const ValueProps: React.FC = () => {
  return (
    <div className="p-8">
      <div className="max-w-[1000px] mx-auto grid grid-cols-1 gap-12 [background-size:20px_20px] p-8 lg:grid-cols-[1fr_1.5fr] lg:items-center">
        <div className="py-4">
          <h1 className="text-4xl lg:text-5xl font-bold text-[#111] leading-tight m-0">Build Real Skills in AI—<br />From Writing to Workshops to Engineering and Research</h1>
        </div>

        <div className="flex flex-col gap-8">
          <div className="flex gap-6 items-start flex-col lg:flex-row">
            <div className="flex items-center justify-center w-[60px] h-[60px] rounded-xl flex-shrink-0 bg-[#6c5ce7]">
              <Pen className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-semibold m-0 mb-2 text-[#111]">Craft technical articles and notebooks</h2>
              <p className="text-base leading-6 text-[#555] m-0">
                a student-led AI conference featuring hands-on workshops, expert talks, and
                diverse perspectives across fields like fintech, healthcare, and robotics.
              </p>
            </div>
          </div>

          <div className="flex gap-6 items-start flex-col lg:flex-row">
            <div className="flex items-center justify-center w-[60px] h-[60px] rounded-xl flex-shrink-0 bg-[#3b5bdb]">
              <Laptop className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-semibold m-0 mb-2 text-[#111]">Join and contribute to industry leading AI/ML workshops</h2>
              <p className="text-base leading-6 text-[#555] m-0">
                a student-led AI conference featuring hands-on workshops, expert talks, and
                diverse perspectives across fields like fintech, healthcare, and robotics.
              </p>
            </div>
          </div>

          <div className="flex gap-6 items-start flex-col lg:flex-row">
            <div className="flex items-center justify-center w-[60px] h-[60px] rounded-xl flex-shrink-0 bg-[#e64980]">
              <Wrench className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-semibold m-0 mb-2 text-[#111]">Drive impact with engineering and research projects</h2>
              <p className="text-base leading-6 text-[#555] m-0">
                a student-led AI conference featuring hands-on workshops, expert talks, and
                diverse perspectives across fields like fintech, healthcare, and robotics.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ValueProps;