import { homePageSchema } from "@/shared/lib";
import document from "./home-page.json";

export const homePageDefinition = { key: "home", schema: homePageSchema };
const staticHomePage = homePageSchema.parse(document);
export const staticHomeSponsorItems = staticHomePage.sponsors.items;
export const homePageContent = {
  ...staticHomePage,
  sponsors: {
    ...staticHomePage.sponsors,
    items: staticHomeSponsorItems.toSorted((a, b) =>
      a.alt.replace(/ Logo$/, "").localeCompare(b.alt.replace(/ Logo$/, ""), "en")),
  },
};
