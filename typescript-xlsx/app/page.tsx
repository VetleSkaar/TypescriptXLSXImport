import Image from 'next/image'
import { getData } from './xlsxReader'

export default function Home() {
  getData();
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <button>Click me</button>
    </main>
  )
}
