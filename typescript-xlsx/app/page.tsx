import Image from 'next/image'
import { waybillConstructor } from './xlsxReader'
import { IAdmin } from '@/src/utils/interfaces';

export default function Home() {
  /*const path = "src/utils/ExampleSheet.xlsx"
  const adminUser: IAdmin = {
    transportFirm: 'Tmax',
    email: 'admin@admin.no',
    name: 'Arne ',
    phoneNumber: '+47 6325666653',
    responsibleFor: []
  };
  waybillConstructor(path, 2, 7, 1,adminUser);*/
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <button>Click me</button>
    </main>
  )
}
