
import './globals.css';
import { ClientApolloProvider } from '@/providers/apollo-provider';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ClientApolloProvider>
          {children}
        </ClientApolloProvider>
      </body>
    </html>
  );
}


// import type { Metadata } from "next";
// import { Inter } from "next/font/google";
// import "./globals.css";
// import { ClientApolloProvider } from "@/providers/apollo-provider";

// const fontSans = Inter({
//   subsets: ["latin"],
//   variable: "--font-sans",
// });

// export const metadata: Metadata = {
//   title: "PeerShare",
//   description: "P2P File Sharing App",
// };

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="en">
//       <body className={fontSans.variable}>
//         <ClientApolloProvider>
//           {children}
//         </ClientApolloProvider>
//       </body>
//     </html>
//   );
// }