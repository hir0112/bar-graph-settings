// グラフ設定をLocalStorageに保存
export const saveGraphSettings = (key = 'graphSettings', settings) => {
  try {
    localStorage.setItem(key, JSON.stringify(settings));
    return true;
  } catch (error) {
    console.error(`設定の保存に失敗しました (キー: ${key}):`, error);
    return false;
  }
};

// LocalStorageからグラフ設定を読み込み
export const loadGraphSettings = (key = 'graphSettings') => {
  try {
    const storedSettings = localStorage.getItem(key);
    return storedSettings ? JSON.parse(storedSettings) : null;
  } catch (error) {
    console.error(`設定の読み込みに失敗しました (キー: ${key}):`, error);
    return null;
  }
};

// グラフ設定をLocalStorageから削除
export const clearGraphSettings = (key = 'graphSettings') => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`設定の削除に失敗しました (キー: ${key}):`, error);
    return false;
  }
};