export interface Country {
  id: string;
  name: string;
  localName: string;
  dialCode: string;
  flag: string;
  region: 'Latin America' | 'North America' | 'Europe' | 'Asia' | 'Africa' | 'Oceania' | 'Middle East';
}
