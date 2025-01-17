import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import RegisterForm from '@/components/forms/RegisterForm';
import { getUser } from '@/lib/actions/patient.actions';

//const Register = async ({params: {userId}}: SearchParamProps) => {  //userId get from folder name
const Register = async ({params} : {params: {userId: string}}) => { 
    const {userId} = params;
    const user = await getUser(userId);
    //console.log(user)
  return (
     <div className="flex h-screen max-h-screen"> 
        <section className="remove-scrollbar container">
            <div className="sub-container max-w-[860px] flex-1 flex-col py-10">
                <Image src="/assets/icons/logo-full.svg"
                        width={1000}
                        height={1000}
                        alt="patient"
                        className="mb-12 h-10 w-fit" />
                <RegisterForm user={user} /> 
                <p className="copyright text-dark-600 py-12">
                    © 2024 CarePulse
                </p> 
                   {/*  <Link href="?admin=true" className="text-green-500">
                        Admin
                    </Link> */}
            </div>
        </section>
        <Image src="/assets/images/register-img.png"
            width={1000}
            height={1000}
            alt="register image"
            className="side-img max-w-[390px]" /> 
    </div> 
  )
}

export default Register;