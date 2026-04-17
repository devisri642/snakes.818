export interface Track {
  id: string;
  title: string;
  artist: string;
  url: string;
}

export const TRACKS: Track[] = [
  {
    id: '1',
    title: 'Neon Drive [AI Dummy]',
    artist: 'SynthMixer AI',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  },
  {
    id: '2',
    title: 'Cyber Drift [AI Dummy]',
    artist: 'AudioGen X',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  },
  {
    id: '3',
    title: 'Digital Horizon [AI Dummy]',
    artist: 'Neural Beats',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
  },
];
