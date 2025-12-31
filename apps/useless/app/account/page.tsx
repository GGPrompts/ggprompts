import { redirect } from 'next/navigation';

// Redirect /account to /account/profile
export default function AccountPage() {
  redirect('/account/profile');
}
