// Centralized HealthMate Companion Quotes & Helper
// Keeps messages short (3-8 words), friendly, simple, and positive.

export type CompanionMood = 'happy' | 'thoughtful' | 'active' | 'calm' | 'excited' | 'speaking' | 'walking';

export function triggerCompanion(text: string, mood: CompanionMood = 'happy', tab?: string) {
  // Respect the mascot custom name from localStorage
  const currentMascotName = localStorage.getItem('healthmate_mascot_name') || 'HealthMate';
  const cleanText = text
    .replace(/Aura/g, currentMascotName)
    .replace(/Buddy/g, currentMascotName)
    .replace(/HealthMate/g, currentMascotName);

  window.dispatchEvent(new CustomEvent('aura-buddy', {
    detail: {
      text: cleanText,
      mood,
      tab
    }
  }));
}

export const CompanionQuotes = {
  home: [
    "Let's see how today is going.",
    "Small steps still count.",
    "You are doing better than yesterday."
  ],
  water: [
    "Your body is waiting for water.",
    "One glass can change today.",
    "Almost there. Keep going.",
    "One more glass and you're closer.",
    "Good choice.",
    "Your body will thank you.",
    "That was worth logging."
  ],
  goals: [
    "Progress matters more than perfection.",
    "One task at a time.",
    "Future you will notice this effort.",
    "That's a good target.",
    "Small goals become big results.",
    "Future You likes this one."
  ],
  tracker: [
    "We're building something exciting here.",
    "The future tracker is getting smarter.",
    "Soon you'll see much more than steps.",
    "We're still building this.",
    "I think you'll like what's coming.",
    "Walking is about more than steps."
  ],
  trackerPreview: [
    "This is what we're working on.",
    "Walking is about more than numbers.",
    "I think you'll love this.",
    "This feature is getting exciting.",
    "I'm working on this one.",
    "Imagine seeing your movement this way."
  ],
  meetFutureYou: [
    "I found something for you.",
    "A message is waiting.",
    "Future You left a note.",
    "A message from your future self is waiting.",
    "There's something waiting for you.",
    "I found a note.",
    "Take a look."
  ],
  questionSetup: [
    "Nice choice.",
    "That helps Future You know you better.",
    "I think this one will matter later.",
    "Future You will remember this.",
    "Interesting answer.",
    "Tell me a little more."
  ],
  messageRevealBefore: [
    "I wonder what Future You wrote."
  ],
  messageRevealAfter: [
    "That one was interesting.",
    "I liked that message.",
    "Let's save it."
  ],
  archive: [
    "Every message tells part of your story.",
    "You've come further than you think.",
    "These memories belong to you.",
    "You've collected quite a story.",
    "These messages are becoming a timeline.",
    "Every message matters."
  ],
  aiChat: [
    "What would you like to talk about?",
    "I'm listening.",
    "Let's figure it out together.",
    "What would you like help with?",
    "Let's think about it."
  ],
  emptyStates: [
    "No messages yet. Your future self is preparing something.",
    "No activity today. Let's create a healthier tomorrow.",
    "No activity yet.",
    "Let's create today's story.",
    "Today is still waiting."
  ],
  success: [
    "Nice work.",
    "That was a good step.",
    "You're moving forward.",
    "Nice.",
    "Good work.",
    "Keep going.",
    "That helped."
  ],
  waitingList: [
    "You're officially on the list.",
    "I'll let you know when it's ready.",
    "Good things take time.",
    "Awesome. I'll let you know when it's ready."
  ],
  error: [
    "Something went wrong.",
    "Let's try that again.",
    "We'll get it working.",
    "I'll help."
  ]
};

// Helper to trigger random item from a quote collection
export function triggerCompanionQuote(category: keyof typeof CompanionQuotes, mood: CompanionMood = 'happy', tab?: string) {
  const list = CompanionQuotes[category];
  const item = list[Math.floor(Math.random() * list.length)];
  triggerCompanion(item, mood, tab);
}
