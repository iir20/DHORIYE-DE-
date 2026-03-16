export interface Report {
  id: string;
  created_at: string;
  title: string;
  description: string;
  corruption_type: string;
  latitude: number;
  longitude: number;
  image_url: string | null;
  true_votes: number;
  false_votes: number;
}
