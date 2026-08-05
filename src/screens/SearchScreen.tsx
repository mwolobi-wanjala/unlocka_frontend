// screens/SearchScreen.tsx - Global Search
import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { COLORS, FONTS, SPACING, SHADOWS } from '../constants/theme';

interface SearchResult {
  type: 'user' | 'chat' | 'message' | 'video';
  id: string;
  name: string;
  subtitle: string;
  content?: string;
}

interface SearchScreenProps {
  onClose: () => void;
  onNavigate: (screen: string, params?: any) => void;
}

const MOCK_RESULTS: SearchResult[] = [
  { type: 'user', id: '2', name: 'Admin Test', subtitle: '@admin_test' },
  { type: 'user', id: '3', name: 'Jane Doe', subtitle: '@jane_doe' },
  { type: 'chat', id: '1', name: 'Admin Test', subtitle: 'individual chat' },
  { type: 'message', id: 'm1', name: 'Message', subtitle: '2 hours ago', content: 'Hey! Welcome to Un-locka! 👋' },
  { type: 'video', id: 'v1', name: 'My first video! 🎬', subtitle: 'Creator video' },
];

const SearchScreen: React.FC<SearchScreenProps> = ({ onClose, onNavigate }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'Admin Test', 'view once', 'payment'
  ]);

  useEffect(() => {
    if (query.length >= 2) {
      setLoading(true);
      // Simulate search delay
      setTimeout(() => {
        const filtered = MOCK_RESULTS.filter(r =>
          r.name.toLowerCase().includes(query.toLowerCase()) ||
          r.subtitle.toLowerCase().includes(query.toLowerCase())
        );
        setResults(filtered);
        setLoading(false);
      }, 500);
    } else {
      setResults([]);
    }
  }, [query]);

  const handleResultPress = (result: SearchResult) => {
    // Save to recent searches
    if (!recentSearches.includes(query)) {
      setRecentSearches(prev => [query, ...prev.slice(0, 4)]);
    }
    
    switch (result.type) {
      case 'user':
        onNavigate('profile');
        break;
      case 'chat':
        onNavigate('chats');
        break;
      case 'message':
        onNavigate('chats');
        break;
      case 'video':
        onNavigate('creators');
        break;
    }
    onClose();
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'user': return '👤';
      case 'chat': return '💬';
      case 'message': return '💭';
      case 'video': return '🎬';
      default: return '📄';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'user': return '#2196F3';
      case 'chat': return '#4CAF50';
      case 'message': return '#FF9800';
      case 'video': return '#9C27B0';
      default: return '#999';
    }
  };

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchHeader}>
        <TouchableOpacity onPress={onClose}><Text style={styles.backBtn}>←</Text></TouchableOpacity>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            value={query}
            onChangeText={setQuery}
            placeholder="Search chats, contacts, videos..."
            placeholderTextColor="#999"
            autoFocus
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <Text style={styles.clearBtn}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Loading */}
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      )}

      {/* Results */}
      {results.length > 0 ? (
        <FlatList
          data={results}
          keyExtractor={(item, index) => `${item.type}-${item.id}-${index}`}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.resultItem} onPress={() => handleResultPress(item)}>
              <View style={[styles.resultIcon, { backgroundColor: getTypeColor(item.type) + '20' }]}>
                <Text style={styles.resultEmoji}>{getTypeIcon(item.type)}</Text>
              </View>
              <View style={styles.resultInfo}>
                <Text style={styles.resultName}>{item.name}</Text>
                <Text style={styles.resultSubtitle}>{item.subtitle}</Text>
                {item.content && <Text style={styles.resultContent} numberOfLines={1}>{item.content}</Text>}
              </View>
              <View style={[styles.typeBadge, { backgroundColor: getTypeColor(item.type) }]}>
                <Text style={styles.typeText}>{item.type}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      ) : query.length >= 2 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🔍</Text>
          <Text style={styles.emptyText}>No results for "{query}"</Text>
        </View>
      ) : (
        <View style={styles.recentContainer}>
          <Text style={styles.recentTitle}>Recent Searches</Text>
          {recentSearches.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.recentItem}
              onPress={() => setQuery(item)}
            >
              <Text style={styles.recentIcon}>🕐</Text>
              <Text style={styles.recentText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  searchHeader: { flexDirection: 'row', alignItems: 'center', paddingTop: 50, padding: SPACING.md, gap: SPACING.sm },
  backBtn: { fontSize: 22, color: COLORS.primary, fontWeight: 'bold' },
  searchBar: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5F5F5', borderRadius: 12, paddingHorizontal: SPACING.md },
  searchIcon: { fontSize: 16, marginRight: SPACING.sm },
  searchInput: { flex: 1, padding: SPACING.md, fontSize: FONTS.sizes.md },
  clearBtn: { fontSize: 16, color: COLORS.gray, padding: SPACING.xs },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  resultItem: { flexDirection: 'row', alignItems: 'center', padding: SPACING.md, borderBottomWidth: 0.5, borderBottomColor: '#F0F0F0' },
  resultIcon: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: SPACING.md },
  resultEmoji: { fontSize: 20 },
  resultInfo: { flex: 1 },
  resultName: { fontSize: FONTS.sizes.md, fontWeight: '600', color: COLORS.dark },
  resultSubtitle: { fontSize: FONTS.sizes.xs, color: COLORS.gray },
  resultContent: { fontSize: FONTS.sizes.xs, color: COLORS.gray, marginTop: 2, fontStyle: 'italic' },
  typeBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  typeText: { color: '#FFF', fontSize: 9, fontWeight: 'bold', textTransform: 'uppercase' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyIcon: { fontSize: 60, marginBottom: SPACING.md },
  emptyText: { color: COLORS.gray },
  recentContainer: { padding: SPACING.lg },
  recentTitle: { fontSize: FONTS.sizes.sm, fontWeight: '600', color: COLORS.gray, marginBottom: SPACING.md },
  recentItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: SPACING.sm },
  recentIcon: { fontSize: 16, marginRight: SPACING.sm },
  recentText: { fontSize: FONTS.sizes.sm, color: COLORS.dark },
});

export default SearchScreen;
