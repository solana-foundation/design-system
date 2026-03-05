import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
    title: 'Token List Example | Solana Design System',
    description: 'Example application showcasing the Solana Design System components',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className="min-h-screen bg-white antialiased">{children}</body>
        </html>
    );
}
