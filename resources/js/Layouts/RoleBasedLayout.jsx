import React from 'react';
import { usePage } from '@inertiajs/react';
import ApplicantLayout from '@/Layouts/ApplicantLayout';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function RoleBasedLayout({ children, header }) {
  const { auth } = usePage().props;
  const user = auth.user;

  // Safeguard: If no user object is present, return a loading state or handle redirect.
  // The backend middleware should handle this, but it's a good practice to include.
  if (!user) {
    return <div>Loading...</div>;
  }

  // Administrators and Registrars (staff roles) get the comprehensive AuthenticatedLayout.
  if (user.roles.includes('admin') || user.roles.includes('registrar')) {
    return <AuthenticatedLayout header={header}>{children}</AuthenticatedLayout>;
  }

  // Applicants (end-users) get the streamlined ApplicantLayout.
  if (user.roles.includes('applicant')) {
    return <ApplicantLayout header={header}>{children}</ApplicantLayout>;
  }

  // Fallback for any unhandled or unrecognized roles to ensure a secure "deny-by-default" approach.
  console.warn(`User with ID ${user.id} has an unrecognized role.`);
  return <div>Access Denied. Your user role is not recognized.</div>;
}