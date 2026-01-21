import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { ArrowLeft, Calendar, Trash2, Edit2 } from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { colors } from '../../constants/colors';
import { Tag } from '../../components/Tag';
import api from '../../api/client';

export default function KnowledgeDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { id, title, content, type, created_at } = params;
  const [deleting, setDeleting] = useState(false);

  const handleDelete = () => {
    Alert.alert(
      'Delete Knowledge',
      'Are you sure you want to delete this item? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setDeleting(true);
            try {
              await api.delete(`/knowledge/${id}`);
              router.back();
            } catch (error) {
              console.error('Failed to delete knowledge:', error);
              Alert.alert('Error', 'Failed to delete the item. Please try again.');
              setDeleting(false);
            }
          },
        },
      ]
    );
  };

  if (!title) {
      return (
          <View style={styles.center}>
              <Text>Item not found or loading...</Text>
          </View>
      );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>Details</Text>
        <View style={styles.headerActions}>
            <TouchableOpacity 
            onPress={() => router.push({
                pathname: `/knowledge/edit/${id}`,
                params: { id, title, content, type, created_at }
            })}
            style={styles.actionButton}
            >
            <Edit2 size={22} color={colors.accent} />
            </TouchableOpacity>
            <TouchableOpacity 
            onPress={handleDelete} 
            style={styles.actionButton}
            disabled={deleting}
            >
            {deleting ? (
                <ActivityIndicator size="small" color={colors.error} />
            ) : (
                <Trash2 size={22} color={colors.error} />
            )}
            </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.metaRow}>
            <Tag label={type || 'Note'} />
            <View style={styles.dateContainer}>
                <Calendar size={14} color={colors.textSecondary} style={{ marginRight: 4 }} />
                <Text style={styles.dateText}>
                    {created_at ? new Date(created_at).toLocaleDateString() : 'Unknown date'}
                </Text>
            </View>
        </View>

        <Text style={styles.title}>{title}</Text>
        
        <View style={styles.separator} />

        <Text style={styles.body}>{content}</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: 4,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    maxWidth: '70%',
  },
  content: {
    padding: 24,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 24,
    lineHeight: 34,
  },
  separator: {
    height: 1,
    backgroundColor: colors.border,
    marginBottom: 24,
  },
  body: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 26,
  },
});
