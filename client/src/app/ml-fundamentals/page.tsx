"use client"
import "@/styles/ml-fundamentals.css";

import Image, { StaticImageData } from "next/image"
import { useState } from "react"
import blueTick from "@/assets/icons/blue-tick-icon.svg";
import darkBlueTick from "@/assets/icons/dark-blue-tick-icon.svg";
import HeroSection from "@/components/heroSection";
import ibmLogo from "@/assets/photos/ml-fundamentals/ibm.png";
import PeopleGrid from "@/components/peopleGrid";

// Type definitions
type ModalType = 'slides' | 'recording' | 'code';

type FAQItem = {
  id: number;
  question: string;
  answer?: string;
};

type WorkshopContent = {
  title: string;
  code: {
    content: string[];
  };
};

import { programDirectors, academicsTeam } from "./data";

// Week data for the schedule
const weekData = [
  {
    weekNumber: 1,
    title: "Introduction to Machine Learning",
    description: "What is ML, types of ML, applications, linear regression basics, PyTorch introduction",
    date: "Sept 27, 2025"
  },
  {
    weekNumber: 2,
    title: "Logistic Regression",
    description: "Classification with sigmoid, decision boundaries, model evaluation, train-validation-test split",
    date: "Oct 4, 2025"
  },
  {
    weekNumber: 3,
    title: "Neural Networks Part 1",
    description: "Perceptrons, activation functions, forward propagation, limitations of linear models",
    date: "Oct 11, 2025"
  },
  {
    weekNumber: 4,
    title: "Neural Networks Part 2",
    description: "Backpropagation intuition, optimization algorithms, training loops, practical tips",
    date: "Oct 18, 2025"
  },
  {
    weekNumber: 5,
    title: "Decision Trees & Ensembles",
    description: "Split criteria, tree depth, random forests, bagging, entropy & information gain",
    date: "Nov 8, 2025"
  },
  {
    weekNumber: 6,
    title: "Naive Bayes",
    description: "Probability basics, Bayes' theorem, generative vs discriminative models, text classification",
    date: "Nov 15, 2025"
  },
  {
    weekNumber: 7,
    title: "Best Practices & Evaluation",
    description: "Baseline models, bias-variance tradeoff, evaluation metrics, iterative ML process",
    date: "Nov 22, 2025"
  },
  {
    weekNumber: 8,
    title: "Deep Learning & Modern Architectures",
    description: "Why deep learning, CNNs, RNNs, transformers, practical implementation with PyTorch",
    date: "Nov 29, 2025"
  }
];

// FAQ data
const faqData: FAQItem[] = [
  {
    id: 1,
    question: "What prerequisites do I need for this workshop?",
    answer: "Basic knowledge of Python programming and high school mathematics (algebra, calculus) is recommended. No prior machine learning experience is required."
  },
  {
    id: 2,
    question: "Do I need to bring my own laptop?",
    answer: "Yes, please bring your own laptop. We'll be using PyTorch and other tools that need to be installed on your device."
  },
  {
    id: 3,
    question: "What if I miss a session?",
    answer: "All materials, slides, and recordings will be available online. You can catch up on missed content and reach out to the team for any questions."
  },
  {
    id: 4,
    question: "Is there any cost to attend?",
    answer: "No, this workshop is completely free for UTMIST members. It's part of our commitment to making AI and ML education accessible."
  },
  {
    id: 5,
    question: "Will I receive a certificate?",
    answer: "Yes, participants who complete all 8 workshops will receive a certificate of completion from UTMIST."
  },
  {
    id: 6,
    question: "Can I join if I'm not a UTMIST member?",
    answer: "Yes, non-members are welcome to attend. We encourage you to join UTMIST to access additional resources and events."
  },
  {
    id: 7,
    question: "What software will we be using?",
    answer: "We'll primarily use PyTorch for deep learning, along with Python, Jupyter notebooks, and various visualization libraries."
  },
  {
    id: 8,
    question: "How long are the sessions?",
    answer: "Each workshop session is approximately 2 hours long, including theory, practical coding, and hands-on exercises."
  }
];

// Workshop content data
const workshopContent: Record<number, WorkshopContent> = {
  1: {
    title: "Introduction to Machine Learning",
    code: {
      content: []
    }
  },
  2: {
    title: "Logistic Regression",
    code: {
      content: []
    }
  },
  3: {
    title: "Neural Networks Part 1: Foundations",
    code: {
      content: []
    }
  },
  4: {
    title: "Neural Networks Part 2: Training",
    code: {
      content: []
    }
  },
  5: {
    title: "Decision Trees & Ensemble Learning",
    code: {
      content: []
    }
  },
  6: {
    title: "Naive Bayes",
    code: {
      content: []
    }
  },
  7: {
    title: "Best Practices & Evaluation in ML",
    code: {
      content: []
    }
  },
  8: {
    title: "Deep Learning & Modern Architectures",
    code: {
      content: []
    }
  }
};

// Component definitions
interface PhaseData {
  title: string;
  items: string[];
  icon: StaticImageData;
  paddingLeft: string;
}

interface ContentCardsSectionProps {
  phases: PhaseData[];
}

function ContentCardsSection({ phases }: ContentCardsSectionProps) {
  return (
    <div className="w-full bg-white px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8 justify-center items-center">
          {phases.map((phase, index) => (
            <PhaseCard
              key={index}
              title={phase.title}
              items={phase.items}
              icon={phase.icon}
              paddingLeft={phase.paddingLeft}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

interface PhaseCardProps {
  title: string;
  items: string[];
  icon: StaticImageData;
  paddingLeft?: string;
}

function PhaseCard({ 
  title, 
  items, 
  icon, 
  paddingLeft = "pl-8 lg:pl-16" 
}: PhaseCardProps) {
  return (
    <div className="border border-gray-200 rounded-2xl bg-white shadow-lg p-4 w-full max-w-md lg:max-w-md">
      <h2 className="text-2xl font-bold text-center mb-6" style={{
        background: "var(--gradient-bl1)",
        backgroundClip: "text",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        fontFamily: "var(--system-font)"
      }}>
        {title}
      </h2>
      
      <div className={`space-y-4 ${paddingLeft}`}>
        {items.map((item, index) => (
          <div key={index}>
            <div className="flex items-center space-x-4">
              <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center`}>
                <Image
                  src={icon}
                  alt={`${title} Tick Icon`}
                  width={16}
                  height={16}
                  style={{ objectFit: "cover" }}
                />
              </div>
              <p className="text-gray-900 text-md font-extralight leading-relaxed" style={{
                fontFamily: "var(--system-font)"
              }}>
                {item}
              </p>
            </div>
            
            {index < items.length - 1 && (
              <div className="h-px bg-gray-200 rounded-full mt-2 -ml-14"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

interface ScheduleSectionProps {
  weekData: typeof weekData;
  onOpenModal: (week: number, type: 'slides' | 'recording' | 'code') => void;
}

function ScheduleSection({ weekData, onOpenModal }: ScheduleSectionProps) {
  return (
    <div className="w-full bg-white px-4 sm:px-6 lg:px-8 pt-30">
      <div className="max-w-6xl mx-auto">
        <div className="text-left mb-12 mt-8 sm:mt-0">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Phase 1: Workshop Schedule</h2>
          <p className="text-lg text-gray-600">
            New lectures, slides, and labs will be uploaded weekly! Join us for synchronous lectures weekly starting <b>September 27 from 1-3pm in BA1180!</b>
          </p>
        </div>
        
        {/* Week Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {weekData.map((week) => (
            <div key={week.weekNumber} className="bg-white border border-gray-200 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow flex flex-col h-full">
              <div className="flex-1">
                <h3 className="text-gray-900 font-semibold text-lg mb-2">{week.title}</h3>
                <span className="font-bold text-black text-base mb-3">Week {week.weekNumber} - {week.date}</span>
                <p className="text-sm text-gray-600">
                  {week.description}
                </p>
              </div>
              <div className="flex gap-2 mt-4">
                <button 
                  onClick={() => onOpenModal(week.weekNumber, 'slides')}
                  className="flex-1 bg-indigo-700 text-white text-xs py-2 px-3 rounded-lg font-medium hover:bg-indigo-800 transition-colors"
                >
                  Slides
                </button>
                <button 
                  onClick={() => onOpenModal(week.weekNumber, 'recording')}
                  className="flex-1 bg-indigo-700 text-white text-xs py-2 px-3 rounded-lg font-medium hover:bg-indigo-800 transition-colors"
                >
                  Recording
                </button>
                <button 
                  onClick={() => onOpenModal(week.weekNumber, 'code')}
                  className="flex-1 bg-indigo-700 text-white text-xs py-2 px-3 rounded-lg font-medium hover:bg-indigo-800 transition-colors"
                >
                  Code
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProjectsSection({ }) {
  return (
    <div className="w-full bg-white px-4 sm:px-6 lg:px-8 pt-30">
      <div className="max-w-6xl mx-auto">
        <div className="text-left mb-12 mt-8 sm:mt-0">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Phase 2: Project</h2>
          <p className="text-lg text-gray-600">
            Check back for more information!
          </p>
        </div>
      </div>
    </div>
  );
}

interface FAQSectionProps {
  faqData: FAQItem[];
  openFAQ: number | null;
  onToggleFAQ: (id: number) => void;
}

function FAQSection({ faqData, openFAQ, onToggleFAQ }: FAQSectionProps) {
  return (
    <div className="w-full bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Frequently Asked Questions</h2>
          <p className="text-lg text-gray-600">
            For any other questions please reach out to the team at UTMIST!
          </p>
        </div>
        
        {/* FAQ Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 auto-rows-auto">
          {faqData.map((faq) => (
            <div key={faq.id} className="bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors overflow-hidden h-fit">
              <div 
                className="flex items-center justify-between p-4"
                onClick={() => onToggleFAQ(faq.id)}
              >
                <span className="font-bold text-black">{faq.question}</span>
                <svg 
                  className={`w-4 h-4 text-gray-600 transition-transform duration-300 ease-in-out ${openFAQ === faq.id ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              <div 
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  openFAQ === faq.id 
                    ? 'max-h-32 opacity-100' 
                    : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-4 pb-4 border-t border-gray-200">
                  <p className="text-gray-700 mt-3 leading-relaxed">{faq.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

interface SponsorSectionProps {
  sponsorLogo: StaticImageData;
  sponsorName: string;
  message: string;
}

function SponsorSection({ sponsorLogo, sponsorName, message }: SponsorSectionProps) {
  return (
    <div className="w-full bg-white py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-black mb-12">{message}</h2>
          
          <div className="flex justify-center">
            <Image
              src={sponsorLogo}
              alt={`${sponsorName} Logo`}
              width={100}
              height={50}
              className="h-24 w-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

interface WorkshopModalProps {
  isOpen: boolean;
  isAnimating: boolean;
  modalContent: WorkshopContent | null;
  modalType: ModalType | null;
  weekNumber: number;
  onClose: () => void;
}

function WorkshopModal({ isOpen, isAnimating, modalContent, modalType, weekNumber, onClose }: WorkshopModalProps) {
  if (!isOpen || !modalContent) return null;

  const pdfUrls: Record<number, string> = {
    1: "https://raw.githubusercontent.com/UTMIST/AI2-RL-2024-Workshop/main/Week%201/UTMIST_RL_Workshop_F24_W1.pdf",
    2: "",
    3: "",
    4: "",
    5: "",
    6: "",
    7: "",
    8: "",
  };

  // YouTube video URLs for each week's recordings (you'll need to replace these with actual video URLs)
  const youtubeVideoUrls: Record<number, string> = {
    1: "", 
    2: "", 
    3: "", 
    4: "", 
    5: "", 
    6: "",
    7: "", 
    8: "", 
  };

  // weekNumber is now passed as a prop
  const pdfUrl = pdfUrls[weekNumber];
  const youtubeVideoUrl = youtubeVideoUrls[weekNumber];
  
  // Convert YouTube watch URL to embed URL
  const getEmbedUrl = (url: string): string => {
    if (url.includes('youtube.com/watch?v=')) {
      const videoId = url.split('v=')[1].split('&')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    } else if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1].split('?')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    } else if (url.includes('youtube.com/embed/')) {
      return url;
    }
    return url;
  };
  
  const embedUrl = youtubeVideoUrl ? getEmbedUrl(youtubeVideoUrl) : null;

  return (
    <div className="fixed inset-0 bg-opacity-50 z-50 flex items-center justify-center p-8 pt-32 pb-16 sm:pt-28 sm:pb-16 sm:px-12 md:pt-20 md:px-16 md:pb-16 lg:px-12 lg:pb-12 lg:pt-8 xl:px-16 xl:pb-16 xl:pt-12 2xl:px-20 2xl:pb-20 2xl:pt-16">
      <div className={`bg-white border-2 border-gray-300 shadow-2xl rounded-xl max-w-7xl w-full h-[85vh] max-h-[calc(100vh-6rem)] sm:max-h-[calc(100vh-8rem)] md:max-h-[calc(100vh-8rem)] lg:h-[95vh] lg:max-h-[90vh] overflow-hidden transition-all duration-300 ease-out transform ${
        isAnimating ? 'scale-105' : 'scale-40'
      }`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gray-50">
            <div>
              <h2 className="text-xl font-bold text-gray-900">{modalContent.title}</h2>
              <h3 className="text-lg font-semibold text-gray-700">
                {modalType === 'slides' ? 'Slides' : modalType === 'recording' ? 'Recording' : 'Code'}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-3xl font-bold leading-none p-2 hover:bg-gray-200 rounded-full transition-colors"
            >
              ×
            </button>
          </div>
          
          {/* Content */}
          <div className="flex-1 overflow-hidden">
            {modalType === 'slides' ? (
              pdfUrl ? (
                <div className="h-full w-full min-h-0">
                  <iframe
                    src={pdfUrl.includes('raw.githubusercontent.com') 
                      ? `https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodeURIComponent(pdfUrl)}`
                      : pdfUrl
                    }
                    className="w-full h-full border-0 min-h-0"
                    title={`${modalContent.title} - Slides`}
                    style={{ minHeight: '0' }}
                  />
                </div>
              ) : (
                <div className="h-full w-full min-h-0 p-8 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-4">📄</div>
                    <h3 className="text-2xl font-bold text-gray-700 mb-2">Coming Soon</h3>
                    <p className="text-gray-500">Slides will be available soon!</p>
                  </div>
                </div>
              )
            ) : modalType === 'recording' ? (
              embedUrl ? (
                <div className="h-full w-full min-h-0 p-4">
                  <div className="relative w-full h-full">
                    <iframe
                      src={embedUrl}
                      className="absolute top-0 left-0 w-full h-full border-0 rounded-lg"
                      title={`${modalContent.title} - Recording`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
              ) : (
                <div className="h-full w-full min-h-0 p-8 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-4">🎥</div>
                    <h3 className="text-2xl font-bold text-gray-700 mb-2">Coming Soon</h3>
                    <p className="text-gray-500">Recording will be available soon!</p>
                  </div>
                </div>
              )
            ) : (
              modalContent.code.content.length > 0 ? (
                <div className="p-6 overflow-y-auto h-full">
                  <div className="space-y-2">
                    {modalContent.code.content.map((item: string, index: number) => (
                      <p key={index} className="text-gray-700 leading-relaxed">
                        {item}
                      </p>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="h-full w-full min-h-0 p-8 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-4">💻</div>
                    <h3 className="text-2xl font-bold text-gray-700 mb-2">Coming Soon</h3>
                    <p className="text-gray-500">Code content will be available soon!</p>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MachineLearningFundamentals() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalAnimating, setIsModalAnimating] = useState(false);
  const [modalContent, setModalContent] = useState<WorkshopContent | null>(null);
  const [modalType, setModalType] = useState<ModalType | null>(null);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const [currentWeekNumber, setCurrentWeekNumber] = useState<number>(1);

  const openModal = (week: number, type: ModalType) => {
    const content = workshopContent[week];
    setModalContent(content);
    setModalType(type);
    setCurrentWeekNumber(week);
    setIsModalOpen(true);
    // Small delay to allow the modal to render first, then animate
    setTimeout(() => {
      setIsModalAnimating(true);
    }, 10);
  };

  const closeModal = () => {
    setIsModalAnimating(false);
    setTimeout(() => {
      setIsModalOpen(false);
      setModalContent(null);
      setModalType(null);
    }, 300); 
  };

  const toggleFAQ = (id: number) => {
    setOpenFAQ(openFAQ === id ? null : id);
  };

  return <main>
    {/* Hero Section */}
    <HeroSection 
      title="Machine Learning Fundamentals"
      subtitle="This is your go-to page for everything related to the Machine Learning Fundamentals (MLF) Program by UTMIST. Find all the essential links in one place—from the IBM platform for notebooks and tools, to lecture recordings and key resources to help you stay on track and succeed throughout the program."
    />

    <ContentCardsSection 
      phases={[
        {
          title: "Phase 1",
          items: [
            "Learn basics of ML through workshops",
            "Collaborative learning with peers",
            "Build foundational knowledge for ML"
          ],
          icon: blueTick,
          paddingLeft: "pl-8 lg:pl-16"
        },
        {
          title: "Phase 2",
          items: [
            "Apply knowledge through building a project",
            "Access mentoring and office hours",
            "Gain hands on experience and skills in ML"
          ],
          icon: darkBlueTick,
          paddingLeft: "pl-8 lg:pl-12"
        }
      ]}
    />

    <ScheduleSection 
      weekData={weekData} 
      onOpenModal={openModal} 
    />
  
    <ProjectsSection
    />

    <FAQSection 
      faqData={faqData} 
      openFAQ={openFAQ} 
      onToggleFAQ={toggleFAQ} 
    />

     {/* People Section */}
     <section className="people-section px-4 md:px-8">
          <h2 className="people-section-title text-2xl md:text-3xl lg:text-4xl">
            ML Fundamentals Team
          </h2>

          <h3 className="people-section-subtitle text-2xl md:text-3xl lg:text-4xl"><i>Program Directors</i></h3>
          <PeopleGrid people={programDirectors}/>
          <h3 className="people-section-subtitle text-2xl md:text-3xl lg:text-4xl"><i>Academics Team</i></h3>
          <PeopleGrid people={academicsTeam}/>
      </section>

    <SponsorSection 
      sponsorLogo={ibmLogo}
      sponsorName="IBM"
      message="Thank you to IBM for sponsoring us!"
    />

    <WorkshopModal 
      isOpen={isModalOpen}
      isAnimating={isModalAnimating}
      modalContent={modalContent}
      modalType={modalType}
      weekNumber={currentWeekNumber}
      onClose={closeModal}
    />
  </main>
}