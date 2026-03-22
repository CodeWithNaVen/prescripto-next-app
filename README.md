next is appointment page

![alt text](image.png)

![alt text](image-1.png)


src/
├── app/
│   ├── api/
│   │   └── auth/
│   │       └── [...nextauth]/
│   ├── lib/
│   │   ├── db.js         # MongoDB connection
│   │   └── auth.js       # Authentication utils
│   ├── models/
│   │   ├── User.js
│   │   ├── Doctor.js
│   │   └── Appointment.js
│   └── types/
│       └── index.js      # TypeScript interfaces

Backend:
/app/api/
├── auth/
├── admin/
│   ├── doctors/
│   └── appointments/
├── doctors/
│   ├── profile/
│   └── appointments/
└── users/
    ├── appointments/
    └── profile/


Frontend:
/app/
├── page.tsx (Home)
├── about/
├── contact/
├── doctors/
├── appointments/
├── auth/
│   ├── signin/
│   └── signup/
├── admin/
│   ├── dashboard/
│   ├── doctors/
│   └── appointments/
├── doctor/
│   ├── dashboard/
│   ├── profile/
│   └── appointments/
└── user/
    ├── profile/
    └── appointments/


    thaiba- garment
    thapathali- settel

    #dummy doctor data
    {
        _id: 'doc1',
        name: 'Dr. Richard James',
        image: doc1,
        speciality: 'General physician',
        degree: 'MBBS',
        experience: '4 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 50,
        address: {
            line1: '17th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        }
    },

    // will be working on the ui and brand changing part