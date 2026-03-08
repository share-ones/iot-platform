/*"use client";

import { SearchProvider } from "@/app/components/search/SearchContext";

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SearchProvider>{children}</SearchProvider>;
}
*/

"use client";

//import { SessionProvider } from "next-auth/react";
import { SearchProvider } from "@/app/components/search/SearchContext";

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    
      <SearchProvider>
        {children}
      </SearchProvider>
    
  );
}
