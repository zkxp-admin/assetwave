import React from 'react';
import { StyleSheet, View, ScrollView, Text, Platform } from 'react-native';
import { useTheme } from 'heroui-native';
import { Database, BarChart3 } from 'lucide-react-native';
import { PortfolioSummary } from './portfolio-summary';
import { AssetValueChart } from './asset-value-chart';
import { AssetStatusChart } from './asset-status-chart';
import { AssetDepreciationChart } from './asset-depreciation-chart';
import { AssetHealthDialChart } from './asset-health-dial-chart';

export function DashboardTab() {
  const { colors } = useTheme();

  // Hardcoded demo metrics
  const portfolioMetrics = {
    totalValue: 1349035.20,
    totalPurchaseCost: 1520000.00,
    assetCount: 67,
    averageDepreciation: 11.27,
    activeAssets: 45,
    inactiveAssets: 12,
    maintenanceAssets: 8,
    retiredAssets: 2,
    monthlyOMCost: 2021.35,
    healthScore: 82.4,
  };

  // Hardcoded status distribution data
  const statusDistribution = [
    { status: 'Active', count: 45, percentage: 67.16, color: '#4CAF50' },
    { status: 'Inactive', count: 12, percentage: 17.91, color: '#9E9E9E' },
    { status: 'Maintenance', count: 8, percentage: 11.94, color: '#FF9800' },
    { status: 'Retired', count: 2, percentage: 2.99, color: '#F44336' },
  ];

  // Hardcoded asset value chart data (top 15 assets)
  const assetValueData = [
    { name: 'Storage Array #7', value: 42850.25, status: 'Active', color: '#4CAF50' },
    { name: 'Storage Array #17', value: 41250.50, status: 'Active', color: '#4CAF50' },
    { name: 'Storage Array #27', value: 39800.75, status: 'Active', color: '#4CAF50' },
    { name: 'GPU Node #9', value: 33125.00, status: 'Active', color: '#4CAF50' },
    { name: 'GPU Node #19', value: 32450.50, status: 'Maintenance', color: '#FF9800' },
    { name: 'GPU Node #29', value: 31920.25, status: 'Active', color: '#4CAF50' },
    { name: 'Server #6', value: 14250.75, status: 'Active', color: '#4CAF50' },
    { name: 'Server #16', value: 13980.00, status: 'Active', color: '#4CAF50' },
    { name: 'Load Balancer #8', value: 11850.50, status: 'Active', color: '#4CAF50' },
    { name: 'Load Balancer #18', value: 11420.25, status: 'Inactive', color: '#9E9E9E' },
    { name: 'Validator Node #1', value: 8250.00, status: 'Active', color: '#4CAF50' },
    { name: 'Router #10', value: 7950.75, status: 'Active', color: '#4CAF50' },
    { name: 'Network Switch #2', value: 1175.50, status: 'Active', color: '#4CAF50' },
    { name: 'Rack Power Supply #5', value: 720.25, status: 'Active', color: '#4CAF50' },
    { name: 'Cell Node #3', value: 425.00, status: 'Retired', color: '#F44336' },
  ];

  // Hardcoded depreciation data (top 8 assets)
  const depreciationData = [
    { name: 'Hardware Wallet #4', purchaseCost: 150, currentValue: 95, depreciation: 36.67 },
    { name: 'Cell Node #3', purchaseCost: 500, currentValue: 350, depreciation: 30.00 },
    { name: 'Network Switch #2', purchaseCost: 1200, currentValue: 900, depreciation: 25.00 },
    { name: 'Rack Power Supply #5', purchaseCost: 800, currentValue: 640, depreciation: 20.00 },
    { name: 'Validator Node #1', purchaseCost: 8500, currentValue: 7650, depreciation: 10.00 },
    { name: 'Router #10', purchaseCost: 8000, currentValue: 7400, depreciation: 7.50 },
    { name: 'Server #6', purchaseCost: 15000, currentValue: 14100, depreciation: 6.00 },
    { name: 'GPU Node #9', purchaseCost: 35000, currentValue: 33125, depreciation: 5.36 },
  ];

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Database size={24} color={colors.foreground} />
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            Your Assets
          </Text>
        </View>
      </View>

      {/* Portfolio Summary Cards */}
      <PortfolioSummary metrics={portfolioMetrics} />

      <View style={styles.section}>
        <View style={styles.titleContainer}>
          <BarChart3 size={24} color={colors.foreground} />
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            Analytics
          </Text>
        </View>
      </View>

      {/* Asset Health Dial Chart */}
      <View style={styles.chartSpacing}>
        <AssetHealthDialChart />
      </View>

      {/* Asset Status Donut Chart */}
      <View style={styles.chartSpacing}>
        <AssetStatusChart data={statusDistribution} totalAssets={portfolioMetrics.assetCount} />
      </View>


      {/* Asset Value Bar Chart */}
      <AssetValueChart data={assetValueData} />



      {/* Asset Depreciation Comparison Chart */}
      <View style={styles.chartSpacing}>
        <AssetDepreciationChart data={depreciationData} />
      </View>

      {/* Bottom padding */}
      <View style={styles.bottomPadding} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingTop: Platform.select({
      ios: 150,
      android: 130,
    }),
    paddingHorizontal: 6,
  },
  header: {
    marginBottom: 12,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    opacity: 0.7,
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  chartSpacing: {
    marginTop: 20,
  },
  bottomPadding: {
    height: 110,
  },
});
