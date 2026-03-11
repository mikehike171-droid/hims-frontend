// Utility to update settings submodule icons in localStorage
export const updateSettingsIcons = () => {
  if (typeof window === 'undefined') return;

  try {
    const sideMenuData = localStorage.getItem('sidemenu');
    if (!sideMenuData) return;

    const parsedMenu = JSON.parse(sideMenuData);
    
    // Icon mapping for settings submodules
    const settingsIconMap: { [key: string]: string } = {
      'admin/settings/users': 'UserCog',
      'admin/settings/departments': 'Building', 
      'admin/settings/locations': 'MapPinned',
      'admin/settings/roles': 'ShieldCheck',
      'admin/settings/system': 'Cog',
      'admin/settings/audit-logs': 'ScrollText'
    };

    // Update icons for settings submodules
    const updatedMenu = parsedMenu.map((item: any) => {
      if (item.menu && item.menu.path === 'admin/settings') {
        // Update main settings icon
        item.menu.icon = 'Settings';
        
        // Update submodule icons
        if (item.menu.sub_menu) {
          item.menu.sub_menu = item.menu.sub_menu.map((sub: any) => {
            const iconName = settingsIconMap[sub.path];
            if (iconName) {
              sub.icon = iconName;
            }
            return sub;
          });
        }
      }
      return item;
    });

    // Save updated menu back to localStorage
    localStorage.setItem('sidemenu', JSON.stringify(updatedMenu));
    
    console.log('Settings icons updated successfully');
    
    // Trigger a page refresh to apply changes
    window.location.reload();
    
  } catch (error) {
    console.error('Error updating settings icons:', error);
  }
};

export default updateSettingsIcons;