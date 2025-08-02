"use client";

import "@/styles/blog.css";
import BlogCardLarge from "@/components/cards/blog-card-large";
import BlogCardSmall from "@/components/cards/blog-card-small";
import BlogListItem from "@/components/cards/blog-list-item";
import HeroSection from "@/components/heroSection";
import { Search, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { BlogPost, getFeaturedPosts, getRecentPosts, getArchivePosts } from "./api/blog";

export default function BlogPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAtBottom, setIsAtBottom] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [featuredPosts, setFeaturedPosts] = useState<BlogPost[]>([]);
  const [recentPosts, setRecentPosts] = useState<BlogPost[]>([]);
  const [archiveList, setArchiveList] = useState<BlogPost[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const [featuredRes, recentRes, archiveRes] = await Promise.all([
        getFeaturedPosts(),
        getRecentPosts(),
        getArchivePosts()
      ]);
      setFeaturedPosts(featuredRes);
      setRecentPosts(recentRes);
      setArchiveList(archiveRes);
    }
    fetchData().then(() => setLoading(false));
  }, []);

  // Handle scroll event
  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
      const isBottom = Math.abs(scrollHeight - clientHeight - scrollTop) < 1;
      setIsAtBottom(isBottom);
    }
  };

  const filteredArchive = archiveList.filter(
    (blog) =>
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.date.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <main className="flex flex-col items-center justify-center py-20" style={{color: 'var(--muted-foreground)'}}>
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mb-4" />
        <p>Loading blog content...</p>
      </main>
    );
  }
  

  return (
    <main>
      <HeroSection title="DeMISTify" subtitle="UTMIST&apos;s technical content newsletter" />
      {/* Hero Section */}
      {/* <div className="hero-section">
        <h2 className="hero-title">DeMISTify</h2>
        <p className="hero-subtitle">UTMIST&apos;s technical content newsletter</p>
      </div> */}
      <div className="max-w-[1050px] mx-auto px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 self-start">
            {featuredPosts.length > 0 && <BlogCardLarge {...featuredPosts[0]} />}
          </div>
          <div className="flex flex-col gap-6 self-start">
            {featuredPosts.slice(1).map((post, index) => (
              <BlogCardSmall key={index} {...post} />
            ))}
          </div>
        </div>
      </div>

      {/* More from DeMISTify Section */}
      <div className="blog-grid-section mt-12 max-w-[1050px] mx-auto px-8">
        <h3 className="text-2xl font-semibold mb-6 tracking-[-3%]" style={{color: 'var(--foreground)'}}>
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
          <h3 className="text-2xl font-semibold mb-2 tracking-[-3%]" style={{color: 'var(--foreground)'}}>
            Search Our Archive
          </h3>
          {/* Archive Description */}
          <p className="text-base sm:text-lg mb-4" style={{color: 'var(--muted-foreground)'}}>Find more articles from our technical content series</p>
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
        <div className="rounded-xl p-4 sm:p-5 border shadow-sm relative" style={{backgroundColor: 'var(--card)', borderColor: 'var(--border)'}}>
          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className={`space-y-[0.25rem] overflow-y-auto px-0.5 scrollbar max-h-[320px] sm:max-h-[480px]`}
            style={{ overscrollBehavior: 'contain' }}
          >
            {filteredArchive.map((blog, index) => (
              <BlogListItem
                key={index}
                {...blog}
                isFirst={index === 0}
                isLast={index === filteredArchive.length - 1}
              />
            ))}
            {filteredArchive.length === 0 && (
              <p className="text-center py-4" style={{color: 'var(--muted-foreground)'}}>
                No articles found matching your search.
              </p>
            )}
          </div>
          {/* Show more button */}
          {filteredArchive.length > 4 && !isAtBottom && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 sm:hidden backdrop-blur rounded-full p-1 shadow-sm animate-bounce flex items-center justify-center w-7 h-7" style={{backgroundColor: 'var(--background)/80'}}>
              <ChevronDown className="w-5 h-5" style={{color: 'var(--muted-foreground)'}} />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
