"use client";

import React, { useState, useEffect } from 'react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
  } from "@/components/ui/alert-dialog";
import Image from 'next/image';
import { useRouter, usePathname, useParams } from "next/navigation";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { encryptKey, decryptKey } from '@/lib/utils';

 
  


//OTP verification 
const PasskeyModal = () => {
    const [open, setOpen] = useState(true);
    const router = useRouter();
    const path = usePathname();  //path = full url with query params
    const [passkey, setPasskey] = useState("");  
    const [error, setError] = useState("");
    const {pathname} = useParams();   // url without query params

    const encryptedKey = typeof window !== "undefined" ?
       window.localStorage.getItem("accessKey") : null;

    useEffect(() => {
      const accessKey = encryptedKey && decryptKey(encryptedKey);
      
      if (path) {
        if (accessKey === process.env.NEXT_PUBLIC_ADMIN_PASSKEY) {
          setOpen(false);
          if (pathname !== "/admin") {
            router.push("/admin");
          }
                 
          } else {
            setOpen(true);           
        }
      }
    }, [encryptedKey, path, router, pathname]);   

    const validatePasskey = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.preventDefault();

      if (passkey === process.env.NEXT_PUBLIC_ADMIN_PASSKEY) {
        const encryptedKey = encryptKey(passkey);
        localStorage.setItem("accessKey", encryptedKey);
        setOpen(false);
         } else {
           setError("Invalid passkey. Please try again");
      }
    };

    const closeModal = () => {
        setOpen(false);
        router.push("/");
    };
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
       <AlertDialogContent className="shad-alert-dialog">
           <AlertDialogHeader>
                <AlertDialogTitle className="flex items-start justify-between">
                    Admin Access Verification
                    <Image src="/assets/icons/close.svg"
                           width={20}
                           height={20}
                           alt="close"
                           onClick={() => closeModal()}
                           className="cursor-pointer" />
                </AlertDialogTitle>
                <AlertDialogDescription>
                   To access the admin page, please enter the passkey
                </AlertDialogDescription>
            </AlertDialogHeader>
            <div>
                <InputOTP maxLength={6} value={passkey} onChange={(value) => setPasskey(value)}>
                    <InputOTPGroup className="shad-otp">
                      <InputOTPSlot className="shad-otp-slot" index={0} />
                      <InputOTPSlot className="shad-otp-slot" index={1} />
                      <InputOTPSlot className="shad-otp-slot" index={2} />
                      <InputOTPSlot className="shad-otp-slot" index={3} />
                      <InputOTPSlot className="shad-otp-slot" index={4} />
                      <InputOTPSlot className="shad-otp-slot" index={5} />
                    </InputOTPGroup>
                </InputOTP>
                { error && <p className="shad-error text-14-regular mt-4
                  flex justify-center">{error}</p> }
            </div>
            <AlertDialogFooter>
                <AlertDialogAction onClick={(e) => validatePasskey(e)}
                                   className="shad-primary-btn w-full">
                  Enter Admin Passkey
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
  )
};

export default PasskeyModal;