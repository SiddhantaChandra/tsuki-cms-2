import { redirect } from 'next/navigation';

export default function HomePage() {
  redirect('/login');
  // This component will not render anything as redirect throws an error
  // that Next.js handles by redirecting the user.
  return null;
}
