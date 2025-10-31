import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Animated } from 'react-native';
import { useTheme } from 'heroui-native';

interface Tab {
  key: string;
  title: string;
}

interface TabBarProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabKey: string) => void;
}

export function TabBar({ tabs, activeTab, onTabChange }: TabBarProps) {
  const { colors } = useTheme();
  const [indicatorPosition] = React.useState(new Animated.Value(0));
  const tabWidth = 100 / tabs.length;

  React.useEffect(() => {
    const activeIndex = tabs.findIndex(tab => tab.key === activeTab);
    Animated.spring(indicatorPosition, {
      toValue: activeIndex * tabWidth,
      useNativeDriver: false,
      tension: 68,
      friction: 10,
    }).start();
  }, [activeTab, tabs, tabWidth]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
      <View style={styles.tabsWrapper}>
        {tabs.map((tab, index) => {
          const isActive = tab.key === activeTab;
          return (
            <TouchableOpacity
              key={tab.key}
              style={styles.tab}
              onPress={() => onTabChange(tab.key)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.tabText,
                  {
                    color: isActive ? colors.accent : colors.foreground,
                    fontWeight: isActive ? '600' : '500',
                  },
                ]}
              >
                {tab.title}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      
      {/* Animated indicator */}
      <Animated.View
        style={[
          styles.indicator,
          {
            backgroundColor: '#2864f0', // Blue color
            width: `${tabWidth * 0.6}%`, // Reduced width to 60% of tab width
            left: indicatorPosition.interpolate({
              inputRange: [0, 100],
              outputRange: ['0%', '100%'],
            }),
            marginLeft: `${tabWidth * 0.2}%`, // Center the indicator
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
  },
  tabsWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  tabText: {
    fontSize: 16,
    textAlign: 'center',
  },
  indicator: {
    position: 'absolute',
    bottom: 0,
    height: 1.5, // Reduced height
    borderRadius: 1,
  },
});
