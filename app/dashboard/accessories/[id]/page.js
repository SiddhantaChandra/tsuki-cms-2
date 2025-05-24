import AccessoryDetailClient from './client';

export const runtime = 'edge';

export default function AccessoryDetailPage({ params }) {
  return <AccessoryDetailClient params={params} />;
} 