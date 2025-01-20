import PatientForm from "@/components/forms/PatientForm";
import PasskeyModal from "@/components/PasskeyModal";
import Image from "next/image";
import Link from "next/link";

export default function Home({searchParams} : SearchParamProps) {
  const isAdmin = searchParams.admin === "true";
 
  return (
        <div className="flex flex-col h-screen max-h-screen md:flex-row">

            { isAdmin && <PasskeyModal />}
            
            <section className="remove-scrollbar my-auto container">
                <div className="sub-container max-w-[496px]">
                    <Image src="/assets/icons/logo-full.svg"
                            width={1000}
                            height={1000}
                            alt="patient"
                            className="mb-12 h-10 w-fit" />
                    <PatientForm />

                    <div className="text-14-regular mt-20 flex justify-between">
                        <p className="justify-items-end text-dark-600 xl:text-left">
                            © 2025 CarePulse
                        </p> 
                        <Link href="?admin=true" className="text-green-500">
                            Admin
                        </Link>
                    </div>
                </div>
            </section>
            <Image src="/assets/images/onboarding-img.png"
                  width={1000}
                  height={1000}
                  alt="patient"
                  className="md:side-img md:max-w-[50%]" />
        </div>
  );
}
