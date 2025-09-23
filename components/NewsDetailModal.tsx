import React from 'react';
import {
  Modal,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import X from 'lucide-react-native';

interface NewsItem {
  id: string;
  title: string;
  content: string;
  author: string;
  category: string;
  publishedAt: string;
  imageUrl: string;
  readTime: string;
}

interface NewsDetailModalProps {
  visible: boolean;
  newsItem: NewsItem | null;
  onClose: () => void;
}

export const NewsDetailModal: React.FC<NewsDetailModalProps> = ({
  visible,
  newsItem,
  onClose,
}) => {
  if (!newsItem) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color="#333" />
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <Image source={{ uri: newsItem.imageUrl }} style={styles.heroImage} />
          
          <View style={styles.articleContent}>
            <View style={styles.categoryContainer}>
              <Text style={styles.category}>{newsItem.category}</Text>
            </View>
            
            <Text style={styles.title}>{newsItem.title}</Text>
            
            <View style={styles.metadata}>
              <Text style={styles.author}>By {newsItem.author}</Text>
              <Text style={styles.separator}>•</Text>
              <Text style={styles.date}>
                {new Date(newsItem.publishedAt).toLocaleDateString()}
              </Text>
              <Text style={styles.separator}>•</Text>
              <Text style={styles.readTime}>{newsItem.readTime}</Text>
            </View>
            
            <Text style={styles.articleText}>{newsItem.content}</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  closeButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  heroImage: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  articleContent: {
    padding: 20,
  },
  categoryContainer: {
    marginBottom: 12,
  },
  category: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    lineHeight: 36,
    marginBottom: 16,
  },
  metadata: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  author: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  separator: {
    fontSize: 14,
    color: '#ccc',
    marginHorizontal: 8,
  },
  date: {
    fontSize: 14,
    color: '#666',
  },
  readTime: {
    fontSize: 14,
    color: '#666',
  },
  articleText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    textAlign: 'left',
  },
});