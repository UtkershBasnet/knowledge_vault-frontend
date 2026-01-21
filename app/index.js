import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, RefreshControl } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { Plus, LogOut } from 'lucide-react-native';
import api from '../api/client';
import { Card } from '../components/Card';
import { Tag } from '../components/Tag';
import { SearchBar } from '../components/SearchBar';
import { colors } from '../constants/colors';
import { useAuth } from '../context/AuthContext';

export default function KnowledgeFeedScreen() {
  const router = useRouter();
  const { logout } = useAuth();
  const [knowledge, setKnowledge] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchKnowledge = async () => {
    try {
      const response = await api.get('/knowledge');
      setKnowledge(response.data);
    } catch (error) {
      console.error('Failed to fetch knowledge:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleSignOut = () => {
    logout();
    router.replace('/auth/login');
  };

  useFocusEffect(
    useCallback(() => {
      fetchKnowledge();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchKnowledge();
  };

  const renderItem = ({ item }) => (
    <Card onPress={() => router.push({ pathname: `/knowledge/${item.id}`, params: { ...item } })}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
        <Tag label={item.type || 'Note'} />
      </View>
      <Text style={styles.cardContent} numberOfLines={3}>{item.content}</Text>
      <Text style={styles.cardDate}>{new Date(item.created_at).toLocaleDateString()}</Text>
    </Card>
  );

  return (
    
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your Knowledge</Text>
        <TouchableOpacity 
          onPress={handleSignOut}
          style={styles.signOutButton}
          activeOpacity={0.7}
        >
          <LogOut size={24} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.searchContainer}>
        <TouchableOpacity activeOpacity={1} onPress={() => router.push('/search')}>
            <View pointerEvents="none">
                <SearchBar value="" placeholder="Search your brain..." />
            </View>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.accent} />
        </View>
      ) : (
        <FlatList
          data={knowledge}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No knowledge yet.</Text>
              <Text style={styles.emptySubtext}>Add something new!</Text>
            </View>
          }
        />
      )}

        <TouchableOpacity 
            style={styles.fab} 
            onPress={() => router.push('/knowledge/add')}
            activeOpacity={0.8}
        >
            <Plus size={32} color="#fff" />
        </TouchableOpacity>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60, 
    paddingBottom: 20,
    backgroundColor: colors.background,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
  },
  signOutButton: {
    padding: 8,
    borderRadius: 8,
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  listContent: {
    padding: 20,
    paddingTop: 10,
    paddingBottom: 100, // Space for FAB
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
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
    marginBottom: 12,
    lineHeight: 20,
  },
  cardDate: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: colors.accent,
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
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
