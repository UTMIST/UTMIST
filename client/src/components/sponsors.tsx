import Image from "next/image";
import "../styles/home.css"; 
import amdLogo from "../assets/logos/amd.svg"; 
import qualcommLogo from "../assets/logos/qualcomm.svg"; 
import vectorLogo from "../assets/logos/vector.svg"; 
import googleCloudLogo from "../assets/logos/google-cloud.svg"; 


export default function Sponsors() {
    return (
        <div className="sponsors-container">
            <h3 className="sponsors-title">Backed By</h3>
            <div className="sponsors-grid">
                <Image 
                    src={amdLogo}
                    alt="AMD Logo"
                    style={{ objectFit: 'contain' }}
                />
                <Image 
                    src={qualcommLogo}
                    alt="Qualcomm Logo"
                    style={{ objectFit: 'contain' }}
                />
                <Image 
                    src={vectorLogo}   
                    alt="Vector Institute Logo"
                    style={{ objectFit: 'contain' }}
                />
                <Image 
                    src={googleCloudLogo}
                    alt="Google Cloud Logo"
                    style={{ objectFit: 'contain' }}
                />
            </div>
        </div>
    );
}