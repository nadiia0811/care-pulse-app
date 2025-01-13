"use client";

import React from 'react'
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl } from "@/components/ui/form";
import CustomFormField from "../CustomFormField";
import SubmitButton from "../SubmitButton";
import { useState } from "react";
import { UserFormValidation } from "@/lib/validation";
import { useRouter } from "next/navigation";
import { createUser } from "@/lib/actions/patient.actions";
import { FormFieldType } from './PatientForm';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { GenderOptions } from '@/constants';
import { Label } from '../ui/label';



type UserFormData = z.infer<typeof UserFormValidation>; 
const RegisterForm = ({user}: {user: User}) => {

  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  
  const form = useForm<UserFormData>({
    resolver: zodResolver(UserFormValidation),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

   const onSubmit = async ({name, email, phone}: UserFormData) => {  
   setIsLoading(true);

    try {
      const userData = { name, email, phone };  
      const user = await createUser(userData);
      console.log("new user: ",user);

      if ( user ) {  
        router.push(`/patients/${user.$id}/register`);
      } 
    } catch (error) {
      console.log(error);
    }
  }; 


  return (
    <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} 
              className="space-y-12 flex-1">
            <section className="space-y-4">
               <h1 className="header">Welcome 👋</h1>
               <p className="text-dark-700">Let us know more about yourself</p>
            </section>

            <section className="space-y-6">
               <div className="mb-9 space-y-1">
                  <h2 className="sub-header">Personal Information</h2>
               </div>               
            </section>       

            <CustomFormField control={form.control}
                             fieldType={FormFieldType.INPUT}
                             name="name"
                             label="Full Name"
                             placeholder="Jane Doe"
                             iconSrc="/assets/icons/user.svg"
                             iconAlt="user" /> 
            
            <div className="flex flex-col gap-6 xl:flex-row">
                <CustomFormField control={form.control}
                                 fieldType={FormFieldType.INPUT}
                                 name="email"
                                 label="Email"
                                 placeholder="example@gmail.com"
                                 iconSrc="/assets/icons/email.svg"
                                 iconAlt="email" /> 

                <CustomFormField control={form.control}
                                 fieldType={FormFieldType.PHONE_INPUT}
                                 name="phone"
                                 label="Phone Number"
                                 placeholder="(555) 123-1234" />
            </div>
            
            <div className="flex flex-col gap-6 xl:flex-row">
                <CustomFormField control={form.control}
                                 fieldType={FormFieldType.DATE_PICKER}
                                 name="birthDate"
                                 label="Date of Birth" /> 

                <CustomFormField control={form.control}
                                 fieldType={FormFieldType.SKELETON}
                                 name="gender"
                                 label="Gender"
                                 renderSkeleton={(field) =>(
                                    <FormControl>
                                        <RadioGroup className="flex h-11 gap-6 xl:justify-between"
                                                    onValueChange={field.onChange}
                                                    defaultValue={field.value}>
                                            { GenderOptions.map((option) => (
                                              <div key={option} className="radio-group">
                                                  <RadioGroupItem value={option}
                                                                  id={option} />
                                                      <Label htmlFor={option}
                                                             className="cursor-pointer">{option}
                                                      </Label>
                                              </div>
                                            )) }
                                        </RadioGroup>
                                    </FormControl>
                                )} />
            </div>

            <div className="flex flex-col gap-6 xl:flex-row">
               
            </div>

            <div className="flex flex-col gap-6 xl:flex-row">
               
            </div>

            <div className="flex flex-col gap-6 xl:flex-row">
               
            </div>

            <SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
        </form>
    </Form>
  )
}




export default RegisterForm;