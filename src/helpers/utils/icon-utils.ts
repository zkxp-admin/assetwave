import {
  Laptop,
  Monitor,
  Printer,
  Camera,
  Tablet,
  Smartphone,
  HardDrive,
  Server,
  Router,
  Keyboard,
  Mouse,
  Headphones,
  Speaker,
  Tv,
  Gamepad2,
  Watch,
  Cpu,
  Shield,
  Bell,
  LucideIcon,
} from 'lucide-react-native';

// Asset type mappings for notifications and asset management
export const ASSET_ICONS = {
  // Computers & Laptops
  laptop: Laptop,
  macbook: Laptop,
  latitude: Laptop,
  'dell latitude': Laptop,
  notebook: Laptop,

  // Desktops & Workstations
  desktop: Monitor,
  optiplex: Monitor,
  'dell optiplex': Monitor,
  workstation: Monitor,
  pc: Monitor,

  // Tablets & Mobile
  tablet: Tablet,
  ipad: Tablet,
  'ipad pro': Tablet,
  '12.9': Tablet,
  surface: Tablet,

  // Phones
  phone: Smartphone,
  smartphone: Smartphone,
  mobile: Smartphone,
  iphone: Smartphone,
  android: Smartphone,

  // Printers & Peripherals
  printer: Printer,
  laserjet: Printer,
  'hp laserjet': Printer,
  scanner: Printer,
  plotter: Printer,

  // Cameras & Imaging
  camera: Camera,
  eos: Camera,
  'eos r5': Camera,
  canon: Camera,
  webcam: Camera,

  // Storage & Servers
  server: Server,
  nas: Server,
  storage: HardDrive,
  'hard drive': HardDrive,
  ssd: HardDrive,

  // Networking
  router: Router,
  switch: Router,
  modem: Router,
  network: Router,

  // Peripherals
  keyboard: Keyboard,
  mouse: Mouse,
  headphones: Headphones,
  speaker: Speaker,
  monitor: Monitor,
  display: Monitor,

  // Entertainment
  tv: Tv,
  television: Tv,
  projector: Tv,

  // Gaming & Wearables
  controller: Gamepad2,
  gamepad: Gamepad2,
  watch: Watch,
  wearable: Watch,

  // Other Electronics
  cpu: Cpu,
  processor: Cpu,
  motherboard: Cpu,
} as const;

// Notification type icons
export const NOTIFICATION_ICONS = {
  like: Shield, // Using Shield as default for system notifications
  comment: Shield,
  mention: Shield,
  follow: Shield,
  system: Shield,
} as const;

/**
 * Get the appropriate icon for an asset based on its name or description
 */
export function getAssetIcon(title: string, message?: string): LucideIcon {
  const searchText = (title + ' ' + (message || '')).toLowerCase();

  // Check for exact matches first
  for (const [key, icon] of Object.entries(ASSET_ICONS)) {
    if (searchText.includes(key)) {
      return icon;
    }
  }

  // Default fallback
  return Monitor;
}

/**
 * Get the appropriate icon for a notification type
 */
export function getNotificationIcon(type: string): LucideIcon {
  return NOTIFICATION_ICONS[type as keyof typeof NOTIFICATION_ICONS] || Shield;
}

/**
 * Get icon color based on notification type and theme
 */
export function getNotificationColor(type: string, isDark: boolean = false): string {
  switch (type) {
    case 'like':
      return isDark ? '#f87171' : '#ef4444'; // Lighter red in dark mode
    case 'comment':
    case 'mention':
      return isDark ? '#60a5fa' : '#2864f0'; // Lighter blue in dark mode
    case 'follow':
      return isDark ? '#34d399' : '#10b981'; // Lighter green in dark mode
    case 'system':
      return isDark ? '#fbbf24' : '#f59e0b'; // Lighter orange in dark mode
    default:
      return isDark ? '#9ca3af' : '#6b7280'; // Lighter gray in dark mode
  }
}

/**
 * Get the standard unread indicator color for theme
 */
export function getUnreadIndicatorColor(isDark: boolean = false): string {
  return isDark ? '#60a5fa' : '#2864f0'; // Lighter blue in dark mode
}

/**
 * Get theme-appropriate foreground color
 */
export function getForegroundColor(isDark: boolean = false): string {
  return isDark ? '#ffffff' : '#000000';
}

/**
 * Get theme-appropriate muted color
 */
export function getMutedColor(isDark: boolean = false): string {
  return isDark ? '#9ca3af' : '#6b7280';
}

/**
 * Get all available asset icon types for reference
 */
export function getAvailableAssetTypes(): string[] {
  return Object.keys(ASSET_ICONS);
}

/**
 * Check if an asset type is supported
 */
export function isAssetTypeSupported(assetType: string): boolean {
  const lowerType = assetType.toLowerCase();
  return Object.keys(ASSET_ICONS).some(key => lowerType.includes(key));
}

