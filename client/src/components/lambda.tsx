import "../styles/eigenai.css";

export default function LamdaSection() {
  return (
    <div className="lambda-section-container px-4 sm:px-6 lg:px-8">
      <div className="lambda-inner-content max-w-screen-lg mx-auto">
        <h2 className="lambda-inner-title text-xl sm:text-2xl font-semibold mb-6">
          Ax = λx
        </h2>

        <div className="lambda-inner-row flex flex-wrap gap-4 mb-4">
          <button className="lambda-inner-badge whitespace-normal">
            Computer Vision
          </button>
          <button className="lambda-inner-badge whitespace-normal">
            ML in Health
          </button>
          <button className="lambda-inner-badge whitespace-normal">
            Generative AI
          </button>
        </div>

        <div className="lambda-inner-row flex flex-wrap gap-4 mb-4">
          <button className="lambda-inner-badge whitespace-normal">
            FinTech
          </button>
          <button className="lambda-inner-badge whitespace-normal">
            High Performance Computing
          </button>
          <button className="lambda-inner-badge whitespace-normal">
            ML in Robotics
          </button>
        </div>

        <div className="lambda-inner-row flex flex-wrap gap-4 mb-4">
          <button className="lambda-inner-badge whitespace-normal">
            ML Infrastructure
          </button>
          <button className="lambda-inner-badge whitespace-normal">
            AI Research
          </button>
          <button className="lambda-inner-badge whitespace-normal">NLP</button>
        </div>

        <h2 className="lambda-inner-description text-base sm:text-lg font-light">
          We bring together different eigenvectors – special kind of vectors
          often times with varying magnitudes and directions
        </h2>
      </div>
    </div>
  );
}
