// services/highlightsService.ts - Status Highlights (Permanent Stories)
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Highlight {
  id: string;
  title: string;
  coverImage: string;
  statusIds: string[];
  viewCount: number;
  createdAt: string;
}

const HIGHLIGHTS_KEY = '@status_highlights';

/**
 * Create highlight from status
 */
export const createHighlight = async (
  title: string,
  coverImage: string,
  statusIds: string[]
): Promise<Highlight> => {
  const highlight: Highlight = {
    id: `hl_${Date.now()}`,
    title,
    coverImage,
    statusIds,
    viewCount: 0,
    createdAt: new Date().toISOString(),
  };
  
  const highlights = await getHighlights();
  highlights.push(highlight);
  await AsyncStorage.setItem(HIGHLIGHTS_KEY, JSON.stringify(highlights));
  
  return highlight;
};

/**
 * Get all highlights
 */
export const getHighlights = async (): Promise<Highlight[]> => {
  const data = await AsyncStorage.getItem(HIGHLIGHTS_KEY);
  return data ? JSON.parse(data) : [];
};

/**
 * Add status to highlight
 */
export const addToHighlight = async (highlightId: string, statusId: string): Promise<void> => {
  const highlights = await getHighlights();
  const updated = highlights.map(h => 
    h.id === highlightId ? { ...h, statusIds: [...h.statusIds, statusId] } : h
  );
  await AsyncStorage.setItem(HIGHLIGHTS_KEY, JSON.stringify(updated));
};

/**
 * Delete highlight
 */
export const deleteHighlight = async (highlightId: string): Promise<void> => {
  const highlights = await getHighlights();
  const filtered = highlights.filter(h => h.id !== highlightId);
  await AsyncStorage.setItem(HIGHLIGHTS_KEY, JSON.stringify(filtered));
};
