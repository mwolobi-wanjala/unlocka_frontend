// services/chat/exportService.ts - Export chats
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as Print from 'expo-print';
import { ChatMessage, ChatConversation } from '../../types/chat';

interface ExportOptions {
  format: 'txt' | 'pdf' | 'json';
  includeMedia: boolean;
  dateRange?: { start: Date; end: Date };
}

/**
 * Export chat to file
 */
export const exportChat = async (
  chat: ChatConversation,
  messages: ChatMessage[],
  options: ExportOptions
): Promise<string> => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `chat_${chat.name}_${timestamp}.${options.format}`;
  const filePath = `${FileSystem.documentDirectory}${filename}`;
  
  let content = '';
  
  switch (options.format) {
    case 'txt':
      content = formatAsText(chat, messages);
      break;
    case 'json':
      content = JSON.stringify({ chat, messages }, null, 2);
      break;
    case 'pdf':
      const html = formatAsHTML(chat, messages);
      const { uri } = await Print.printToFileAsync({ html });
      await FileSystem.moveAsync({ from: uri, to: filePath });
      return filePath;
  }
  
  await FileSystem.writeAsStringAsync(filePath, content);
  return filePath;
};

/**
 * Format as text
 */
const formatAsText = (chat: ChatConversation, messages: ChatMessage[]): string => {
  let text = `Chat: ${chat.name}\n`;
  text += `Exported: ${new Date().toLocaleString()}\n`;
  text += `${'='.repeat(50)}\n\n`;
  
  messages.forEach(msg => {
    const time = new Date(msg.timestamp).toLocaleString();
    text += `[${time}] ${msg.senderName}:\n`;
    
    if (msg.type === 'text') {
      text += `${msg.content}\n`;
    } else if (msg.type === 'image') {
      text += `[📷 Image]${msg.content ? ' - ' + msg.content : ''}\n`;
    } else if (msg.type === 'video') {
      text += `[🎥 Video]${msg.content ? ' - ' + msg.content : ''}\n`;
    } else if (msg.type === 'audio') {
      text += `[🎵 Audio - ${msg.duration}s]\n`;
    } else {
      text += `[${msg.type}] ${msg.content}\n`;
    }
    
    if (msg.editedAt) text += `  (edited)\n`;
    text += '\n';
  });
  
  return text;
};

/**
 * Format as HTML for PDF
 */
const formatAsHTML = (chat: ChatConversation, messages: ChatMessage[]): string => {
  let html = `
    <html>
    <head>
      <style>
        body { font-family: Arial; padding: 20px; }
        .header { border-bottom: 2px solid #6C63FF; padding-bottom: 10px; margin-bottom: 20px; }
        .message { margin-bottom: 15px; padding: 10px; border-radius: 8px; }
        .sent { background: #DCF8C6; margin-left: 40px; }
        .received { background: #F0F0F0; margin-right: 40px; }
        .time { font-size: 11px; color: #999; }
        .sender { font-weight: bold; color: #6C63FF; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${chat.name}</h1>
        <p>Exported: ${new Date().toLocaleString()}</p>
      </div>
  `;
  
  messages.forEach(msg => {
    const time = new Date(msg.timestamp).toLocaleString();
    html += `
      <div class="message ${msg.senderId === 1 ? 'sent' : 'received'}">
        <div class="sender">${msg.senderName}</div>
        <div>${msg.type === 'text' ? msg.content : `[${msg.type}]`}</div>
        <div class="time">${time}${msg.editedAt ? ' (edited)' : ''}</div>
      </div>
    `;
  });
  
  html += '</body></html>';
  return html;
};

/**
 * Share exported file
 */
export const shareExportedChat = async (filePath: string): Promise<void> => {
  await Sharing.shareAsync(filePath, {
    mimeType: filePath.endsWith('.pdf') ? 'application/pdf' : 'text/plain',
  });
};
