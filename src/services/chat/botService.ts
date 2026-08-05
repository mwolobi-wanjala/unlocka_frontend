// services/chat/botService.ts - Auto-reply bots
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AutoReplyRule {
  id: string;
  chatId?: string; // undefined = global
  trigger: string; // keyword or phrase
  response: string;
  matchType: 'exact' | 'contains' | 'startsWith';
  isActive: boolean;
  createdAt: string;
}

interface ChatBot {
  id: string;
  name: string;
  avatar: string;
  description: string;
  commands: { trigger: string; response: string }[];
  isActive: boolean;
}

const AUTO_REPLIES_KEY = '@auto_replies';
const CHAT_BOTS_KEY = '@chat_bots';

// Default bots
const DEFAULT_BOTS: ChatBot[] = [
  {
    id: 'assistant',
    name: 'Un-locka Assistant',
    avatar: '🤖',
    description: 'Your helpful chat assistant',
    isActive: true,
    commands: [
      { trigger: '/help', response: 'Here are available commands:\n/help - Show help\n/info - Account info\n/balance - Check balance\n/referral - Get referral code\n/time - Current time' },
      { trigger: '/info', response: 'This is Un-locka chat! You can send messages, media, documents, and more.' },
      { trigger: '/time', response: () => new Date().toLocaleString() },
      { trigger: '/hello', response: 'Hello! 👋 How can I help you today?' },
      { trigger: '/bye', response: 'Goodbye! 👋 Have a great day!' },
    ],
  },
  {
    id: 'translator',
    name: 'Translator Bot',
    avatar: '🌐',
    description: 'Translate messages instantly',
    isActive: false,
    commands: [
      { trigger: '/translate', response: 'Translation feature: Reply to a message with /translate to translate it' },
    ],
  },
];

/**
 * Get all auto-reply rules
 */
export const getAutoReplies = async (): Promise<AutoReplyRule[]> => {
  const data = await AsyncStorage.getItem(AUTO_REPLIES_KEY);
  return data ? JSON.parse(data) : [];
};

/**
 * Add auto-reply rule
 */
export const addAutoReply = async (rule: Omit<AutoReplyRule, 'id' | 'createdAt'>): Promise<AutoReplyRule> => {
  const rules = await getAutoReplies();
  const newRule: AutoReplyRule = {
    ...rule,
    id: `rule_${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  rules.push(newRule);
  await AsyncStorage.setItem(AUTO_REPLIES_KEY, JSON.stringify(rules));
  return newRule;
};

/**
 * Check if message matches any auto-reply rule
 */
export const checkAutoReplies = async (
  message: string,
  chatId: string
): Promise<string | null> => {
  const rules = await getAutoReplies();
  const activeRules = rules.filter(r => 
    r.isActive && (!r.chatId || r.chatId === chatId)
  );
  
  for (const rule of activeRules) {
    const match = checkMatch(message, rule.trigger, rule.matchType);
    if (match) return rule.response;
  }
  
  return null;
};

/**
 * Check if text matches trigger
 */
const checkMatch = (text: string, trigger: string, type: string): boolean => {
  const lower = text.toLowerCase();
  const triggerLower = trigger.toLowerCase();
  
  switch (type) {
    case 'exact': return lower === triggerLower;
    case 'contains': return lower.includes(triggerLower);
    case 'startsWith': return lower.startsWith(triggerLower);
    default: return false;
  }
};

/**
 * Get all chat bots
 */
export const getChatBots = async (): Promise<ChatBot[]> => {
  const data = await AsyncStorage.getItem(CHAT_BOTS_KEY);
  return data ? JSON.parse(data) : DEFAULT_BOTS;
};

/**
 * Process bot command
 */
export const processBotCommand = async (
  command: string,
  botId: string
): Promise<string | null> => {
  const bots = await getChatBots();
  const bot = bots.find(b => b.id === botId && b.isActive);
  
  if (!bot) return null;
  
  const cmd = bot.commands.find(c => 
    command.toLowerCase().startsWith(c.trigger.toLowerCase())
  );
  
  if (!cmd) return null;
  
  if (typeof cmd.response === 'function') {
    return cmd.response();
  }
  
  return cmd.response;
};

/**
 * Toggle bot active status
 */
export const toggleBot = async (botId: string): Promise<boolean> => {
  const bots = await getChatBots();
  const bot = bots.find(b => b.id === botId);
  if (bot) {
    bot.isActive = !bot.isActive;
    await AsyncStorage.setItem(CHAT_BOTS_KEY, JSON.stringify(bots));
    return bot.isActive;
  }
  return false;
};
