import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useTheme } from 'heroui-native';
import { CircularProgress } from 'react-native-circular-progress';
import { Surface } from 'heroui-native';

interface MetricData {
  title: string;
  value: number;
  color: string;
}

interface CircularMetricsProps {
  metrics: MetricData[];
}

export function CircularMetrics({ metrics }: CircularMetricsProps) {
  const { colors } = useTheme();

  return (
    <Surface variant="2" className="p-2">
      <Text style={[styles.cardTitle, { color: colors.foreground }]}>
        System Performance
      </Text>
      <Text style={[styles.cardText, { color: colors.foreground }]}>
        Monitor key metrics and system status
      </Text>
      
      <View style={styles.metricsContainer}>
        {metrics.map((metric, index) => (
          <View key={index} style={styles.metricCard}>
            <Text style={[styles.metricTitle, { color: colors.foreground }]}>
              {metric.title}
            </Text>
            <CircularProgress
              size={80}
              width={12}
              fill={metric.value}
              tintColor={metric.color}
              backgroundColor="#E0E0E0"
              rotation={0}
              lineCap="round"
            >
              {() => (
                <Text style={[styles.metricValue, { color: colors.foreground }]}>
                  {metric.value}%
                </Text>
              )}
            </CircularProgress>
          </View>
        ))}
      </View>
    </Surface>
  );
}

const styles = StyleSheet.create({
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
    opacity: 0.7,
  },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    gap: 4,
  },
  metricCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 4,
  },
  metricTitle: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  metricValue: {
    fontSize: 14,
    fontWeight: '700',
  },
});
