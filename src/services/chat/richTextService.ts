// services/chat/richTextService.ts - Message formatting
import AsyncStorage from '@react-native-async-storage/async-storage';

interface FormattingPreset {
  id: string;
  name: string;
  preview: string;
  format: string;
}

const PRESETS_KEY = '@formatting_presets';

const DEFAULT_PRESETS: FormattingPreset[] = [
  { id: 'bold', name: 'Bold', preview: '**Bold text**', format: '**{text}**' },
  { id: 'italic', name: 'Italic', preview: '*Italic text*', format: '*{text}*' },
  { id: 'strikethrough', name: 'Strikethrough', preview: '~~Strikethrough~~', format: '~~{text}~~' },
  { id: 'monospace', name: 'Monospace', preview: '`code`', format: '`{text}`' },
  { id: 'quote', name: 'Quote', preview: '> Quoted text', format: '> {text}' },
  { id: 'heading', name: 'Heading', preview: '# Heading', format: '# {text}' },
];

/**
 * Apply formatting to text
 */
export const applyFormatting = (
  text: string,
  formatType: string
): string => {
  const preset = DEFAULT_PRESETS.find(p => p.id === formatType);
  if (!preset) return text;
  
  return preset.format.replace('{text}', text);
};

/**
 * Remove formatting from text
 */
export const removeFormatting = (text: string): string => {
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/~~(.*?)~~/g, '$1')
    .replace(/`(.*?)`/g, '$1')
    .replace(/^> /gm, '')
    .replace(/^# /gm, '');
};

/**
 * Get available formatting presets
 */
export const getFormattingPresets = (): FormattingPreset[] => {
  return DEFAULT_PRESETS;
};

/**
 * Parse markdown-like formatting to display
 */
export const parseFormattedText = (text: string): Array<{
  text: string;
  bold?: boolean;
  italic?: boolean;
  strikethrough?: boolean;
  monospace?: boolean;
  quote?: boolean;
  heading?: boolean;
}> => {
  const parts: any[] = [];
  let remaining = text;
  
  // Bold
  const boldRegex = /\*\*(.*?)\*\*/g;
  // Italic
  const italicRegex = /\*(.*?)\*/g;
  // Strikethrough
  const strikeRegex = /~~(.*?)~~/g;
  // Monospace
  const monoRegex = /`(.*?)`/g;
  
  // Simple parsing
  if (boldRegex.test(text)) {
    parts.push({ text: text.replace(/\*\*/g, ''), bold: true });
  } else if (italicRegex.test(text)) {
    parts.push({ text: text.replace(/\*/g, ''), italic: true });
  } else {
    parts.push({ text });
  }
  
  return parts;
};

/**
 * Get character count
 */
export const getCharacterCount = (text: string): number => {
  return text.length;
};

/**
 * Get word count
 */
export const getWordCount = (text: string): number => {
  return text.trim().split(/\s+/).filter(w => w.length > 0).length;
};
