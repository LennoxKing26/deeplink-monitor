'use client';

import { useEffect } from 'react';

export function IconifyLoader() {
  useEffect(() => {
    // 动态导入 iconify-icon 包
    import('iconify-icon');
  }, []);

  return null;
}
