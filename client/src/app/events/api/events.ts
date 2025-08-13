// Type definitions
export interface Event {
  id: number;
  title: string;
  date: string;
  tags: string[];
}

export interface PastEvent extends Event {
  instructor: string;
  overview: string;
  learningGoals: string[];
  resources: { title: string; url: string; }[];
}

export interface UpcomingEvent extends Event {
  location: string;
  time: string;
  description: string;
  rsvpLink: string;
}

export interface FeaturedEvent {
  title: string;
  url: string;
  background: string;
  titleClassName?: string;
  titleAlignment?: 'left' | 'right';
  className?: string;
}

// Mock data
const upcomingEvents: UpcomingEvent[] = [

];

const pastEvents: PastEvent[] = [
  {
    id: 4,
    title: "Intro to RNNs & CNNs – Paper Reading Session",
    instructor: "N/A",
    date: "January 18th, 2024",
    overview: "This beginner-oriented paper reading session introduces participants to key neural network architectures: Recurrent Neural Networks (RNNs) and Convolutional Neural Networks (CNNs). Designed for those building foundational knowledge in machine learning, the session emphasizes conceptual clarity through structured discussion and peer engagement.",
    learningGoals: [
      "Understand the basic principles and use cases of RNNs and CNNs",
      "Learn how these models are applied in sequence and image-based tasks",
      "Build confidence in reading machine learning research papers",
      "Engage in collaborative discussion to reinforce conceptual understanding"
    ],
    resources: [
      {
        title: "RNN/CNN Paper Reading Notebook",
        url: "https://github.com/guaaaaa/My_ML_Notebook/blob/master/NLP.ipynb"
      }
    ],
    tags: ["Paper Reading", "Neural Networks", "CNN", "RNN", "Beginner-Friendly"]
  },
  {
    id: 5,
    title: "Understanding LSTMs – Paper Reading Session",
    instructor: "N/A",
    date: "January 25th, 2024",
    overview: "This session examines a student-authored summary on Long Short-Term Memory (LSTM) networks, emphasizing their structure, operational mechanics, and applicability in time-series forecasting and natural language processing. The paper outlines LSTM cell architecture, provides detailed forward-pass calculations, and contrasts LSTMs with traditional statistical methods like ARIMA and exponential smoothing.",
    learningGoals: [
      "Understand the internal architecture and memory mechanisms of LSTM cells",
      "Learn how LSTMs are applied in time-series forecasting and NLP tasks",
      "Analyze forward-pass computations within LSTM units using provided formulas",
      "Compare neural approaches with classical methods such as ARIMA and exponential smoothing",
      "Reinforce understanding of ML fundamentals in the context of sequence modeling"
    ],
    resources: [
      {
        title: "LSTM Architecture Paper (arXiv)",
        url: "https://arxiv.org/pdf/2105.06756"
      }
    ],
    tags: ["Paper Reading", "LSTM", "Sequence Modeling", "Time-Series", "NLP", "Beginner-Friendly"]
  },
  {
    id: 6,
    title: "Seq2Seq with Neural Networks – Paper Reading Session",
    instructor: "N/A",
    date: "February 1st, 2024",
    overview: "This session focuses on the influential paper “Sequence to Sequence Learning with Neural Networks” by Sutskever et al., which introduced a general end-to-end framework for sequence modeling using deep LSTMs. The paper demonstrates how this architecture can be applied to machine translation tasks, achieving performance competitive with traditional statistical methods. Attendees will explore the structure, innovations, and empirical results of this foundational work in neural sequence modeling.",
    learningGoals: [
      "Understand the architecture and functioning of sequence-to-sequence models",
      "Analyze the role of LSTMs in encoding and decoding sequences",
      "Examine the experimental setup and results in machine translation using BLEU scores",
      "Discuss the paper’s methodological contributions, such as input sequence reversal and hypothesis reranking",
      "Strengthen skills in interpreting and evaluating deep learning research papers"
    ],
    resources: [
      {
        title: "Sequence to Sequence Learning Paper (arXiv)",
        url: "https://arxiv.org/pdf/1409.3215"
      }
    ],
    tags: ["Paper Reading", "Seq2Seq", "LSTM", "NLP", "Deep Learning", "Machine Translation"]
  },
  {
    id: 7,
    title: "Attention in NMT – Paper Reading Session",
    instructor: "N/A",
    date: "February 8th, 2024",
    overview: "This session covers “Neural Machine Translation by Jointly Learning to Align and Translate” by Bahdanau, Cho, and Bengio—a foundational paper introducing the attention mechanism in neural machine translation. The work extends the encoder-decoder framework by enabling dynamic alignment between source and target sequences, addressing limitations of fixed-length vector representations. The paper marked a turning point in sequence modeling and laid the groundwork for modern attention-based architectures.",
    learningGoals: [
      "Understand the limitations of fixed-length encoding in sequence-to-sequence models",
      "Learn the concept and implementation of soft attention mechanisms",
      "Analyze how dynamic alignment improves translation quality",
      "Explore empirical comparisons with traditional phrase-based translation systems",
      "Interpret attention visualizations and their linguistic implications"
    ],
    resources: [
      {
        title: "Attention Mechanism Paper (arXiv)",
        url: "https://arxiv.org/pdf/1409.0473"
      }
    ],
    tags: ["Paper Reading", "Attention", "NLP", "Seq2Seq", "Neural Machine Translation", "Deep Learning"]
  },
  {
    id: 8,
    title: "Transformers: Attention Is All You Need – Paper Reading Session",
    instructor: "N/A",
    date: "February 15th, 2024",
    overview: "This session focuses on the landmark paper \"Attention Is All You Need\" by Vaswani et al., which introduced the Transformer architecture—a departure from recurrent and convolutional structures in sequence modeling. By relying solely on self-attention mechanisms, the Transformer achieved state-of-the-art performance in machine translation tasks while significantly reducing training time and improving parallelizability. This architecture laid the foundation for virtually all modern large language models.",
    learningGoals: [
      "Understand the limitations of recurrent and convolutional models in sequence transduction",
      "Learn the core components of the Transformer architecture, including self-attention and positional encoding",
      "Analyze the empirical performance of the Transformer on translation benchmarks (e.g., WMT 2014)",
      "Explore the architectural innovations that enable efficient parallel training",
      "Develop the ability to interpret and critically assess foundational deep learning research"
    ],
    resources: [
      {
        title: "Attention Is All You Need (arXiv)",
        url: "https://arxiv.org/abs/1706.03762"
      }
    ],
    tags: ["Paper Reading", "Transformer", "Attention", "Deep Learning", "NLP", "Sequence Modeling"]
  },
  {
    id: 9,
    title: "UTMIST x CSSU LaTeX Workshop",
    instructor: "N/A",
    date: "November 18th, 2023",
    overview: "This session introduces students to LaTeX, the standard tool for academic and scientific writing. Aimed at students preparing submissions for the TRUNK undergraduate journal, the workshop covers LaTeX basics, document structuring, and integration of figures and citations. The content is adapted from resources developed by PhysU and is suitable for students with little to no prior experience in technical writing.",
    learningGoals: [
      "Understand the structure and syntax of LaTeX documents",
      "Learn how to format text, sections, figures, tables, and bibliographies",
      "Gain familiarity with tools for writing, compiling, and troubleshooting LaTeX code",
      "Build the foundation for producing well-structured, publication-ready research papers"
    ],
    resources: [
      {
        title: "LaTeX Workshop – Google Drive",
        url: "https://drive.google.com/drive/u/0/folders/1mAL__3zWBSTOxl_tuqxFnjeMDj9Aogep"
      }
    ],
    tags: ["Workshop", "LaTeX", "Technical Writing", "Beginner-Friendly", "TRUNK Journal"]
  },
  {
    id: 10,
    title: "How to Read a Paper Workshop",
    instructor: "N/A",
    date: "November 25th, 2023",
    overview: "This workshop provides a structured approach to reading academic papers, with an emphasis on critical engagement and information extraction. Designed for undergraduates preparing submissions to the TRUNK journal, the session outlines practical strategies for identifying key contributions, evaluating methodology, and contextualizing findings within existing literature.",
    learningGoals: [
      "Develop techniques for efficiently reading and annotating research papers",
      "Learn how to identify research questions, experimental design, and conclusions",
      "Understand how to position one’s own work in relation to existing literature",
      "Build foundational skills for conducting literature reviews and writing introductions"
    ],
    resources: [
      {
        title: "Workshop Materials (Ask Asad Khan)",
        url: "N/A"
      }
    ],
    tags: ["Workshop", "Research Skills", "TRUNK Journal", "Academic Writing", "Beginner-Friendly"]
  },
  {
    id: 11,
    title: "Rotman Commerce Fintech Association Conference Workshop",
    instructor: "N/A",
    date: "February 8th, 2024",
    overview: "This workshop serves as an introduction to data analysis in Python, with applications relevant to quantitative finance. Participants learn to manipulate and analyze datasets using pandas, visualize data using matplotlib, and perform basic data filtering and aggregation. The session includes a hands-on component using Jupyter Notebooks and emphasizes the role of data-driven decision-making in financial contexts. No prior experience with Python data analysis is assumed.",
    learningGoals: [
      "Understand the role of data analysis in financial decision-making",
      "Learn to load, filter, and process CSV datasets using pandas",
      "Practice creating simple data visualizations using matplotlib",
      "Gain experience navigating directories, handling data files, and scripting in Python",
      "Develop familiarity with Jupyter Notebooks and GitHub Codespaces as collaborative environments",
      "Explore the concept of trend analysis and its relationship to basic machine learning principles"
    ],
    resources: [
      {
        title: "GitHub – Intro to Machine Learning in Python",
        url: "https://github.com/A-Fatir/Rotman-Commerce-FinTech-Association-Intro-to-Machine-Learning-in-Python"
      }
    ],
    tags: ["Workshop", "Python", "Data Analysis", "Finance", "Pandas", "Matplotlib", "Beginner-Friendly"]
  },
  {
    id: 12,
    title: "Prompt Engineering Workshop (Part One)",
    instructor: "N/A",
    date: "February 5th, 2024",
    overview: "This foundational session introduces attendees to prompt engineering, focusing on how to effectively interact with large language models (LLMs) like ChatGPT. Aimed at beginners across disciplines—including non-technical students and early-stage CS learners—the session emphasizes practical utility and offers a structured framework for writing effective prompts. Topics include the basic functioning of LLMs, key terminology (context windows, tokens), and prompt components such as role assignment and formatting. A live demo and interactive exercise reinforce core ideas.",
    learningGoals: [
      "Understand how LLMs interpret user input via tokens, context windows, and task formulation",
      "Learn prompt components: role prompting, context setting, output formatting, and iterative refinement",
      "Identify common pitfalls including hallucination, ambiguity, and lack of specificity",
      "Apply prompt engineering concepts to practical tasks (e.g., summarizing notes, writing marketing emails)",
      "Engage in hands-on exercise to build and critique structured prompts"
    ],
    resources: [],
    tags: ["Workshop", "Prompt Engineering", "LLM", "ChatGPT", "Beginner-Friendly", "Interactive"]
  },
  {
    id: 13,
    title: "Prompt Engineering Workshop (Part Two)",
    instructor: "N/A",
    date: "February 12th, 2024",
    overview: "This advanced session builds on foundational knowledge from the previous workshop, exploring more nuanced techniques in prompt engineering. Attendees will analyze multi-step prompts, experiment with tone and persona modulation, and engage with advanced strategies such as few-shot prompting, zero-shot prompting, and chain-of-thought prompting. The session balances theoretical concepts with applied use cases drawn from job preparation, research tasks, and creative writing, offering attendees concrete tools for high-impact LLM interaction.",
    learningGoals: [
      "Apply advanced prompting techniques, including few-shot and chain-of-thought approaches",
      "Refine prompt outputs by adjusting tone, structure, and task decomposition",
      "Explore domain-specific applications: job seeking, research, coding, and writing",
      "Learn how to debug or iterate prompts for improved clarity and control",
      "Critically evaluate LLM output and recognize signs of model hallucination"
    ],
    resources: [
      {
        title: "OpenAI Prompt Engineering Guide",
        url: "https://platform.openai.com/docs/guides/prompt-engineering"
      }
    ],
    tags: ["Workshop", "Prompt Engineering", "Advanced", "LLM", "Chain-of-Thought", "Few-Shot"]
  },
  {
    id: 14,
    title: "SciML Workshop Series – Session 1",
    instructor: "N/A",
    date: "March 7th, 2024",
    overview: "The first session in the SciML workshop series introduces scientific machine learning concepts with a focus on physics-informed neural networks (PINNs). It begins with a high-level overview of SciML’s relevance in scientific computing and engineering, covering how neural networks can be adapted to model physical systems through loss functions derived from governing equations. The session is divided between theoretical exposition and hands-on engagement with tutorial notebooks.",
    learningGoals: [
      "Understand the motivation and scope of Scientific Machine Learning (SciML)",
      "Learn the basic principles behind PINNs and their use in solving PDEs",
      "Explore how physical constraints are embedded into model training",
      "Get introduced to NVIDIA’s SciML tooling and notebooks",
      "Prepare for advanced applications in climate modeling and operator learning"
    ],
    resources: [
      {
        title: "UTMIST SciML Workshop Session 1 – YouTube",
        url: "https://www.youtube.com/watch?v=-kbhtHKjg90"
      }
    ],
    tags: ["Workshop", "Scientific Machine Learning", "PINNs", "PDEs", "SciML", "Physics-Informed"]
  },
  {
    id: 15,
    title: "SciML Workshop Series – Session 2",
    instructor: "N/A",
    date: "March 14th, 2024",
    overview: "This session continues the exploration of physics-informed learning, focusing on inverse problems using PINNs. Participants analyze how loss functions can be constructed to infer parameters from observational data under physical constraints. The session includes a coding walkthrough and discussion of best practices in applying PINNs to real-world scientific problems.",
    learningGoals: [
      "Analyze the structure of inverse problems in physical systems",
      "Learn to formulate PINNs that estimate system parameters from data",
      "Understand convergence challenges and model validation in scientific settings",
      "Apply theory through practical coding with Jupyter notebooks"
    ],
    resources: [
      {
        title: "UTMIST SciML Workshop Session 2 – YouTube",
        url: "https://www.youtube.com/watch?v=Xe69HiBuyLI"
      }
    ],
    tags: ["Workshop", "Scientific Machine Learning", "PINNs", "Inverse Problems", "SciML", "Physics-Informed"]
  },
  {
    id: 16,
    title: "SciML Workshop Series – Session 3",
    instructor: "N/A",
    date: "March 28th, 2024",
    overview: "The third session introduces operator learning as a paradigm for function-to-function regression, with emphasis on the Fourier Neural Operator (FNO). Participants are introduced to the distinction between classical neural networks and operator-based methods for modeling scientific systems. This session is held online and includes both theoretical insights and implementation walkthroughs.",
    learningGoals: [
      "Distinguish between neural networks and neural operators in functional learning",
      "Understand the motivation for infinite-dimensional learning in scientific domains",
      "Analyze FNO architecture and its advantages in modeling PDE-based systems",
      "Practice implementing operator learning via tutorial notebooks"
    ],
    resources: [
      {
        title: "UTMIST SciML Workshop Session 3 – YouTube",
        url: "https://www.youtube.com/watch?v=0iMJYWLhNdY"
      }
    ],
    tags: ["Workshop", "Scientific Machine Learning", "Operator Learning", "FNO", "PDEs", "SciML"]
  },
  {
    id: 17,
    title: "SciML Workshop Series – Session 4",
    instructor: "Ben Mosely (ICL)",
    date: "April 4th, 2024",
    overview: "The final session synthesizes learnings from the series with a focus on end-to-end application of SciML to climate modeling using NVIDIA’s pre-trained models and frameworks. With contributions from guest lecturer Ben Mosely (ICL), this session demonstrates how trained SciML models are applied in real-world, high-impact domains like environmental forecasting. Emphasis is placed on scalability, computational concerns, and model evaluation.",
    learningGoals: [
      "Learn how SciML models are deployed in complex application areas like climate science",
      "Understand the structure and purpose of NVIDIA-trained models",
      "Examine the integration of domain-specific physical knowledge into scalable architectures",
      "Discuss future directions and practical challenges in SciML research and deployment"
    ],
    resources: [
      {
        title: "UTMIST SciML Workshop Session 4 – YouTube",
        url: "https://www.youtube.com/watch?v=k5wwxhd3PGw"
      }
    ],
    tags: ["Workshop", "Scientific Machine Learning", "Climate Modeling", "NVIDIA", "SciML", "Environmental Forecasting"]
  },
  {
    id: 18,
    title: "RL Tourney Workshop Series – Session 1",
    instructor: "N/A",
    date: "November 6th, 2023",
    overview: "The first session of the Reinforcement Learning (RL) workshop introduces core RL concepts through the multi-armed bandit problem and Markov Decision Processes (MDPs). Targeted at beginners, the session explains fundamental ideas such as exploration vs. exploitation, policies, and value functions. The session is primarily lecture-based with minimal coding, intended to establish the theoretical foundation for more hands-on components in later sessions.",
    learningGoals: [
      "Understand the exploration vs. exploitation tradeoff using k-armed bandits",
      "Define and interpret policies, value functions, and Markov Decision Processes",
      "Learn how RL agents estimate expected returns and make decisions",
      "Set up expectations for RL environments used later (e.g., Blackjack)"
    ],
    resources: [
      {
        title: "GitHub - AI2 RL Workshop 2024",
        url: "https://github.com/UTMIST/AI2-RL-2024-Workshop"
      },
      {
        title: "Video Recording Week 1",
        url: "https://www.youtube.com/watch?v=WKzhNvPtEmM" // placeholder link
      }
    ],
    tags: ["Workshop", "Reinforcement Learning", "MDP", "Bandits", "Beginner-Friendly"]
  },
  {
    id: 19,
    title: "RL Tourney Workshop Series – Session 2",
    instructor: "N/A",
    date: "November 13th, 2023",
    overview: "This session extends the RL framework by covering dynamic programming methods, including policy iteration and Monte Carlo techniques. Students begin applying value-based methods for policy evaluation and improvement. The structure includes recap of week one, followed by more detailed coding segments aligned with theoretical content.",
    learningGoals: [
      "Review core RL definitions and mechanisms (MDPs, policies, returns)",
      "Learn the intuition and mechanics behind policy iteration",
      "Understand Monte Carlo methods for value estimation from sampled episodes",
      "Begin applying RL algorithms to simple environments with minimal frameworks"
    ],
    resources: [
      {
        title: "GitHub - AI2 RL Workshop 2024",
        url: "https://github.com/UTMIST/AI2-RL-2024-Workshop"
      },
      {
        title: "Video Recording Week 2",
        url: "https://www.youtube.com/watch?v=nhkUka8h2-8" // placeholder link
      }
    ],
    tags: ["Workshop", "Reinforcement Learning", "Dynamic Programming", "Monte Carlo", "Beginner-Friendly"]
  },
  {
    id: 20,
    title: "RL Tourney Workshop Series – Session 3",
    instructor: "N/A",
    date: "November 20th, 2023",
    overview: "The third session focuses on temporal-difference learning methods, with an emphasis on SARSA and Q-Learning. As the most hands-on session in the series, participants will implement and compare TD-based algorithms. The focus is on bridging theoretical understanding and functional implementation.",
    learningGoals: [
      "Learn the differences between Monte Carlo and TD learning approaches",
      "Implement SARSA and Q-Learning from scratch",
      "Evaluate performance on tabular environments such as cliff walking",
      "Gain a practical understanding of value updates and policy improvements"
    ],
    resources: [
      {
        title: "GitHub - AI2 RL Workshop 2024",
        url: "https://github.com/UTMIST/AI2-RL-2024-Workshop"
      },
      {
        title: "Video Recording Week 3",
        url: "https://www.youtube.com/watch?v=eTPJDzjZ0b8" // placeholder link
      }
    ],
    tags: ["Workshop", "Reinforcement Learning", "Temporal Difference", "SARSA", "Q-Learning"]
  },
  {
    id: 21,
    title: "RL Tourney Workshop Series – Session 4",
    instructor: "N/A",
    date: "November 27th, 2023",
    overview: "The final session features a guest lecture and research presentation on Deep Reinforcement Learning. It moves beyond tabular methods to discuss modern approaches using function approximation, with insights into ongoing academic research. This session is lecture-oriented and designed to contextualize RL in real-world and high-complexity domains.",
    learningGoals: [
      "Understand how deep neural networks integrate into reinforcement learning frameworks",
      "Learn about the limitations of tabular methods and motivations for deep RL",
      "Explore ongoing research in reinforcement learning",
      "Connect workshop concepts with advanced applications in academic and industry research"
    ],
    resources: [
      {
        title: "GitHub - AI2 RL Workshop 2024",
        url: "https://github.com/UTMIST/AI2-RL-2024-Workshop"
      },
      {
        title: "Video Recording Week 4",
        url: "https://www.youtube.com/watch?v=w0jXFvleV68" // placeholder link
      }
    ],
    tags: ["Workshop", "Reinforcement Learning", "Deep RL", "Function Approximation", "Research"]
  },
  {
    id: 22,
    title: "EigenAI ML Workshop",
    instructor: "N/A",
    date: "September 28th, 2023",
    overview: "This workshop introduces machine learning enthusiasts to the foundational principles of diffusion models, with a focus on high-level understanding and hands-on implementation. The session balances conceptual instruction with a practical coding segment in which participants interact with both forward and reverse diffusion processes using pre-trained models. The workshop is accessible to beginners with some prior exposure to neural networks and generative modeling.",
    learningGoals: [
      "Understand the basic principles of generative modeling and its historical context",
      "Distinguish between conditional and unconditional generation",
      "Learn the structure and intuition behind diffusion models and noise scheduling",
      "Explore the forward process (adding noise) and reverse process (denoising) in generative workflows",
      "Analyze the architecture and training loop of a diffusion model, including L2 loss minimization and U-Net architecture",
      "Gain exposure to latent diffusion models as used in tools like Stable Diffusion",
      "Apply learned concepts through a guided coding notebook implementing core components of a diffusion model"
    ],
    resources: [
      {
        title: "GitHub – UTMIST EigenAI 2024 Workshop",
        url: "https://github.com/UTMIST/EigenAI-2024-Workshop"
      }
    ],
    tags: ["Workshop", "Diffusion Models", "Generative Modeling", "U-Net", "Stable Diffusion", "Machine Learning", "Beginner-Friendly"]
  }
  
  
];

const featuredEvents: FeaturedEvent[] = [
  {
    title: "EigenAI",
    url: "/eigenai",
    background: 'linear-gradient(135deg, #e57fe5 0%, #8055e6 50%, #4099ee 100%)',
    titleClassName: 'title-large',
    titleAlignment: 'left',
    className: 'featured-card-large'
  },
  {
    title: "GenAI\nGenesis",
    url: "https://genaigenesis.ca",
    background: 'linear-gradient(135deg, #9966ff 0%, #4040e5 100%)',
    titleClassName: 'title-medium',
    titleAlignment: 'right'
  },
  {
    title: "AI^2",
    url: "/ai2",
    background: 'linear-gradient(135deg, #e57fe5 0%, #6655e6 100%)',
    titleClassName: 'title-large',
    titleAlignment: 'right',
    className: 'featured-card-large'
  },
  {
    title: "Project\nShowcase",
    url: "/showcase",
    background: 'linear-gradient(135deg, #372a5b 0%, #8673a1 50%, #e5a2d3 100%)',
    titleClassName: 'title-small',
    titleAlignment: 'left'
  }
];

// API functions
export async function getUpcomingEvents(): Promise<UpcomingEvent[]> {
  // Simulate API delay
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(upcomingEvents);
    }, 500);
  });
}

export async function getPastEvents(): Promise<PastEvent[]> {
  // Simulate API delay
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(pastEvents);
    }, 500);
  });
}

export async function getFeaturedEvents(): Promise<FeaturedEvent[]> {
  // Simulate API delay
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(featuredEvents);
    }, 500);
  });
}