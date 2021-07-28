export interface TokenMetadata {
  description: string;
  external_url: string;
  image: string;
  name: string;
  attributes: {
    trait_type?: string;
    display_type?: 'number' | 'boost_percentage' | 'boost_number' | 'date';
    max_value?: number;
    value: number | string;
  }[];
}
