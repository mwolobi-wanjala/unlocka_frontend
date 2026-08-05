// screens/DocumentEditorScreen.tsx - Document Collaboration
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  ScrollView, Alert, FlatList, Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS, SPACING, SHADOWS } from '../constants/theme';
import Button from '../components/Button';
import { useToast } from '../../App';

interface Comment {
  id: number;
  userId: number;
  userName: string;
  comment: string;
  resolved: boolean;
}

interface DocumentEditorScreenProps {
  onClose: () => void;
  userId: number;
  userName: string;
}

const DocumentEditorScreen: React.FC<DocumentEditorScreenProps> = ({ onClose, userId, userName }) => {
  const { showToast } = useToast();
  const [documents, setDocuments] = useState([
    { id: '1', title: 'Project Plan', content: '# Project Plan\n\n## Objectives\n- Launch app\n- Get users\n- Scale', version: 3, updatedAt: new Date().toISOString() },
    { id: '2', title: 'Meeting Notes', content: '# Meeting Notes\n\nDate: Today\nAttendees: Team', version: 1, updatedAt: new Date().toISOString() },
  ]);
  const [activeDoc, setActiveDoc] = useState<any>(null);
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [showNewDoc, setShowNewDoc] = useState(false);

  const handleNewDocument = () => {
    if (!title.trim()) { showToast('Enter a title'); return; }
    const newDoc = {
      id: `doc_${Date.now()}`,
      title: title.trim(),
      content: '',
      version: 1,
      updatedAt: new Date().toISOString(),
    };
    setDocuments(prev => [newDoc, ...prev]);
    setActiveDoc(newDoc);
    setContent('');
    setTitle('');
    setShowNewDoc(false);
    showToast('✅ Document created!');
  };

  const handleOpenDocument = (doc: any) => {
    setActiveDoc(doc);
    setContent(doc.content);
    setComments([
      { id: 1, userId: 2, userName: 'Admin Test', comment: 'Great start! Need more details.', resolved: false },
      { id: 2, userId: 3, userName: 'Jane Doe', comment: 'I can help with section 2.', resolved: false },
    ]);
  };

  const handleSave = () => {
    if (activeDoc) {
      const updated = documents.map(d => 
        d.id === activeDoc.id ? { ...d, content, version: d.version + 1, updatedAt: new Date().toISOString() } : d
      );
      setDocuments(updated);
      showToast('✅ Document saved!');
    }
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    setComments(prev => [...prev, {
      id: Date.now(), userId, userName,
      comment: newComment.trim(), resolved: false,
    }]);
    setNewComment('');
    showToast('💬 Comment added');
  };

  const handleResolveComment = (commentId: number) => {
    setComments(prev => prev.map(c => c.id === commentId ? { ...c, resolved: true } : c));
    showToast('✅ Comment resolved');
  };

  const handleExport = () => {
    Alert.alert('Export Document', 'Choose format:', [
      { text: '📄 PDF', onPress: () => showToast('Exporting as PDF...') },
      { text: '📝 TXT', onPress: () => showToast('Exporting as TXT...') },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  // Document list view
  if (!activeDoc) {
    return (
      <View style={styles.container}>
        <LinearGradient colors={[COLORS.primary, COLORS.primaryDark]} style={styles.header}>
          <TouchableOpacity onPress={onClose}><Text style={styles.backBtn}>←</Text></TouchableOpacity>
          <Text style={styles.headerTitle}>Documents</Text>
          <TouchableOpacity onPress={() => setShowNewDoc(true)}>
            <Text style={styles.addBtn}>+ New</Text>
          </TouchableOpacity>
        </LinearGradient>

        <FlatList
          data={documents}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.docItem} onPress={() => handleOpenDocument(item)}>
              <View style={styles.docIcon}>
                <Text style={styles.docEmoji}>📄</Text>
              </View>
              <View style={styles.docInfo}>
                <Text style={styles.docTitle}>{item.title}</Text>
                <Text style={styles.docMeta}>v{item.version} • {new Date(item.updatedAt).toLocaleDateString()}</Text>
              </View>
              <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>📄</Text>
              <Text style={styles.emptyText}>No documents yet</Text>
              <Button title="Create Document" onPress={() => setShowNewDoc(true)} variant="primary" />
            </View>
          }
        />

        {/* New Document Modal */}
        <Modal visible={showNewDoc} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>📄 New Document</Text>
              <TextInput style={styles.modalInput} value={title} onChangeText={setTitle} placeholder="Document title..." placeholderTextColor="#999" />
              <Button title="Create" onPress={handleNewDocument} variant="primary" />
              <Button title="Cancel" onPress={() => setShowNewDoc(false)} variant="outline" />
            </View>
          </View>
        </Modal>
      </View>
    );
  }

  // Document editor view
  return (
    <View style={styles.container}>
      <LinearGradient colors={[COLORS.primary, COLORS.primaryDark]} style={styles.header}>
        <TouchableOpacity onPress={() => setActiveDoc(null)}><Text style={styles.backBtn}>←</Text></TouchableOpacity>
        <Text style={styles.headerTitle}>{activeDoc.title}</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={() => setShowComments(!showComments)}>
            <Text style={styles.headerActionBtn}>💬 {comments.filter(c => !c.resolved).length}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSave}>
            <Text style={styles.headerActionBtn}>💾</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleExport}>
            <Text style={styles.headerActionBtn}>📤</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <View style={styles.editorContainer}>
        {/* Editor */}
        <ScrollView style={styles.editor}>
          <TextInput
            style={styles.editorInput}
            value={content}
            onChangeText={setContent}
            placeholder="Start typing..."
            placeholderTextColor="#999"
            multiline
            textAlignVertical="top"
          />
        </ScrollView>

        {/* Comments Panel */}
        {showComments && (
          <View style={styles.commentsPanel}>
            <Text style={styles.commentsTitle}>Comments ({comments.filter(c => !c.resolved).length})</Text>
            
            <FlatList
              data={comments}
              keyExtractor={item => item.id.toString()}
              renderItem={({ item }) => (
                <View style={[styles.commentItem, item.resolved && styles.commentResolved]}>
                  <Text style={styles.commentUser}>{item.userName}</Text>
                  <Text style={styles.commentText}>{item.comment}</Text>
                  {!item.resolved && (
                    <TouchableOpacity onPress={() => handleResolveComment(item.id)}>
                      <Text style={styles.resolveBtn}>✓ Resolve</Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            />

            <View style={styles.commentInputRow}>
              <TextInput
                style={styles.commentInput}
                value={newComment}
                onChangeText={setNewComment}
                placeholder="Add a comment..."
                placeholderTextColor="#999"
              />
              <TouchableOpacity onPress={handleAddComment}>
                <Text style={styles.sendComment}>📤</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <Text style={styles.bottomText}>v{activeDoc.version} • Auto-save enabled</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 50, padding: SPACING.md },
  backBtn: { color: '#FFF', fontSize: 22 }, headerTitle: { color: '#FFF', fontSize: FONTS.sizes.md, fontWeight: 'bold', flex: 1, textAlign: 'center' },
  addBtn: { color: '#FFD700', fontWeight: 'bold' },
  headerActions: { flexDirection: 'row', gap: SPACING.md },
  headerActionBtn: { color: '#FFF', fontSize: 16 },
  
  docItem: { flexDirection: 'row', alignItems: 'center', padding: SPACING.md, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  docIcon: { width: 44, height: 44, borderRadius: 10, backgroundColor: '#E3F2FD', justifyContent: 'center', alignItems: 'center', marginRight: SPACING.md },
  docEmoji: { fontSize: 20 },
  docInfo: { flex: 1 },
  docTitle: { fontSize: FONTS.sizes.md, fontWeight: '600' },
  docMeta: { fontSize: FONTS.sizes.xs, color: COLORS.gray },
  arrow: { fontSize: 20, color: COLORS.gray },
  
  editorContainer: { flex: 1, flexDirection: 'row' },
  editor: { flex: 1, padding: SPACING.md },
  editorInput: { fontSize: FONTS.sizes.md, lineHeight: 24, minHeight: 200, textAlignVertical: 'top' },
  
  commentsPanel: { width: '40%', backgroundColor: '#F8F9FA', borderLeftWidth: 1, borderLeftColor: '#E0E0E0', padding: SPACING.sm },
  commentsTitle: { fontSize: FONTS.sizes.sm, fontWeight: 'bold', marginBottom: SPACING.sm },
  commentItem: { backgroundColor: '#FFF', padding: SPACING.sm, borderRadius: 8, marginBottom: SPACING.xs },
  commentResolved: { opacity: 0.5 },
  commentUser: { fontSize: 11, fontWeight: 'bold' },
  commentText: { fontSize: 11, color: COLORS.dark, marginTop: 2 },
  resolveBtn: { color: '#4CAF50', fontSize: 10, fontWeight: 'bold', marginTop: 4 },
  commentInputRow: { flexDirection: 'row', alignItems: 'center', marginTop: SPACING.sm, gap: SPACING.xs },
  commentInput: { flex: 1, backgroundColor: '#FFF', borderRadius: 8, padding: SPACING.sm, fontSize: 11 },
  sendComment: { fontSize: 18 },
  
  bottomBar: { padding: SPACING.sm, backgroundColor: '#F5F5F5', borderTopWidth: 1, borderTopColor: '#E0E0E0', alignItems: 'center' },
  bottomText: { fontSize: 10, color: COLORS.gray },
  
  emptyContainer: { alignItems: 'center', padding: SPACING.xxl },
  emptyIcon: { fontSize: 60, marginBottom: SPACING.md },
  emptyText: { color: COLORS.gray, marginBottom: SPACING.md },
  
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFF', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: SPACING.lg },
  modalTitle: { fontSize: FONTS.sizes.lg, fontWeight: 'bold', textAlign: 'center', marginBottom: SPACING.lg },
  modalInput: { borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 10, padding: SPACING.md, marginBottom: SPACING.sm },
});

export default DocumentEditorScreen;
