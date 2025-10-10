import * as ai2Assets from "@/assets/photos/ai2";
import * as headshots from "@/assets/photos/ai2/headshots";
import tenstorrent from "@/assets/photos/ai2/sponsors/tt.webp";
import artificalAgency from "@/assets/photos/ai2/sponsors/artificial_agency.webp";

export const specialThanks = [
  { name: "Andrew Magnuson", role: "Eng Sci @ UofT", profileURL: "", profileImage: headshots.andrew },
  { name: "Doga Baskan", role: "Eng Sci @ UofT", profileURL: "", profileImage: headshots.doga },
  { name: "Kaden Seto", role: "Eng Sci @ UofT", profileURL: "", profileImage: headshots.kaden },
  { name: "Martin Tin", role: "Eng Sci @ UofT", profileURL: "", profileImage: headshots.martin },
  { name: "Matthew Tamura", role: "Eng Sci @ UofT", profileURL: "", profileImage: headshots.matthew },
  { name: "Ambrose Ling", role: "ECE @ UofT", profileURL: "", profileImage: headshots.ambrose },
];

export const aiSquaredDetails = [
  { image: ai2Assets.cube_1.src, title: "Explore AI in Games", text: "Are you a beginner? Don't worry, we will show you the ropes!" },
  { image: ai2Assets.cube_2.src, title: "Train your own agent", text: "Brainstorm, experiment, and show us your best strategy" },
  { image: ai2Assets.cube_3.src, title: "Battle other opponents", text: "Jump onto the platforms and take down the competition!" },
];

export const sponsorsLogos = [
  { image: tenstorrent, alt: "Tenstorrent", url: "https://www.tenstorrent.com/", tier: "Platinum", name: "Tenstorrent" },
  { image: artificalAgency, alt: "Artificial Agency", url: "https://www.artificial.agency/", tier: "Gold", name: "Artificial Agency" },
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

export const kickOff = [
  {
    cardTitle: 'Registration',
    cardSubtitle: '9:30AM - 10:00AM',
  },
  {
    cardTitle: 'Opening Ceremony',
    cardSubtitle: '10:00AM - 10:30AM',
  },
  {
    cardTitle: 'Networking & Team-Building',
    cardSubtitle: '10:30AM - 11:00AM',
    cardDetailedText: 'In-Person or Discord',
  },
  {
    cardTitle: 'Introduction to the RL Paradigm',
    cardSubtitle: '11:00AM - 12:00PM',
    cardDetailedText: 'UTMIST Academics Department Workshop',
  },
  {
    cardTitle: 'AI Squared Codebase Walkthrough',
    cardSubtitle: '12:00PM - 12:30PM',
  },
  {
    cardTitle: 'Lunch',
    cardSubtitle: '12:30PM - 1:30PM',
  },
  {
    cardTitle: 'TBD',
    cardSubtitle: '1:30PM - 1:30PM',
    cardDetailedText: 'Workshop 2',
  },
  {
    cardTitle: 'TBD',
    cardSubtitle: '2:45PM - 3:45PM',
    cardDetailedText: 'Workshop 3',
  },
  {
    cardTitle: 'Worksession/Mentoring/Networking',
    cardSubtitle: '3:45PM - 4:30PM',
  },
  {
    cardTitle: 'Closing Ceremony',
    cardSubtitle: '4:30PM - 5:00PM',
  },
];

export const finalsBracket = [
  {
    cardTitle: 'Registration',
    cardSubtitle: '9:30AM - 10:00AM',
  },
  {
    cardTitle: 'Opening Ceremony',
    cardSubtitle: '10:00AM - 10:30AM',
  },
  {
    cardTitle: 'Round 1',
    cardSubtitle: '10:30AM - 11:00AM',
    cardDetailedText: 'M1 - M6, 6 matches',
  },
  {
    cardTitle: 'Speaker',
    cardSubtitle: '11:00AM - 12:00PM',
    cardDetailedText: 'Gaming Industry (TBA)',
  },
  {
    cardTitle: 'Lunch',
    cardSubtitle: '12:00PM - 1:00PM',
  },
  {
    cardTitle: 'Round 2',
    cardSubtitle: '10:30AM - 11:00AM',
    cardDetailedText: 'M7 – M11: 5 matches',
  },
  {
    cardTitle: 'Panel',
    cardSubtitle: '2:00PM - 3:00PM',
    cardDetailedText: 'Character Behaviour in Games',
  },
  {
    cardTitle: 'Round 3',
    cardSubtitle: '3:00PM - 3:15PM',
    cardDetailedText: 'M12 – M13: 2 matches',
  },
  {
    cardTitle: 'Networking',
    cardSubtitle: '3:15PM - 4:00PM',
  },
  {
    cardTitle: 'Closing Ceremony',
    cardSubtitle: '4:00PM - 5:00PM',
  },
];

export const agentDevelopment = [
  {
    cardTitle: 'Hacking with your teammates!',
    cardSubtitle: 'Morning 🥐 - Late night ☕',
  },
  {
    cardTitle: 'Mentor Sessions',
    cardSubtitle: 'If you need help, we got you! Book a session with one of our mentors.',
  },
];

export const ai2Logo = ai2Assets.logo_sketch;
