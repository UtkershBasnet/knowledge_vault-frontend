import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Keyboard } from 'react-native';
import { ArrowLeft, Sparkles } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import api from '../api/client';
import { SearchBar } from '../components/SearchBar';
import { Card } from '../components/Card';
import { Tag } from '../components/Tag';
import { colors } from '../constants/colors';

export default function SearchScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    setHasSearched(true);
    Keyboard.dismiss();
    
    try {
      const response = await api.post('/search', { query });
      setResults(response.data);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <Card onPress={() => router.push({ pathname: `/knowledge/${item.id}`, params: { ...item } })}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Tag label={item.type || 'Note'} />
      </View>
      <Text style={styles.cardContent} numberOfLines={3}>{item.content}</Text>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
             <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={{ flex: 1, marginLeft: 12 }}>
            <SearchBar 
                value={query} 
                onChangeText={setQuery} 
                onSubmit={handleSearch}
                autoFocus
            />
        </View>
      </View>

      <View style={styles.infoBar}>
        <Sparkles size={14} color={colors.accent} style={{ marginRight: 6 }} />
        <Text style={styles.infoText}>Results ranked by meaning, not keywords</Text>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.accent} />
          <Text style={styles.loadingText}>Understanding...</Text>
        </View>
      ) : (
        <FlatList
          data={results}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          keyboardShouldPersistTaps="handled" 
          ListEmptyComponent={
            hasSearched ? (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyText}>No matches found</Text>
                    <Text style={styles.emptySubtext}>Try differently phrasing your thought</Text>
                </View>
            ) : null
          }
        />
      )}
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
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 12,
    backgroundColor: colors.background,
  },
  backButton: {
    padding: 4,
  },
  infoBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    backgroundColor: '#EFF6FF', // Blue-50
  },
  infoText: {
    fontSize: 12,
    color: colors.accent,
    fontWeight: '600',
  },
  listContent: {
    padding: 20,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: colors.textSecondary,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    flex: 1,
    marginRight: 8,
  },
  cardContent: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 0,
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});
