import Image from "next/image";

import { isExternalProjectImageSrc } from "@/utils/projects";

interface ProjectImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  fill?: boolean;
  sizes?: string;
}

export default function ProjectImage({
  src,
  alt,
  className,
  width = 400,
  height = 200,
  fill = false,
  sizes,
}: ProjectImageProps) {
  if (isExternalProjectImageSrc(src)) {
    if (fill) {
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          className={className}
          style={{ objectFit: "cover", width: "100%", height: "100%" }}
        />
      );
    }

    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
        style={{ objectFit: "cover" }}
      />
    );
  }

  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        className={className}
        style={{ objectFit: "cover" }}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      style={{ objectFit: "cover" }}
    />
  );
}
