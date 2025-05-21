import React from 'react';
import "../styles/home.css";
import { Pen, Laptop, Wrench } from 'lucide-react';

const ValueProps: React.FC = () => {
  return (
    <div className="conference-container">
      <div className="content-grid">
        <div className="conference-header">
          <h1>Build Real Skills in AI—<br />From Writing to Workshops to Engineering and Research</h1>
        </div>
        
        <div className="features-list">
          <div className="feature-item">
            <div className="icon-container purple">
              <Pen />
            </div>
            <div className="feature-content">
              <h2>Craft technical articles and notebooks</h2>
              <p>
                a student-led AI conference featuring hands-on workshops, expert talks, and 
                diverse perspectives across fields like fintech, healthcare, and robotics.
              </p>
            </div>
          </div>
          
          <div className="feature-item">
            <div className="icon-container blue">
              <Laptop />
            </div>
            <div className="feature-content">
              <h2>Join and contribute to industry leading AI/ML workshops</h2>
              <p>
                a student-led AI conference featuring hands-on workshops, expert talks, and 
                diverse perspectives across fields like fintech, healthcare, and robotics.
              </p>
            </div>
          </div>
          
          <div className="feature-item">
            <div className="icon-container pink">
              <Wrench />
            </div>
            <div className="feature-content">
              <h2>Drive impact with engineering and research projects</h2>
              <p>
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