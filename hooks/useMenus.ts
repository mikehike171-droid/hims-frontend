import { useState, useEffect } from 'react';

interface MenuItem {
  id: number;
  title: string;
  code: string;
  href?: string;
  icon?: string;
  sort_order: number;
  parent_id?: number;
  children?: MenuItem[];
}

export const useMenus = () => {
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMenus = () => {
      try {
        const sidemenu = JSON.parse(localStorage.getItem('sidemenu') || '[]');
        
        if (sidemenu.length > 0) {
          // Convert old format to new format
          const convertedMenus = sidemenu.map((item: any, index: number) => {
            const menu = item.menu;
            const mainMenu = {
              id: menu.id,
              title: menu.name,
              code: menu.path.toUpperCase().replace(/-/g, '_'),
              href: menu.sub_menu.length === 0 ? `/${menu.path}` : null,
              icon: menu.icon,
              sort_order: index + 1,
              parent_id: null,
              children: menu.sub_menu.map((sub: any, subIndex: number) => ({
                id: sub.id + 1000, // Offset to avoid conflicts
                title: sub.name,
                code: sub.path.toUpperCase().replace(/-/g, '_'),
                href: `/${sub.path}`,
                icon: 'FileText',
                sort_order: subIndex + 1,
                parent_id: menu.id
              }))
            };
            return mainMenu;
          });
          
          setMenus(convertedMenus);
        } else {
          setMenus([]);
        }
      } catch (error) {
        console.error('Failed to load menus:', error);
        setMenus([]);
      } finally {
        setLoading(false);
      }
    };

    loadMenus();
  }, []);

  const buildMenuTree = (flatMenus: MenuItem[]): MenuItem[] => {
    const menuMap = new Map<number, MenuItem>();
    const rootMenus: MenuItem[] = [];

    // Create menu map
    flatMenus.forEach(menu => {
      menuMap.set(menu.id, { ...menu, children: [] });
    });

    // Build tree structure
    flatMenus.forEach(menu => {
      const menuItem = menuMap.get(menu.id)!;
      if (menu.parent_id) {
        const parent = menuMap.get(menu.parent_id);
        if (parent) {
          parent.children!.push(menuItem);
        }
      } else {
        rootMenus.push(menuItem);
      }
    });

    // Sort menus by sort_order
    const sortMenus = (menus: MenuItem[]) => {
      menus.sort((a, b) => a.sort_order - b.sort_order);
      menus.forEach(menu => {
        if (menu.children && menu.children.length > 0) {
          sortMenus(menu.children);
        }
      });
    };

    sortMenus(rootMenus);
    return rootMenus;
  };

  return { menus, loading };
};