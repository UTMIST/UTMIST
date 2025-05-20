"use client";

import "../../styles/sponsors.css";
import { useState } from "react";

export default function ContactUsCard() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    linkedin: "",
    message: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const { email, message } = formData;
    const subject = encodeURIComponent(`Message from ${email}`);
    const body = encodeURIComponent(message);
    const mailtoLink = `mailto:utorontomist@gmail.com?subject=${subject}&body=${body}`;

    window.location.href = mailtoLink;
  };

  return (
    <div className="contact-us-card">
      {/* Left column with gradient background */}
      <div className="contact-left">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Get in touch with us right here</h2>
          <p className="text-gray-700">
            If you have any questions, feel free to reach us here and we will 
            schedule a call with you as soon as possible.
          </p>
        </div>
      </div>
      
      {/* Right column with form */}
      <div className="contact-right">
        <div>
          <div className="mb-4">
            <label htmlFor="fullName" className="contact-label">
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="contact-input"
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="email" className="contact-label">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="contact-input"
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="linkedin" className="contact-label">
              LinkedIn Profile (Optional)
            </label>
            <input
              type="url"
              id="linkedin"
              name="linkedin"
              value={formData.linkedin}
              onChange={handleChange}
              className="contact-input"
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="message" className="contact-label">
              How Can We Help You?
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={5}
              className="contact-textarea"
            />
          </div>
          
          <div className="flex justify-end mt-6">
            <button 
              type="button" 
              onClick={() => handleSubmit({ preventDefault: () => {} } as React.FormEvent<HTMLFormElement>)}
              className="contact-submit"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
