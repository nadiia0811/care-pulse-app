import Link from 'next/link';
import React from 'react';
import Image from 'next/image';


// extracting variable value from parameters
const SuccessPage = ({params: {userId}, searchParams}: SearchParamProps) => {
    const appointmentId = searchParams?.appointmentId as string | "";
    console.log(appointmentId) 
  return (
    <div className="flex h-screen max-h-screen px-[5%]">
        <div className="success-img">
            <Link href="/">
               <Image src="/assets/icons/logo-full.svg"
                      width={1000}
                      height={1000}
                      alt="logo"
                      className="h-10 w-fit"/>
            </Link>

            <section className="flex flex-col items-center">
                <Image src="/assets/gifs/success.gif" 
                       width={280}
                       height={300}
                       alt="success"/>

                <h2 className="header mb-6 max-w-[600px] text-center">
                    Your <span className="text-green-500 mr-[5px]">appointment request</span>
                    has been successfully submitted!
                </h2> 
                <p>We will be in touch shortly to confirm</p>      
            </section>

            <section className="request-details">
                <p>Requested appointment details:</p>
                <div className="flex items-center gap-3">
                    {/* <Image src=""/> */}
                </div>
            </section>          
        </div>
    </div>
  )
}

export default SuccessPage;
