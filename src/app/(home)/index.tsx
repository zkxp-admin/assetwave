import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from 'heroui-native';
import { HomeHeader } from '../../components/headers/home-header';
import { DashboardTab } from '../../components/home/dashboard-tab';
import { NewsfeedTab } from '../../components/home/newsfeed-tab';

const TABS = [
  { key: 'dashboard', title: 'Dashboard' },
  { key: 'newsfeed', title: 'Newsfeed' },
];

export default function HomeScreen() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { colors } = useTheme();

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardTab />;
      case 'newsfeed':
        return <NewsfeedTab />;
      default:
        return <DashboardTab />;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <HomeHeader 
        tabs={TABS}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      >
        {renderTabContent()}
      </HomeHeader>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
