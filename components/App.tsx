'use client';
import { useApp } from '@/lib/useApp';
import { UploadView } from './UploadView';
import { ListView } from './ListView';
import { DetailView } from './DetailView';
import { PreviewView } from './PreviewView';
import { InvoiceView } from './InvoiceView';
import { HistoryView } from './HistoryView';

export default function App() {
  const app = useApp();
  const V = { upload: UploadView, list: ListView, detail: DetailView, prev: PreviewView, inv: InvoiceView, hist: HistoryView }[app.view];
  return <V app={app} />;
}
