import { motion } from "framer-motion";
import Image from "next/image";

interface CardProps {
  title: string;
  description: string;
  image?: string;
}

export function AI2Card({ title, description, image }: CardProps) {
  return (
    <motion.div
      className="bg-white/70 rounded-2xl p-6 shadow-lg h-110 w-80"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      whileHover={{
        scale: 1.05,
        boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
      }}
    >
      {image && (
        <div className="relative mx-auto mb-4 w-60 h-40 mt-20 rounded-full overflow-hidden">
          <Image
            src={image}
            alt={title}
            fill
            style={{ objectFit: "cover" }}
            className="rounded-full"
            priority={true}
          />
        </div>
      )}
      <h3 className="whats-new-h1">{title}</h3>
      <p className="mt-2 text-gray-700">{description}</p>
    </motion.div>
  );
}
