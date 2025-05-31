
import "../styles/eigenai.css";

export default function LamdaSection() {
    return (
        <div className="lambda-section-container">
        <div className="lambda-inner-content">
            <h2 className="lambda-inner-title">
            Ax = λx
            </h2>
            <div className="lambda-inner-row">
                <button className="lambda-inner-badge">
                    Computer Vision
                </button>
                <button className="lambda-inner-badge">
                    ML in Health
                </button>
                <button className="lambda-inner-badge">
                Generative AI                
                </button>
            </div>
            <div className="lambda-inner-row">
                <button className="lambda-inner-badge">
                    FinTech
                </button>
                <button className="lambda-inner-badge">
                    High Performance Computing
                </button>
                <button className="lambda-inner-badge">
                ML in Robotics          
                </button>
            </div>
            <div className="lambda-inner-row">
                <button className="lambda-inner-badge">
                    ML Infrastructure
                </button>
                <button className="lambda-inner-badge">
                    AI Research
                </button>
                <button className="lambda-inner-badge">
                    NLP    
                </button>
            </div>
            <h2 className="lambda-inner-description">
            We bring together different eigenvectors - special kind of vectors often times with varying magnitudes and directions
            </h2>
        </div>
        </div>
    )
}