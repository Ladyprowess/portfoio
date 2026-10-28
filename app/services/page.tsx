import ServicesPage from '@/components/services/ServicesPage'

export const metadata = { title: 'Services', description: 'Product marketing, technical writing, website design, Web3 and AI training, and business building by Ngozi Peace Okafor (Lady Prowess), shown live.', alternates: { canonical: '/services' }, openGraph: { title: 'Services | Lady Prowess', description: 'What Ngozi Peace Okafor can do for your brand: product marketing, technical writing, websites, training and business building.', url: '/services', images: ['/opengraph-image'] } }

export default function Page() {
  return <ServicesPage />
}
