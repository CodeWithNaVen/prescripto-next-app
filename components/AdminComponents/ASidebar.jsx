// components/admin/ASidebar.jsx
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { adminAssets } from '@/assets/admin_assets/adminAssets';
import Image from 'next/image';

const sidebarItems = [
  {
    label: 'Dashboard',
    path: '/admin/dashboard',
    icon: adminAssets.home_icon
  },
  {
    label: 'Appointments',
    path: '/admin/appointments',
    icon: adminAssets.appointment_icon
  },
  {
    label: 'Add Doctor',
    path: '/admin/add-doctor',
    icon: adminAssets.add_icon
  },
  {
    label: 'Doctors List',
    path: '/admin/doctors',
    icon: adminAssets.people_icon
  },
];

const ASidebar = () => {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-white border-r border-gray-300 w-max">
      <ul className="text-gray-700 mt-5">
        {sidebarItems.map((item) => (
          <li key={item.path}>
            <Link
              href={item.path}
              className={`flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${pathname === item.path ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''}`}
            >
              <Image src={item.icon} width={25} height={25} alt={item.label} />
              <p className="hidden md:block">{item.label}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ASidebar;