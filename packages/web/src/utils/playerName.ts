class SimpleStore {
  key: string;
  value?: string;
  constructor(key: string) {
    this.key = key;
    this.value = localStorage.getItem(key) || undefined;
  }
  get() {
    return this.value;
  }
  set(value: string) {
    try {
      localStorage.setItem(this.key, value);
    } catch (error) {}
    this.value = value;
  }
}

export const PlayerName = new SimpleStore('BOARDGAME_PLAYERNAME');
