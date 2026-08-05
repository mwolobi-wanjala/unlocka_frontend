import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Modal } from 'react-native';
import { COLORS, FONTS, SPACING } from '../../constants/theme';

const QUICK_QUESTIONS = ['What features?', 'How to earn?', 'Payment methods?', 'Is it secure?', 'How to refer?'];

const AIChatbot = ({ visible, onClose }) => {
  const [messages, setMessages] = useState([{ type: 'bot', text: 'Hello! 👋 I\'m Un-locka AI. Ask me anything!' }]);
  const [input, setInput] = useState('');

  const handleSend = async () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { type: 'user', text: input }]);
    
    // Mock AI response
    setTimeout(() => {
      const responses = {
        'features': 'Un-locka has: Chat, View Once, Status, Creators, Wallet, Referrals, and more!',
        'earn': 'You can earn via: View Once (90%), Paid Media (85%), Referrals (KSH 20 each)',
        'payment': 'We use M-Pesa STK Push. You\'ll receive a popup on your phone to enter PIN.',
        'secure': 'Yes! End-to-end encryption with AES-256 + RSA. Bank-level security.',
        'refer': 'Share your referral code from Wallet → Referral. Earn KSH 20 per signup!',
      };
      
      let response = 'I can help with features, earnings, payments, security, and referrals!';
      for (const [key, value] of Object.entries(responses)) {
        if (input.toLowerCase().includes(key)) { response = value; break; }
      }
      
      setMessages(prev => [...prev, { type: 'bot', text: response }]);
    }, 800);
    
    setInput('');
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>🤖 Un-locka AI</Text>
            <TouchableOpacity onPress={onClose}><Text style={styles.closeBtn}>✕</Text></TouchableOpacity>
          </View>
          
          <FlatList
            data={messages}
            keyExtractor={(_, i) => i.toString()}
            renderItem={({ item }) => (
              <View style={[styles.msg, item.type === 'user' ? styles.userMsg : styles.botMsg]}>
                <Text style={styles.msgText}>{item.text}</Text>
              </View>
            )}
            style={styles.chatList}
          />
          
          <View style={styles.quickQuestions}>
            {QUICK_QUESTIONS.map((q, i) => (
              <TouchableOpacity key={i} style={styles.quickBtn} onPress={() => { setInput(q); handleSend(); }}>
                <Text style={styles.quickText}>{q}</Text>
              </TouchableOpacity>
            ))}
          </View>
          
          <View style={styles.inputRow}>
            <TextInput style={styles.input} value={input} onChangeText={setInput} placeholder="Ask me anything..." placeholderTextColor="#999" onSubmitEditing={handleSend} />
            <TouchableOpacity style={styles.sendBtn} onPress={handleSend}><Text>📤</Text></TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  container: { backgroundColor: '#FFF', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: SPACING.lg, height: '70%' },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING.md },
  title: { fontSize: FONTS.sizes.lg, fontWeight: 'bold' }, closeBtn: { fontSize: 22 },
  chatList: { flex: 1, marginBottom: SPACING.sm },
  msg: { padding: SPACING.sm, borderRadius: 12, marginBottom: SPACING.sm, maxWidth: '80%' },
  userMsg: { backgroundColor: '#DCF8C6', alignSelf: 'flex-end' },
  botMsg: { backgroundColor: '#F0F0F0', alignSelf: 'flex-start' },
  msgText: { fontSize: FONTS.sizes.sm },
  quickQuestions: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.xs, marginBottom: SPACING.sm },
  quickBtn: { backgroundColor: '#E3F2FD', paddingHorizontal: SPACING.sm, paddingVertical: SPACING.xs, borderRadius: 15 },
  quickText: { fontSize: 11, color: '#1565C0' },
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  input: { flex: 1, backgroundColor: '#F5F5F5', borderRadius: 20, paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm },
  sendBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center' },
});

export default AIChatbot;
