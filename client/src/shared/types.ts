export interface Track {
  _id: string;
  album_id: string;
  track_no: number;
  title: string;
  duration: string | null;     
  disc_no?: number;          
  artists?: string[];         
  audio_url?: string | null;   
  createdAt?: string;
  updatedAt?: string;
}

export interface Album {
  _id: string;
  title: string;
  artist: string[];
  year: number;
  genre: string[];
  label: string;
  about: string;
  cover: string;
  duration: string | null;
  release: string;
  format: string;
  barcode: string | null;
  country_origin: string;
}