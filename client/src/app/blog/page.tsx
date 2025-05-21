import "@/styles/blog.css"  
import BlogCardLarge from "@/components/cards/blog-card-large";
import dummy from "@/assets/photos/fibseq.png";
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
        <div className="hero-section">
          <h2 className="hero-title">DeMISTify</h2>
          <p className="hero-subtitle">
          UTMIST’s technical content newletter
          </p>
        </div>  
        <div className="hero-blog-section">
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

        <div className="blog-grid-section mt-12 px-56">
        <h3 className="text-black text-2xl font-semibold mb-3 tracking-[-3%]">More from DeMISTify</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
        </main>
    )
  }