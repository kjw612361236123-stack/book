type Listener<T> = (val: T) => void;

class AudioStore {
  private isPlaying = false;
  private isMuted = false;
  private isReady = false;
  
  private listeners = new Set<Listener<any>>();

  subscribe(listener: Listener<any>) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    for (const listener of this.listeners) {
      listener(this.getState());
    }
  }

  getState() {
    return {
      isPlaying: this.isPlaying,
      isMuted: this.isMuted,
      isReady: this.isReady,
    };
  }

  setIsPlaying(val: boolean) {
    if (this.isPlaying !== val) {
      this.isPlaying = val;
      this.notify();
    }
  }

  setIsMuted(val: boolean) {
    if (this.isMuted !== val) {
      this.isMuted = val;
      this.notify();
    }
  }

  setIsReady(val: boolean) {
    if (this.isReady !== val) {
      this.isReady = val;
      this.notify();
    }
  }

  // Commands to send to the player
  togglePlay() {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('AUDIO_TOGGLE_PLAY'));
    }
  }

  toggleMute() {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('AUDIO_TOGGLE_MUTE'));
    }
  }
}

export const audioStore = new AudioStore();
