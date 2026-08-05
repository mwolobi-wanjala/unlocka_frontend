// components/InputField.tsx - Keyboard-Friendly Input (No Re-renders)
import React, { useState, useRef, useCallback, memo } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, FONTS, SPACING } from '../constants/theme';

interface InputFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  onToggleSecure?: () => void;
  showSecureToggle?: boolean;
  keyboardType?: 'default' | 'email-address' | 'phone-pad' | 'number-pad';
  maxLength?: number;
  error?: string;
  hint?: string;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  icon?: string;
  editable?: boolean;
}

// Use React.memo to prevent unnecessary re-renders
const InputField: React.FC<InputFieldProps> = memo(({
  label, value, onChangeText, placeholder, secureTextEntry,
  onToggleSecure, showSecureToggle, keyboardType = 'default',
  maxLength, error, hint, autoCapitalize = 'none', icon, editable = true,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);

  // Memoize change handler to prevent re-renders
  const handleChange = useCallback((text: string) => {
    onChangeText(text);
  }, [onChangeText]);

  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>
        {icon && <Text>{icon} </Text>}{label}
      </Text>
      
      <TouchableOpacity 
        style={[styles.box, isFocused && styles.focused, error ? styles.errorBox : null, !editable && styles.disabledBox]}
        activeOpacity={1}
        onPress={() => inputRef.current?.focus()}
      >
        <TextInput
          ref={inputRef}
          style={[styles.input, showSecureToggle && styles.inputToggle, !editable && styles.inputDisabled]}
          value={value}
          onChangeText={handleChange}
          placeholder={placeholder}
          placeholderTextColor="#999"
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          maxLength={maxLength}
          autoCapitalize={autoCapitalize}
          autoCorrect={false}
          editable={editable}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          // KEYBOARD PERSISTENCE SETTINGS
          blurOnSubmit={false}
          keyboardAppearance="light"
          returnKeyType="next"
          enablesReturnKeyAutomatically={false}
        />
        {showSecureToggle && (
          <TouchableOpacity style={styles.eye} onPress={onToggleSecure} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Text style={styles.eyeIcon}>{secureTextEntry ? '👁️‍🗨️' : '👁️'}</Text>
          </TouchableOpacity>
        )}
      </TouchableOpacity>
      
      {error ? <Text style={styles.err}>⚠️ {error}</Text> : hint ? <Text style={styles.hint}>💡 {hint}</Text> : null}
    </View>
  );
});

const styles = StyleSheet.create({
  wrap: { marginBottom: SPACING.sm },
  label: { fontSize: FONTS.sizes.sm, fontWeight: '600', color: '#555', marginBottom: 4 },
  box: { backgroundColor: '#FFF', borderWidth: 1.5, borderColor: '#E0E0E0', borderRadius: 10, flexDirection: 'row', alignItems: 'center' },
  focused: { borderColor: '#6C63FF', backgroundColor: '#FAFAFF' },
  errorBox: { borderColor: '#F44336', backgroundColor: '#FFF5F5' },
  disabledBox: { backgroundColor: '#F5F5F5' },
  input: { flex: 1, padding: 12, fontSize: FONTS.sizes.md, color: '#333' },
  inputToggle: { paddingRight: 50 },
  inputDisabled: { color: '#999' },
  eye: { position: 'absolute', right: 0, width: 50, alignItems: 'center', justifyContent: 'center', height: '100%' },
  eyeIcon: { fontSize: 18 },
  hint: { fontSize: FONTS.sizes.xs, color: '#999', marginTop: 2, marginLeft: 4 },
  err: { fontSize: FONTS.sizes.xs, color: '#F44336', marginTop: 2, marginLeft: 4 },
});

export default InputField;
