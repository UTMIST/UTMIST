import Image from "next/image";

interface PhaseCardProps {
  title: string;
  items: string[];
  icon: any;
  iconBgColor: string;
  paddingLeft?: string;
}

export default function PhaseCard({ 
  title, 
  items, 
  icon, 
  iconBgColor, 
  paddingLeft = "pl-8 lg:pl-16" 
}: PhaseCardProps) {
  return (
    <div className="border border-gray-200 rounded-2xl bg-white shadow-lg p-4 w-full max-w-md lg:max-w-md">
      <h2 className="text-2xl font-bold text-center mb-6" style={{
        background: "var(--gradient-bl1)",
        backgroundClip: "text",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        fontFamily: "var(--system-font)"
      }}>
        {title}
      </h2>
      
      <div className={`space-y-4 ${paddingLeft}`}>
        {items.map((item, index) => (
          <div key={index}>
            <div className="flex items-start space-x-3">
              <div className={`flex-shrink-0 w-5 h-5 ${iconBgColor} rounded-full flex items-center justify-center`}>
                <Image
                  src={icon}
                  alt={`${title} Tick Icon`}
                  width={20}
                  height={20}
                  objectFit="cover"
                />
              </div>
              <p className="text-gray-900 text-md font-extralight leading-relaxed" style={{
                fontFamily: "var(--system-font)"
              }}>
                {item}
              </p>
            </div>
            
            {index < items.length - 1 && (
              <div className="w-full h-px bg-gray-200 rounded-full"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
