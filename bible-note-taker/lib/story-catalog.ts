import { normalizeBibleStories, type SafeBibleStory } from "./storytelling-safety";

const BUNDLED_STORIES: unknown[] = [
  {
    id: "the-good-samaritan",
    title: "The Good Samaritan",
    summary: "A story about noticing the neighbor in front of us and choosing mercy over distance.",
    reference: "Luke 10:25–37",
    themes: ["mercy", "neighbor", "compassion"],
    questions: ["Who is near enough for me to love today?", "Where might compassion interrupt my routine?"],
    blocks: ["A traveler was left wounded on the road. Several people saw him, but one person stopped.", "The Samaritan crossed the distance, offered practical care, and made room for a stranger’s recovery.", "Mercy begins when we notice the person in front of us and let love become specific."],
    duration: 8,
  },
  {
    id: "jesus-calms-the-storm",
    title: "Jesus Calms the Storm",
    summary: "A quiet invitation to bring fear into the presence of Jesus and remember who is with us.",
    reference: "Mark 4:35–41",
    themes: ["trust", "peace", "fear"],
    questions: ["What fear needs an honest name today?", "What would trust look like in one small choice?"],
    blocks: ["The disciples entered the boat with Jesus and found themselves surrounded by wind and waves.", "While they panicked, Jesus was present with them. His presence did not make the storm imaginary, but it changed what fear could say.", "Peace can begin with one honest breath and the reminder that we are not facing the waves alone."],
    duration: 7,
  },
  {
    id: "the-lost-sheep",
    title: "The Lost Sheep",
    summary: "A picture of patient pursuit: no one is treated as disposable or too far away to find.",
    reference: "Luke 15:1–7",
    themes: ["belonging", "pursuit", "joy"],
    questions: ["Where do I need to receive care rather than earn it?", "Who could use a reminder that they belong?"],
    blocks: ["The shepherd noticed one sheep was missing and went looking instead of writing it off.", "The search was patient and personal. Finding the lost one became a reason for joy, not a burden to hide.", "Belonging is not a reward for being flawless. It is a gift we can receive and extend."],
    duration: 6,
  },
];

const FALLBACK_STORY: SafeBibleStory = {
  id: "fallback-practice-story",
  title: "Practice reflection (sample)",
  summary: "A local sample reflection is available while the story library recovers.",
  reference: "Sample passage",
  themes: ["pause", "practice"],
  questions: ["What is one honest thing I can bring into prayer today?"],
  blocks: ["This sample story keeps the reflection flow available without replacing or changing your saved journal."],
  durationMinutes: 1,
  hasAudio: false,
  hasVideo: false,
};

const normalizedStories = normalizeBibleStories(BUNDLED_STORIES, 12);
export const bundledBibleStories: SafeBibleStory[] = normalizedStories.length > 0 ? normalizedStories : [FALLBACK_STORY];
