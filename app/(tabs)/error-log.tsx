import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';

// Global error storage
export let errorLogs: { id: string; timestamp: string; message: string; source: string }[] = [];

// Function to add error to log (call this from anywhere in the app)
export const addErrorLog = (message: string, source: string) => {
  const newError = {
    id: Date.now().toString(),
    timestamp: new Date().toLocaleTimeString(),
    message: message,
    source: source,
  };
  errorLogs = [newError, ...errorLogs].slice(0, 50); // Keep last 50 errors
};

// Function to clear all error logs
export const clearErrorLogs = () => {
  errorLogs = [];
};

export default function ErrorLogPage() {
  const [logs, setLogs] = useState(errorLogs);
  const [refreshing, setRefreshing] = useState(false);

  // Refresh the UI when logs change
  useEffect(() => {
    const interval = setInterval(() => {
      setLogs([...errorLogs]);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const handleClear = () => {
    clearErrorLogs();
    setLogs([]);
  };

  const handleRefresh = () => {
    setLogs([...errorLogs]);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="bug-outline" size={28} color="#ef4444" />
        <Text style={styles.headerTitle}>Error Log</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity onPress={handleRefresh} style={styles.headerButton}>
            <Ionicons name="refresh-outline" size={20} color="#3b82f6" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleClear} style={styles.headerButton}>
            <Ionicons name="trash-outline" size={20} color="#ef4444" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsCard}>
        <Text style={styles.statsText}>Total Errors: {logs.length}</Text>
        <Text style={styles.statsSubtext}>
          {logs.length === 0 ? 'No errors captured' : `Last error: ${logs[0]?.timestamp || 'N/A'}`}
        </Text>
      </View>

      {/* Error List */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {logs.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="checkmark-circle" size={64} color="#22c55e" />
            <Text style={styles.emptyText}>No Errors</Text>
            <Text style={styles.emptySubtext}>All systems working correctly</Text>
          </View>
        ) : (
          logs.map((log) => (
            <View key={log.id} style={styles.errorCard}>
              <View style={styles.errorHeader}>
                <Ionicons name="alert-circle" size={18} color="#ef4444" />
                <Text style={styles.errorTime}>{log.timestamp}</Text>
                <View style={styles.errorSource}>
                  <Text style={styles.errorSourceText}>{log.source}</Text>
                </View>
              </View>
              <Text style={styles.errorMessage}>{log.message}</Text>
            </View>
          ))
        )}
      </ScrollView>

      {/* Hint */}
      <View style={styles.hintCard}>
        <Ionicons name="information-circle-outline" size={16} color="#64748b" />
        <Text style={styles.hintText}>
          This page is for development only. Delete this page before production.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#f1f5f9',
    flex: 1,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  headerButton: {
    padding: 8,
  },
  statsCard: {
    backgroundColor: '#1e293b',
    marginHorizontal: 16,
    marginBottom: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  statsText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f1f5f9',
  },
  statsSubtext: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#22c55e',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 8,
  },
  errorCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#ef4444',
  },
  errorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  errorTime: {
    fontSize: 11,
    color: '#64748b',
  },
  errorSource: {
    backgroundColor: '#ef444420',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  errorSourceText: {
    fontSize: 10,
    color: '#f87171',
    fontWeight: '500',
  },
  errorMessage: {
    fontSize: 13,
    color: '#f1f5f9',
    lineHeight: 18,
  },
  hintCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    marginHorizontal: 16,
    marginBottom: 16,
    marginTop: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 6,
  },
  hintText: {
    fontSize: 10,
    color: '#64748b',
  },
});