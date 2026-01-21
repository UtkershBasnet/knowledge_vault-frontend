import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../constants/colors';

export const Tag = ({ label }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F3F4F6', // Gray-100
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  text: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '500',
  },
});
