import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import api from '../../api/client';
import { colors } from '../../constants/colors';

const TYPES = ['Note', 'Link', 'Code'];

export default function AddKnowledgeScreen() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState('Note');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!title || !content) {
      Alert.alert('Missing Info', 'Please add a title and some content.');
      return;
    }

    setLoading(true);
    try {
      await api.post('/knowledge', {
        title,
        content,
        type: type.toLowerCase(),
      });
      router.back();
    } catch (error) {
      Alert.alert('Error', 'Could not save knowledge.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Knowledge</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.form}>
        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.input}
          placeholder="What is this about?"
          value={title}
          onChangeText={setTitle}
        />

        <Text style={styles.label}>Type</Text>
        <View style={styles.typeContainer}>
          {TYPES.map((t) => (
            <TouchableOpacity
              key={t}
              style={[styles.typeButton, type === t && styles.typeButtonActive]}
              onPress={() => setType(t)}
            >
              <Text style={[styles.typeText, type === t && styles.typeTextActive]}>{t}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Content</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Write your thoughts, paste a link, or snippet..."
          value={content}
          onChangeText={setContent}
          multiline
          textAlignVertical="top"
        />

        <TouchableOpacity 
          style={[styles.submitButton, loading && styles.disabled]} 
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
             <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                 <ActivityIndicator color="#fff" style={{ marginRight: 8 }} />
                 <Text style={styles.submitText}>Organizing...</Text>
             </View>
          ) : (
            <Text style={styles.submitText}>Save to Vault</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 20, // Modal presentation usually has less top padding or handles it
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  form: {
    padding: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: colors.text,
  },
  textArea: {
    height: 200,
  },
  typeContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  typeButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  typeButtonActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  typeText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  typeTextActive: {
    color: '#fff',
  },
  submitButton: {
    backgroundColor: colors.accent,
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 32,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  disabled: {
    opacity: 0.7,
  },
  submitText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
