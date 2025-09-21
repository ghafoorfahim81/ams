import React from 'react';
import { trans } from "@/lib/utils";
import { Link } from '@inertiajs/react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-background mt-auto p-4 md:p-6 border-t border-gray-200 dark:border-gray-800 rounded-t-lg">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between text-center text-sm text-gray-500 dark:text-gray-400">
        <p>
          &copy; {currentYear} {trans("app:Application_Name")}. {trans("All_rights_reserved")}.
        </p>
        <div className="flex items-center gap-4 mt-2 md:mt-0">
          <Link href={route('privacy.policy')} className="hover:text-primary transition-colors">
            {trans("Privacy Policy")}
          </Link>
          <Link href={route('terms.of.service')} className="hover:text-primary transition-colors">
            {trans("Terms of Service")}
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
