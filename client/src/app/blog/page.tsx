"use client";

import "@/styles/blog.css";
import BlogCardLarge from "@/components/cards/blog-card-large";
import dummy from "@/assets/photos/fibseq.webp";
import BlogCardSmall from "@/components/cards/blog-card-small";
import BlogListItem from "@/components/cards/blog-list-item";
import { Search } from "lucide-react";
import { useState } from "react";

const featuredPosts = {
  main: {
    title: "DeMISTify: The AI Revolution",
    date: "Explore the latest trends and breakthroughs in AI and ML. Stay ahead of the curve with our curated content.",
    image: dummy,
    url: "https://www.utmist.com/demistify",
  },
  secondary: [
    {
      title: "CPU Branch Prediction - Earliest Forms of ML",
      date: "Jan 26th 2025",
      image: dummy,
      url: "https://www.utmist.com/demistify",
    },
    {
      title: "DeMISTify: The AI Revolution",
      date: "Jan 26th 2025",
      image: dummy,
      url: "https://www.utmist.com/demistify",
    },
  ],
};

const recentPosts = [
  {
    title: "Intro to Transformers",
    date: "Feb 3rd 2025",
    image: dummy,
    url: "https://www.utmist.com/demistify/transformers",
  },
  {
    title: "RAG: Retrieval-Augmented Generation",
    date: "Feb 10th 2025",
    image: dummy,
    url: "https://www.utmist.com/demistify/rag",
  },
  {
    title: "Attention Is All You Need",
    date: "Feb 17th 2025",
    image: dummy,
    url: "https://www.utmist.com/demistify/attention",
  },
  {
    title: "Diffusion Models Demystified",
    date: "Feb 24th 2025",
    image: dummy,
    url: "https://www.utmist.com/demistify/diffusion",
  },
  {
    title: "How GPUs Actually Work",
    date: "Mar 1st 2025",
    image: dummy,
    url: "https://www.utmist.com/demistify/gpus",
  },
  {
    title: "Foundations of Reinforcement Learning",
    date: "Mar 8th 2025",
    image: dummy,
    url: "https://www.utmist.com/demistify/rl",
  },
];

const archiveList = [
  {
    title: "Understanding Backpropagation",
    date: "Jan 15th 2025",
    image: dummy,
    url: "https://www.utmist.com/demistify/backprop",
  },
  {
    title: "Neural Networks from Scratch",
    date: "Jan 8th 2025",
    image: dummy,
    url: "https://www.utmist.com/demistify/nn-scratch",
  },
  {
    title: "The Math Behind Machine Learning",
    date: "Jan 1st 2025",
    image: dummy,
    url: "https://www.utmist.com/demistify/ml-math",
  },
  {
    title: "Introduction to PyTorch",
    date: "Dec 25th 2024",
    image: dummy,
    url: "https://www.utmist.com/demistify/pytorch",
  },
  {
    title: "Deep Learning Architectures",
    date: "Dec 18th 2024",
    image: dummy,
    url: "https://www.utmist.com/demistify/architectures",
  },
  {
    title: "Natural Language Processing Basics",
    date: "Dec 11th 2024",
    image: dummy,
    url: "https://www.utmist.com/demistify/nlp",
  },
  {
    title: "Computer Vision Fundamentals",
    date: "Dec 4th 2024",
    image: dummy,
    url: "https://www.utmist.com/demistify/cv",
  },
  {
    title: "Machine Learning Optimization",
    date: "Nov 27th 2024",
    image: dummy,
    url: "https://www.utmist.com/demistify/optimization",
  },
  {
    title: "Ethics in AI",
    date: "Nov 20th 2024",
    image: dummy,
    url: "https://www.utmist.com/demistify/ethics",
  },
];

export default function BlogPage() {

  const [searchTerm, setSearchTerm] = useState("");
  const filteredArchive = archiveList.filter(
    (blog) =>
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.date.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main>
      {/* Hero Section */}
      <div className="hero-section">
        <h2 className="hero-title">DeMISTify</h2>
        <p className="hero-subtitle">UTMIST's technical content newsletter</p>
      </div>
      <div className="hero-blog-section">
        <BlogCardLarge {...featuredPosts.main} />
        <div className="flex flex-col gap-6">
          {featuredPosts.secondary.map((post, index) => (
            <BlogCardSmall key={index} {...post} />
          ))}
        </div>
      </div>

      {/* More from DeMISTify Section */}
      <div className="blog-grid-section mt-12 max-w-[1050px] mx-auto px-8">
        <h3 className="text-black text-2xl font-semibold mb-6 tracking-[-3%]">
          More from DeMISTify
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentPosts.map((blog, index) => (
            <BlogCardSmall key={index} {...blog} />
          ))}
        </div>
      </div>

      {/* Archive Section */}
      <div className="blog-archive-section mt-16 max-w-[1050px] mx-auto px-8 mb-16">
        <div className="flex flex-col items-center mb-8">
          {/* Archive Title */}
          <h3 className="text-black text-2xl font-semibold mb-2 tracking-[-3%]">
            Search Our Archive
          </h3>
          {/* Archive Description */}
          <p className="text-gray-600 text-base sm:text-lg mb-4">Find more articles from our technical content series</p>
          {/* Search Bar */}
          <div className="search-bar-container">
            <input
              type="text"
              className="search-bar-input text-sm sm:text-base"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="search-icon" />
          </div>
        </div>
        {/* Archive List */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className={`space-y-0.5 ${filteredArchive.length > 8 ? 'max-h-[480px] overflow-y-auto pr-2' : ''}`}>
            {filteredArchive.map((blog, index) => (
              <BlogListItem 
                key={index} 
                {...blog} 
                isFirst={index === 0}
                isLast={index === filteredArchive.length - 1}
              />
            ))}
            {filteredArchive.length === 0 && (
              <p className="text-center text-gray-500 py-4">No articles found matching your search.</p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
