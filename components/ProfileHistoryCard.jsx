// components/ProfileHistoryCard.jsx
import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Pagination from './Pagination';

export default function ProfileHistoryCard({ history, onView, onDelete }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize]     = useState(5);

  const totalPages = Math.ceil(history.length / pageSize);
  const start      = (currentPage - 1) * pageSize;
  const pageItems  = history.slice(start, start + pageSize);

  return (
    <View style={[styles.card, styles.boxShadow]}>
      <Text style={styles.header}>History</Text>

      {history.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="time-outline" size={48} color="#888" />
          <Text style={styles.emptyText}>
            No history yet — start reviewing some recipes!
          </Text>
        </View>
      ) : (
        <>
          {pageItems.map(item => {
            // Safely parse date
            const date = item.dateCreated
              ? new Date(item.dateCreated).toLocaleDateString()
              : '';

            return (
              <View key={item.recipeId} style={styles.entry}>
                <Image source={{ uri: item.image }} style={styles.image} />
                <View style={styles.details}>
                  <View style={styles.topRow}>
                    <Text style={styles.title} numberOfLines={1}>
                      {item.name}
                    </Text>
                    <View style={styles.dateStarsRow}>
                      <Text style={styles.date}>{date}</Text>
                      <View style={styles.stars}>
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Ionicons
                            key={i}
                            name={i < item.rating ? 'star' : 'star-outline'}
                            size={16}
                            color="#F8D64E"
                          />
                        ))}
                      </View>
                    </View>
                  </View>
                  <Text style={styles.author}>By {item.author}</Text>

                  <View style={styles.commentRow}>
                    <Text
                      style={styles.comment}
                      numberOfLines={2}
                      ellipsizeMode="tail"
                    >
                      {item.comment}
                    </Text>
                    <TouchableOpacity
                      style={styles.viewBtn}
                      onPress={() => onView(item.recipeId)}
                    >
                      <Ionicons name="eye-outline" size={16} color="#FFF" />
                      <Text style={styles.btnText}>View</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.delBtn}
                      onPress={() => onDelete(item.recipeId)}
                    >
                      <Ionicons name="trash-outline" size={16} color="#FFF" />
                      <Text style={styles.btnText}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            );
          })}

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            onPageSizeChange={v => { setPageSize(v); setCurrentPage(1); }}
            onNextPage={() => currentPage < totalPages && setCurrentPage(p => p + 1)}
            onPrevPage={() => currentPage > 1 && setCurrentPage(p => p - 1)}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#F8D64E',
    margin: 16,
    borderRadius: 12,
    padding: 12,
  },
  boxShadow: {
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  emptyText: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  entry: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 8,
    marginBottom: 8,
    overflow: 'hidden',
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 15,
    marginTop: 8,
    marginBottom: 8,
    marginLeft: 8,
    marginRight: 8,
  },
  details: {
    flex: 1,
    padding: 8,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
  },
  dateStarsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  date: {
    fontSize: 12,
    color: '#555',
    marginRight: 6,   // space between date and stars
  },
  stars: {
    flexDirection: 'row',
  },
  author: {
    fontSize: 12,
    color: '#555',
    marginTop: 2,
    marginBottom: 4,
  },
  commentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  comment: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  viewBtn: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    marginLeft: 8,
  },
  delBtn: {
    backgroundColor: '#D9534F',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    marginLeft: 8,
  },
  btnText: {
    color: '#FFF',
    marginLeft: 4,
    fontSize: 15,
    fontWeight: '600',
  },
});
