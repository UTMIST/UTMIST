import * as ai2Assets from "@/assets/photos/ai2";
import * as headshots from "@/assets/photos/ai2/headshots";

export const specialThanks = [
  { name: "Andrew Magnuson", role: "Eng Sci @ UofT", profileURL: "", profileImage: headshots.andrew },
  { name: "Doga Baskan", role: "Eng Sci @ UofT", profileURL: "", profileImage: headshots.doga },
  { name: "Kaden Seto", role: "Eng Sci @ UofT", profileURL: "", profileImage: headshots.kaden },
  { name: "Martin Tin", role: "Eng Sci @ UofT", profileURL: "", profileImage: headshots.martin },
  { name: "Matthew Tamura", role: "Eng Sci @ UofT", profileURL: "", profileImage: headshots.matthew },
  { name: "Ambrose Ling", role: "ECE @ UofT", profileURL: "", profileImage: headshots.ambrose },
];

export const aiSquaredDetails = [
  { image: ai2Assets.cube_1.src, title: "Explore the realm of RL", text: "Are you a beginner? Don't worry, we will show you the ropes!" },
  { image: ai2Assets.cube_2.src, title: "Train your own agent", text: "Brainstorm, experiment, and show us your best strategy" },
  { image: ai2Assets.cube_3.src, title: "Battle other opponents", text: "Jump onto the platforms and take down the competition!" },
];

export const newFeatures = [
  { 
    title: "New Weapons", 
    desc: "Unleash devastating new weapons that can turn the tide of battle — adapt your strategy or be outmatched!", 
    img: ai2Assets.new_weapons.src 
  },
  { 
    title: "Interactive Environment", 
    desc: "Battle in arenas that fight back — use moving platforms, learn the new terrain to outsmart your opponent", 
    img: ai2Assets.interactive_environment.src 
  },
  { 
    title: "Better Customization", 
    desc: "Tailor your agent’s skills, style, and personality to dominate the competition in your own unique way", 
    img: ai2Assets.better_customization.src 
  },
];

export const timelineEvents = [
  {
    cardTitle: 'Kickoff',
    cardSubtitle: 'October 25',
    cardDetailedText: 'A day of workshops and guest speakers',
  },
  {
    cardTitle: 'Agent Development',
    cardSubtitle: 'October 25 - November 1',
    cardDetailedText: 'Build and train your agent fighters',
  },
  {
    cardTitle: 'Finals Bracket',
    cardSubtitle: 'November 2',
    cardDetailedText: 'Watch the top teams battle it out in the bracket',
  },
];

export const ai2Logo = ai2Assets.logo_sketch;
