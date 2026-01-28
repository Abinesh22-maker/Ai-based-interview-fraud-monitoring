import { ViolationType } from "./types";

export const MAX_WARNINGS = 3;

export const VIOLATION_MESSAGES: Record<ViolationType, string> = {
  [ViolationType.TAB_SWITCH]: "Candidate switched browser tabs.",
  [ViolationType.WINDOW_BLUR]: "Candidate window lost focus.",
  [ViolationType.FACE_NOT_VISIBLE]: "Candidate face not detected.",
  [ViolationType.GAZE_AVERSION]: "Suspicious gaze pattern detected.",
  [ViolationType.PHONE_DETECTED]: "Prohibited object (Phone) detected.",
  [ViolationType.MULTIPLE_VOICES]: "Multiple voices detected in environment.",
  [ViolationType.BACKGROUND_NOISE]: "High background noise levels.",
};

// Mock transcript for demonstration since we can't record 30 mins of audio in a quick demo
export const DEMO_TRANSCRIPT = `
Interviewer: Tell me about a challenging project you worked on.
Candidate: Well, um, there was this one time at my last job where we had to migrate a legacy database. 
It was, like, really hard because the data was messy. We use Python scripts to clean it. 
Actually, me and my team, we finds a lot of duplicates. 
I think we done a good job eventually, but it took longer than we thought. 
The client were happy though.
`;