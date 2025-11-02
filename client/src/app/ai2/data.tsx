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
    title: "9:30AM",
    cardTitle: 'Registration',
  },
  {
    title: "10:00AM",
    cardTitle: 'Opening Ceremony',
    // cardSubtitle: 'Keynote Speaker: Tyler Smith - Lead Software Engineer @ AI Warehouse',
  },
  {
    title: "10:30AM",
    cardTitle: 'Networking & Team-Building',
    cardDetailedText: 'In-Person and Discord',
  },
  {
    title: "11:00AM",
    cardTitle: 'Introduction to the Reinforcement Learning Paradigm',
    cardSubtitle: 'Jingmin Wang - RL Researcher @ LEAF Lab',
    cardDetailedText: 'Explore key concepts of reinforcement learning such as rewards, policies, and Markov Decision Process so you can start building your own AI Squared agent that can even outsmart a human player!',
  },
  {
    title: "12:00PM",
    cardTitle: 'AI Squared Codebase Walkthrough',
    cardSubtitle: 'Martin Tin, Kaden Seto - AI Squared Game Leads',
    cardDetailedText: 'Get familiar with the AI Squared codebase, tools, and resources to kickstart your agent development!',
  },
  {
    title: "12:30PM",
    cardTitle: 'Lunch',
  },
  {
    title: "1:30PM",
    cardTitle: 'How the Gaming Industry is Shifting to Agents (with Artificial Agency)',
    cardSubtitle: 'Russell Sng - Strategic Growth & Developer Relations @ Artificial Agency',
    cardDetailedText: 'Discover how AI agents are transforming the future of gameplay with insights from Russell Sng, a leader in AI-driven game innovation.',
  },
  {
    title: "2:45PM",
    cardTitle: 'Deploying Neural Networks on Tenstorrent Hardware',
    cardSubtitle: 'Ambrose Ling - Machine Learning Engineer Intern @ Tenstorrent',
    cardDetailedText: 'Get a brief overview of the inner workings of Tenstorrent hardware architecture and a dive into the Tenstorrent software stack of ttnn (python operator library) and tt-metal (low-level programming model).',
  },
  {
    title: "3:45PM",
    cardTitle: 'Networking and Work Session',
  },
  {
    title: "4:30PM",
    cardTitle: 'Closing Ceremony',
  },
];

export const finalsBracket = [
  {
    title: "9:30AM",
    cardTitle: 'Registration',
  },
  {
    title: "10:00AM",
    cardTitle: 'Opening Ceremony',
  },
  {
    title: "10:30AM",
    cardTitle: 'Tournament Bracket Round 1',
    // cardDetailedText: 'M1 - M6, 6 matches',
  },
  {
    title: "11:00AM",
    cardTitle: 'Designing AI for Fun in Games',
    cardSubtitle: 'Chunlok Lo - Software Engineer @ Riot Games',
    cardDetailedText: 'Having an AI that\'s good at a video game doesn\'t necessarily make the game more fun, but that\'s only because we aren\'t designing them for fun! In fact, AI is essential in creating the fun in many modern video games and they wouldn\'t be the same with it. Come learn about the many ways AI is used to make games more fun and what goes into designing and creating them.',
  },
  {
    title: "12:00PM",
    cardTitle: 'Lunch',
  },
  {
    title: "1:00PM",
    cardTitle: 'Tournament Bracket Round 2',
    // cardDetailedText: 'M7 – M11: 5 matches',
  },
  {
    title: "2:00PM",
    cardTitle: 'Playing with AI: Applications of Machine Learning in Games',
    cardDetailedText: 'Join the AI & Gaming Industry panel to learn about machine ' +
    'learning advances in academia its relation to the video game industry. Discover how reinforcement learning, ' +
    'large language models, and more are shaping character behavior, game design, and the future of interactive experiences.',
  },
  {
    title: "3:00PM",
    cardTitle: 'Tournament Bracket Round 3',
    // cardDetailedText: 'M12 – M13: 2 matches',
  },
  {
    title: "3:15PM",
    cardTitle: 'Networking',
  },
  {
    title: "4:00PM",
    cardTitle: 'Grand Finals and Closing Ceremony',
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
  }
];


export const ai2speakers = [
  {
    name: "Jingmin Wang",
    role: "RL Researcher @ Data-Driven Decision Making Lab & LEAF Lab",
    profileURL: "",
    profileImage: headshots.jingmin,
  },
  {
    name: "Russell Sng",
    role: "Strategic Growth & Developer Relations @ Artificial Agency",
    profileURL: "",
    profileImage: headshots.russell,
  },
  {
    name: "Ambrose Ling",
    role: "Machine Learning Engineer Intern @ Tenstorrent",
    profileURL: "",
    profileImage: headshots.ambrose,
  },
  {
    name: "Chunlok Lo",
    role: "Software Engineer @ Riot Games",
    profileURL: "",
    profileImage: headshots.chunlok,
  },
];

export const panelSpeakers = [
  {
    name: "Mehdi Saeedi",
    role: "Principal Staff @ AMD",
    profileURL: "",
    profileImage: headshots.mehdi,
  },
  {
    name: "Vitalii Boiko",
    role: "Founder, CEO @ PixelaLabs",
    profileURL: "",
    profileImage: headshots.vitalii,
  },
  {
    name: "Dante Camarena",
    role: "Technical Director @ Ravine Studios",
    profileURL: "",
    profileImage: headshots.dante,
  },
];  

export const ai2Logo = ai2Assets.logo_sketch;
