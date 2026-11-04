export type Color = 'bw' | 'c';
export type View = 'upload' | 'list' | 'detail' | 'prev' | 'inv' | 'hist';
export interface Settings { color: Color; copies: number; range: string; orient: string }
export interface PFile {
  id: number; name: string; size: number; pages: number; ext: string; thumb?: string; file: File;
  ov: Partial<Settings>; edit: boolean; note: string;
}
export interface OrderItem {
  name: string; color: Color; pages: number; copies: number; orient: string;
  range: string; edit: boolean; note: string; cost: number;
}
export interface Order {
  no: string; name: string; t: number; total: number; items: OrderItem[];
  req?: 'pending' | 'sent' | 'failed'; ticket?: string; sim?: boolean;
}
