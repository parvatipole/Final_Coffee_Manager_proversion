// Utility functions for office-specific routing

/**
 * Converts office name to URL-friendly path
 */
export function officeNameToPath(officeName: string): string {
  return officeName
    .toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with dashes
    .replace(/[^a-z0-9\-]/g, '')    // Remove special characters except dashes
    .replace(/-+/g, '-')            // Replace multiple dashes with single dash
    .replace(/^-|-$/g, '');         // Remove leading/trailing dashes
}

/**
 * Converts URL path back to office name (for validation)
 */
export function pathToOfficeName(path: string): string {
  // This is a reverse mapping - you might want to maintain a lookup table
  // for more reliable reverse conversion in production
  return path
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Available offices from signup
 */
export const OFFICE_LOCATIONS = {
  pune: [
    "Hinjewadi IT Park",
    "Koregaon Park Office", 
    "Baner Tech Hub",
    "Magarpatta City",
    "Wakad Business Center",
    "Viman Nagar Branch",
  ],
  mumbai: [
    "Mumbai BKC",
    "Andheri East",
    "Powai Tech Park", 
    "Lower Parel",
    "Worli Business District",
    "Goregaon East",
  ],
} as const;

/**
 * Get all available office paths
 */
export function getAllOfficePaths(): string[] {
  const allOffices = [...OFFICE_LOCATIONS.pune, ...OFFICE_LOCATIONS.mumbai];
  return allOffices.map(officeNameToPath);
}

/**
 * Check if a path corresponds to a valid office
 */
export function isValidOfficePath(path: string): boolean {
  return getAllOfficePaths().includes(path);
}
