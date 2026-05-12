import './globals.css'

export const metadata = {
  title: 'Noir Brew Coffee',
  description: 'A futuristic premium coffee shop experience.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
