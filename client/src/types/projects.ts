import { StaticImageData } from "next/image";

export enum ProjectType {
    genai = "genai",
    cvpr = "cvpr",
    finml = "finml",
    medai = "medai",
    supvlr = "supvlr",
    mlops = "mlops",
    aiapps = "aiapps",
  }

export interface Project {
  title: string;
  description: string;
  github?: string;
  image: StaticImageData;
  imageAltText?: string;
  type: ProjectType;
  readMoreLink: string;
}
