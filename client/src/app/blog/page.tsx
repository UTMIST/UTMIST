import "@/styles/blog.css";
import BlogCardLarge from "@/components/cards/blog-card-large";
import dummy from "@/assets/photos/fibseq.webp";
import BlogCardSmall from "@/components/cards/blog-card-small";
export default function BlogPage() {
  const blogList = [
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

  return (
    <main>
      <div className="justify-content-center items-center flex flex-col">
        <div className="hero-section">
          <h2 className="hero-title">DeMISTify</h2>
          <p className="hero-subtitle">UTMIST’s technical content newletter</p>
        </div>
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between sm:items-start sm:px-56 px-4">
          <BlogCardLarge
            title="DeMISTify: The AI Revolution"
            date="Explore the latest trends and breakthroughs in AI and ML. Stay ahead of the curve with our curated content."
            image={dummy}
            url="https://www.utmist.com/demistify"
          />
          <BlogCardSmall
            title="CPU Branch Prediction - Earliest Forms of ML"
            date="Jan 26th 2025"
            image={dummy}
            url="https://www.utmist.com/demistify"
          />
          <BlogCardSmall
            title="DeMISTify: The AI Revolution"
            date="Jan 26th 2025"
            image={dummy}
            url="https://www.utmist.com/demistify"
          />
        </div>
        <div className="blog-grid-section mt-12 px-4 sm:px-0 max-w-7xl mx-auto">
          <h3 className="text-black text-2xl font-semibold mb-3 tracking-[-3%] text-center sm:text-left max-w-7xl mx-auto px-4 sm:px-0">
            More from DeMISTify
          </h3>
          <div className="flex justify-center">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-7xl w-full px-4 sm:px-0">
              {blogList.map((blog, index) => (
                <BlogCardSmall
                  key={index}
                  title={blog.title}
                  date={blog.date}
                  image={blog.image}
                  url={blog.url}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
