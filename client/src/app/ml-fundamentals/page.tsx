"use client"
import Image from "next/image"
import { useState } from "react"
import blueTick from "@/assets/icons/blue-tick-icon.svg";
import darkBlueTick from "@/assets/icons/dark-blue-tick-icon.svg";
import HeroSection from "@/components/heroSection";
import catOne from "@/assets/photos/ml-fundamentals/cat_one.avif";
import catTwo from "@/assets/photos/ml-fundamentals/cat_two.avif";
import catThree from "@/assets/photos/ml-fundamentals/cat_three.webp";
import catFour from "@/assets/photos/ml-fundamentals/cat_four.jpg";
import ibmLogo from "@/assets/photos/ml-fundamentals/ibm.png";

// Type definitions
type ModalType = 'theory' | 'pytorch' | 'exercise';

type WorkshopSection = {
  title: string;
  content: string[];
};

type FAQItem = {
  id: number;
  question: string;
  answer?: string;
};

type WorkshopContent = {
  title: string;
  theory: WorkshopSection;
  pytorch: WorkshopSection;
  exercise: WorkshopSection;
};

// Week data for the schedule
const weekData = [
  {
    weekNumber: 1,
    title: "Introduction to Machine Learning",
    description: "What is ML, types of ML, applications, linear regression basics, PyTorch introduction"
  },
  {
    weekNumber: 2,
    title: "Logistic Regression",
    description: "Classification with sigmoid, decision boundaries, model evaluation, train-validation-test split"
  },
  {
    weekNumber: 3,
    title: "Neural Networks Part 1",
    description: "Perceptrons, activation functions, forward propagation, limitations of linear models"
  },
  {
    weekNumber: 4,
    title: "Neural Networks Part 2",
    description: "Backpropagation intuition, optimization algorithms, training loops, practical tips"
  },
  {
    weekNumber: 5,
    title: "Decision Trees & Ensembles",
    description: "Split criteria, tree depth, random forests, bagging, entropy & information gain"
  },
  {
    weekNumber: 6,
    title: "Naive Bayes",
    description: "Probability basics, Bayes' theorem, generative vs discriminative models, text classification"
  },
  {
    weekNumber: 7,
    title: "Best Practices & Evaluation",
    description: "Baseline models, bias-variance tradeoff, evaluation metrics, iterative ML process"
  },
  {
    weekNumber: 8,
    title: "Deep Learning & Modern Architectures",
    description: "Why deep learning, CNNs, RNNs, transformers, practical implementation with PyTorch"
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

// Team data
const teamData = [
  {
    id: 1,
    name: "Name",
    image: catOne,
  },
  {
    id: 2,
    name: "Name",
    image: catTwo,
  },
  {
    id: 3,
    name: "Name",
    image: catThree,
  },
  {
    id: 4,
    name: "Name",
    image: catFour,
  }
];

// Workshop content data
const workshopContent: Record<number, WorkshopContent> = {
  1: {
    title: "Introduction to Machine Learning",
    theory: {
      title: "What is Machine Learning?",
      content: [
        "Definition of ML as pattern recognition from data",
        "Difference between ML and traditional programming",
        "Applications of ML: NLP (chatbots), CV (object detection), Recommendation systems, RL (game AI), Generative AI",
        "Types of ML: Supervised, Unsupervised (Not taught here), Reinforcement Learning (brief overview)",
        "Types of Problems: Classification vs Regression vs Generation"
      ]
    },
    pytorch: {
      title: "Linear Regression",
      content: [
        "Linear Regression: Model equation: y = wx + b",
        "Loss: Mean Squared Error (MSE)",
        "Gradient Descent: Intuition using visuals",
        "Visualization of Regression Line & Data",
        "Optional: Vectorization, Polynomial Regression (mention only)"
      ]
    },
    exercise: {
      title: "Programming & Exercise",
      content: [
        "Introduction to PyTorch:",
        "• Tensors: creation, basic math, reshaping",
        "• Visualizing data with matplotlib",
        "",
        "Exercise:",
        "• Implement linear regression from scratch using PyTorch tensors (no autograd yet)",
        "• Plot predictions vs actual data points"
      ]
    }
  },
  2: {
    title: "Logistic Regression",
    theory: {
      title: "Logistic Regression for Classification",
      content: [
        "Sigmoid function and decision boundaries",
        "Loss: Binary Cross-Entropy",
        "",
        "Model Evaluation:",
        "• Train-Validation-Test Split: Why splitting is essential",
        "• Overfitting & Underfitting: Visual examples",
        "• Solutions: Regularization (mention L2), data stuff, simpler models, feature eng?"
      ]
    },
    pytorch: {
      title: "PyTorch Autograd",
      content: [
        "Using torch.nn and torch.optim for simple models",
        "Automatic differentiation with autograd",
        "Building neural network layers",
        "Loss function implementation",
        "Optimizer configuration"
      ]
    },
    exercise: {
      title: "Exercise",
      content: [
        "Build a logistic regression classifier in PyTorch for binary classification",
        "Plot decision boundaries",
        "Evaluate using loss and accuracy",
        "Implement proper train-validation split",
        "Visualize training progress"
      ]
    }
  },
  3: {
    title: "Neural Networks Part 1: Foundations",
    theory: {
      title: "Neural Network Foundations",
      content: [
        "Limitations of Linear Models",
        "Perceptron & Single-Layer Networks: Weighted sum + bias → activation",
        "Activation Functions: Sigmoid, Tanh, ReLU (with visuals & intuitive explanation)",
        "Forward Propagation: How inputs are transformed into outputs layer by layer",
        "Loss Functions Recap: MSE for regression, Cross-Entropy for classification"
      ]
    },
    pytorch: {
      title: "PyTorch Model Definition",
      content: [
        "Define simple PyTorch models using torch.nn.Linear",
        "Activation functions (torch.nn.ReLU, torch.nn.Sigmoid, torch.nn.Tanh)",
        "Model architecture design",
        "Parameter initialization",
        "Manual forward pass computation"
      ]
    },
    exercise: {
      title: "Exercise",
      content: [
        "Implement a simple 1-hidden-layer network to solve a basic classification task",
        "2D point classification example",
        "Plot decision boundaries and predictions",
        "Experiment with different activation functions",
        "Visualize network architecture"
      ]
    }
  },
  4: {
    title: "Neural Networks Part 2: Training",
    theory: {
      title: "Training Neural Networks",
      content: [
        "Backpropagation (Intuition not Math-heavy): Chain rule concept, how errors flow backward",
        "Optimization Algorithms: Gradient Descent recap → SGD → brief mention of Adam",
        "Deep neural network concepts",
        "Practical tips: initialization, batch size, etc."
      ]
    },
    pytorch: {
      title: "PyTorch Training",
      content: [
        "Use PyTorch's autograd to compute gradients automatically",
        "Training loop implementation:",
        "• Forward pass → Loss → Backward pass → Optimizer step",
        "Loss curve visualization",
        "Model checkpointing and saving"
      ]
    },
    exercise: {
      title: "Exercise",
      content: [
        "Build and train an MLP for multiclass classification",
        "Experiment: Try different learning rates, number of epochs",
        "Visualize their impact on training",
        "Plot loss curves during training",
        "Compare different optimization strategies"
      ]
    }
  },
  5: {
    title: "Decision Trees & Ensemble Learning",
    theory: {
      title: "Decision Trees & Ensembles",
      content: [
        "Decision Trees: Split criteria (Gini, Entropy)",
        "Tree depth and overfitting",
        "Random Forests & Intro to Ensembles: Bagging idea, XGBoost (high-level only)",
        "Entropy & information gain"
      ]
    },
    pytorch: {
      title: "Scikit-learn Implementation",
      content: [
        "Using scikit-learn for tree-based models",
        "Train DecisionTreeClassifier & RandomForestClassifier",
        "Visualize trees (plot_tree)",
        "Hyperparameter tuning",
        "Feature importance analysis"
      ]
    },
    exercise: {
      title: "Exercise",
      content: [
        "Compare decision trees vs random forests on toy datasets",
        "Observe the effects of hyperparameters (max_depth)",
        "Visualize decision boundaries",
        "Analyze feature importance",
        "Cross-validation for model selection"
      ]
    }
  },
  6: {
    title: "Naive Bayes",
    theory: {
      title: "Naive Bayes & Probability",
      content: [
        "Basic Probability: Joint, Conditional, Independence",
        "Bayes' Theorem",
        "Model Assumption: All features are conditionally independent given the class",
        "Generative approach: Models P(X | Y) and P(Y) directly",
        "Common use cases: Text classification, spam detection, sentiment analysis",
        "",
        "Generative vs Discriminative Models:",
        "• Generative Models: Learn how new data is generated",
        "• Discriminative Models: Learn decision boundaries directly",
        "Connections to modern Generative AI (GPT models for text)"
      ]
    },
    pytorch: {
      title: "Implementation",
      content: [
        "Implement Naive Bayes for text classification",
        "Text preprocessing and feature extraction",
        "Probability calculations",
        "Model training and prediction",
        "Performance evaluation"
      ]
    },
    exercise: {
      title: "Exercise",
      content: [
        "Train Naive Bayes on a spam detection or movie review sentiment dataset",
        "Text preprocessing pipeline",
        "Feature engineering for text",
        "Cross-validation and evaluation",
        "Compare with other text classification methods"
      ]
    }
  },
  7: {
    title: "Best Practices & Evaluation in ML",
    theory: {
      title: "ML Best Practices",
      content: [
        "Concept of Baseline Models: Why simplest models matter (e.g., majority class)",
        "Bias-Variance Tradeoff: Visual and intuitive explanation",
        "Data Augmentation (mention examples in vision, text)",
        "Transfer learning concepts",
        "Evaluation Metrics Expanded: Precision, Recall, F1, ROC curves",
        "Iterative Process: Hypothesize, test, refine"
      ]
    },
    pytorch: {
      title: "Evaluation Metrics",
      content: [
        "Compute evaluation metrics in PyTorch/sklearn",
        "Confusion matrix analysis",
        "ROC curve plotting",
        "Precision-Recall curves",
        "Statistical significance testing"
      ]
    },
    exercise: {
      title: "Exercise",
      content: [
        "Given a small dataset and task, build a baseline, improve it, and report metrics",
        "Implement multiple evaluation metrics",
        "Discuss results and next steps",
        "Iterative model improvement",
        "Final model selection and deployment"
      ]
    }
  },
  8: {
    title: "Deep Learning & Modern Architectures",
    theory: {
      title: "Modern Deep Learning",
      content: [
        "Why deep learning? Non-linearity & expressiveness",
        "CNNs: Convolutions, kernels, feature maps, pooling",
        "RNNs (brief): Sequences & time series",
        "Transformers (Optional High-Level): Attention mechanism",
        "Modern applications and use cases"
      ]
    },
    pytorch: {
      title: "PyTorch Implementation",
      content: [
        "PyTorch CNN for MNIST (small model)",
        "Convolutional layer implementation",
        "Pooling and flattening operations",
        "(Optional) Try text classification with RNN using torchtext",
        "Model architecture design"
      ]
    },
    exercise: {
      title: "Exercise",
      content: [
        "Train a small CNN on MNIST or CIFAR-10 subset",
        "Visualize sample predictions",
        "Analyze feature maps",
        "Experiment with different architectures",
        "Performance comparison with traditional ML"
      ]
    }
  }
};

export default function MachineLearningFundamentals() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<WorkshopContent | null>(null);
  const [modalType, setModalType] = useState<ModalType | null>(null);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const openModal = (week: number, type: ModalType) => {
    const content = workshopContent[week];
    setModalContent(content);
    setModalType(type);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent(null);
    setModalType(null);
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

    {/* Content Cards Section */}
    <div className="w-full bg-white px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8 justify-center items-center">
          {/* Left Card */}
          <div className="border border-gray-200 rounded-2xl bg-white shadow-lg p-8 w-full max-w-md lg:max-w-lg">
            <h2 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Hands on ML Experience
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-5 h-5 bg-blue-400 rounded-full flex items-center justify-center">
                  <Image
                    src={blueTick}                          
                    alt={"Blue Tick Icon"}
                    width={20}
                    height={20}
                    objectFit="cover"/>
                </div>
                <p className="text-gray-900 text-base leading-relaxed">
                  Build impactful projects using AI and ML
                </p>
              </div>
              
              <div className="w-full h-px bg-gray-200 rounded-full"></div>
              
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-5 h-5 bg-blue-400 rounded-full flex items-center justify-center">
                  <Image
                    src={blueTick}                          
                    alt={"Blue Tick Icon"}
                    width={20}
                    height={20}
                    objectFit="cover"/>
                </div>
                <p className="text-gray-900 text-base leading-relaxed">
                  Join study groups, workshops for cutting-edge research
                </p>
              </div>
              
              <div className="w-full h-px bg-gray-200 rounded-full"></div>
              
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-5 h-5 bg-blue-400 rounded-full flex items-center justify-center">
                  <Image
                    src={blueTick}                          
                    alt={"Blue Tick Icon"}
                    width={20}
                    height={20}
                    objectFit="cover"/>
                </div>
                <p className="text-gray-900 text-base leading-relaxed">
                  Learn to write robust software in building ML systems
                </p>
              </div>
            </div>
          </div>
          
          {/* Right Card */}
          <div className="border border-gray-200 rounded-2xl bg-white shadow-lg p-8 w-full max-w-md lg:max-w-lg">
            <h2 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Robust Professional Network
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                  <Image
                    src={darkBlueTick}                          
                    alt={"Dark Blue Tick Icon"}
                    width={20}
                    height={20}
                    objectFit="cover"/>
                </div>
                <p className="text-gray-900 text-base leading-relaxed">
                  Collaborate with peers and mentors on diverse ML teams
                </p>
              </div>
              
              <div className="w-full h-px bg-gray-200 rounded-full"></div>
              
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                  <Image
                    src={darkBlueTick}                          
                    alt={"Dark Blue Tick Icon"}
                    width={20}
                    height={20}
                    objectFit="cover"/>
                </div>
                <p className="text-gray-900 text-base leading-relaxed">
                  Network with professors, students in academic events
                </p>
              </div>
              
              <div className="w-full h-px bg-gray-200 rounded-full"></div>
              
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                  <Image
                    src={darkBlueTick}                          
                    alt={"Dark Blue Tick Icon"}
                    width={20}
                    height={20}
                    objectFit="cover"/>
                </div>
                <p className="text-gray-900 text-base leading-relaxed">
                  Engage with industry professionals in talks and workshops
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Schedule Section */}
    <div className="w-full bg-white px-4 sm:px-6 lg:px-8 pt-30">
      <div className="max-w-6xl mx-auto">
        <div className="text-left mb-12 mt-8 sm:mt-0">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">MLF Workshop Schedule</h2>
          <p className="text-lg text-gray-600">
            Timeline: Late Sep - Mid/Late Nov • 8 workshops covering fundamental ML concepts and practical implementation
          </p>
        </div>
        
        {/* Week Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {weekData.map((week) => (
            <div key={week.weekNumber} className="bg-white border border-gray-200 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow flex flex-col h-full">
              <div className="flex-1">
                <span className="font-bold text-black text-lg">Week {week.weekNumber}</span>
                <h3 className="text-gray-900 font-semibold mt-1">{week.title}</h3>
                <p className="text-sm text-gray-600 mt-2">
                  {week.description}
                </p>
              </div>
              <div className="flex gap-2 mt-4">
                <button 
                  onClick={() => openModal(week.weekNumber, 'theory')}
                  className="flex-1 bg-gradient-to-r from-purple-400 to-blue-600 text-white text-xs py-2 px-3 rounded-lg font-medium hover:from-purple-500 hover:to-blue-700 transition-colors"
                >
                  Content
                </button>
                <button 
                  onClick={() => openModal(week.weekNumber, 'pytorch')}
                  className="flex-1 bg-gradient-to-r from-purple-400 to-blue-600 text-white text-xs py-2 px-3 rounded-lg font-medium hover:from-purple-500 hover:to-blue-700 transition-colors"
                >
                  Code
                </button>
                <button 
                  onClick={() => openModal(week.weekNumber, 'exercise')}
                  className="flex-1 bg-gradient-to-r from-purple-400 to-blue-600 text-white text-xs py-2 px-3 rounded-lg font-medium hover:from-purple-500 hover:to-blue-700 transition-colors"
                >
                  Exercises
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* FAQ Section */}
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
                onClick={() => toggleFAQ(faq.id)}
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

    {/* Meet the Team Section */}
    <div className="w-full bg-white px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-left mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Meet the Team</h2>
          <p className="text-lg text-gray-600">
            Our dedicated team of ML educators bring years of experience in machine learning, deep learning, and AI education to create an engaging learning experience.
          </p>
        </div>
        
        {/* Team Members Grid */}
        <div className="bg-gray-100 rounded-2xl p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
            {teamData.map((member) => (
              <div key={member.id} className="text-center">
                <div className="w-36 h-36 mx-auto mb-4">
                  <Image
                    src={member.image}
                    alt={`${member.name} profile picture`}
                    width={144}
                    height={144}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <h3 className="font-bold text-black">{member.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>

    { /* IBM Partnership Section */ }
    <div className="w-full bg-white py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* IBM Sponsorship Section */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-black mb-12">Thank you to IBM for sponsoring us!</h2>
          
          <div className="flex justify-center">
            <Image
              src={ibmLogo}
              alt="IBM Logo"
              width={100}
              height={50}
              className="h-24 w-auto"
            />
          </div>
        </div>
      </div>
    </div>

    {/* Modal */}
    {isModalOpen && modalContent && (
      <div className="fixed inset-0 bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{modalContent.title}</h2>
                <p className="text-lg font-semibold text-purple-600 capitalize">{modalType}</p>
              </div>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 text-2xl font-bold leading-none"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-800">
                {modalType && modalContent && modalContent[modalType]?.title}
              </h3>
              <div className="space-y-2">
                {modalType && modalContent && modalContent[modalType]?.content?.map((item: string, index: number) => (
                  <p key={index} className="text-gray-700 leading-relaxed">
                    {item}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )}
  </main>
}