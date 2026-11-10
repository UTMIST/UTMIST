import { homePageSchema } from "@/shared/lib";
import document from "./home-page.json";

export const homePageDefinition = { key: "home", schema: homePageSchema };
export const homePageContent = homePageSchema.parse(document);
