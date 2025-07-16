import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNews } from '../../hooks/useSupabaseData';
import { NewsDetailModal } from '../../components/NewsDetailModal';

interface NewsItem {
  id: string;
  title: string;
  description: string;
  content: string;
  image_url: string;
  category: string;
  author: string;
  read_time: string;
  published_at: string;
}

export default function NewsScreen() {
  const { data: news, loading, refetch } = useNews();
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    refetch();
    setRefreshing(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      academic: '#4285F4',
      sports: '#34A853',
      cultural: '#EA4335',
      general: '#9AA0A6',
      announcement: '#FF9800',
    };
    return colors[category.toLowerCase()] || colors.general;
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>News</Text>
            <TouchableOpacity style={styles.filterButton}>
              <Ionicons name="options" size={24} color="white" />
            </TouchableOpacity>
          </View>
          <View style={styles.contentArea}>
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading news...</Text>
            </View>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>News</Text>
          <TouchableOpacity style={styles.filterButton}>
            <Ionicons name="options" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Content Area */}
        <View style={styles.contentArea}>
          <ScrollView
            style={styles.newsContainer}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            {news.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No news available</Text>
                <Text style={styles.emptySubtext}>Check back later for updates</Text>
              </View>
            ) : (
              news.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.newsCard}
                  onPress={() => setSelectedNews(item)}
                >
                  <Image source={{ uri: item.image_url }} style={styles.newsImage} />
                  
                  <View style={styles.newsContent}>
                    <View style={styles.newsHeader}>
                      <View
                        style={[
                          styles.categoryBadge,
                          { backgroundColor: getCategoryColor(item.category) },
                        ]}
                      >
                        <Text style={styles.categoryText}>{item.category}</Text>
                      </View>
                      <Text style={styles.readTime}>{item.read_time}</Text>
                    </View>

                    <Text style={styles.newsTitle} numberOfLines={2}>
                      {item.title}
                    </Text>
                    
                    <Text style={styles.newsDescription} numberOfLines={3}>
                      {item.description}
                    </Text>

                    <View style={styles.newsFooter}>
                      <Text style={styles.author}>By {item.author}</Text>
                      <Text style={styles.date}>{formatDate(item.published_at)}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        </View>

        <NewsDetailModal
          news={selectedNews}
          visible={!!selectedNews}
          onClose={() => setSelectedNews(null)}
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#DC2626',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#DC2626',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  filterButton: {
    padding: 8,
  },
  contentArea: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  newsContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  newsCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  newsImage: {
    width: '100%',
    height: 200,
  },
  newsContent: {
    padding: 20,
  },
  newsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
  readTime: {
    fontSize: 12,
    color: '#6B7280',
  },
  newsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
    lineHeight: 24,
  },
  newsDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 16,
  },
  newsFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  author: {
    fontSize: 12,
    color: '#495057',
    fontWeight: '500',
  },
  date: {
    fontSize: 12,
    color: '#6B7280',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#D1D5DB',
    textAlign: 'center',
  },
});