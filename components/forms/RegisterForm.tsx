"use client";

import React from 'react'
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl } from "@/components/ui/form";
import CustomFormField from "../CustomFormField";
import SubmitButton from "../SubmitButton";
import { useState } from "react";
import { PatientFormValidation } from "@/lib/validation";
import { useRouter } from "next/navigation";
import { registerPatient } from "@/lib/actions/patient.actions";
import { FormFieldType } from './PatientForm';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { GenderOptions, IdentificationTypes, PatientFormDefaultValues } from '@/constants';
import { Label } from '../ui/label';
import { Doctors } from '@/constants';
import { SelectItem } from '../ui/select';
import FileUploader from "@/components/FileUploader";
import Image from 'next/image';



type PatientFormData = z.infer<typeof PatientFormValidation>; 

const RegisterForm = ({user}: {user: User}) => {

  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  
  const form = useForm<PatientFormData>({
    resolver: zodResolver(PatientFormValidation),
    defaultValues: {
      ...PatientFormDefaultValues,
      name: "",
      email: "",
      phone: ""
    },
  });

  
   const onSubmit = async (values: PatientFormData) => {  // values = {...PatientFormData}
  
   setIsLoading(true);
   let formData;

   if (values.identificationDocument && 
       values.identificationDocument.length > 0) {
        // extract file
        const blobFile = new Blob( [values.identificationDocument[0]], {
           type: values.identificationDocument[0].type
        });

        formData = new FormData();
        formData.append("blobFile", blobFile);
        formData.append("fileName", values.identificationDocument[0].name);
     }

    try {
      const patientData = {  //create patient data object
        ...values,
        userId: user.$id,
        birthDate: new Date(values.birthDate),
        identificationDocument: formData,
      }

     //@ts-expect-error: The return type of registerPatient is not properly 
     // typed, hence we are ignoring the type error
      const patient = await registerPatient(patientData);

      if (patient) {
        router.push(`/patients/${user.$id}/new-appointment`);
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
                <CustomFormField control={form.control}
                                 fieldType={FormFieldType.INPUT}
                                 name="address"
                                 label="Address"
                                 placeholder="14th Street, New York" /> 

                <CustomFormField control={form.control}
                                 fieldType={FormFieldType.INPUT}
                                 name="occupation"
                                 label="Occupation"
                                 placeholder="Software Engineer" />                
            </div>

            <div className="flex flex-col gap-6 xl:flex-row">
                <CustomFormField control={form.control}
                                 fieldType={FormFieldType.INPUT}
                                 name="emergencyContactName"
                                 label="Emergency Contact Name"
                                 placeholder="Guardian's name" /> 

                <CustomFormField control={form.control}
                                 fieldType={FormFieldType.PHONE_INPUT}
                                 name="emergencyContactNumber"
                                 label="Emergency Contact Number"
                                 placeholder="(555) 123-1234" />
            </div>

            <section className="space-y-6">
                <div className="mb-9 space-y-1">
                  <h2 className="sub-header">Medical Information</h2>
                </div>               
            </section> 

            <CustomFormField control={form.control}
                             fieldType={FormFieldType.SELECT}
                             name="primaryPhysician"
                             label="Primary Physician" 
                             placeholder="Select a physician">
              { Doctors.map((doctor) => (
                <SelectItem key={doctor.name} value={doctor.name}>
                   <div className="flex cursor-poiner items-center gap-2">
                      <Image src={doctor.image}
                             width={32}
                             height={32} 
                             alt={doctor.name}
                             className="rounded-full border border-dark-500"/>
                      <p>{doctor.name}</p>       
                   </div>
                </SelectItem>
              )) }             
            </CustomFormField>

            <div className="flex flex-col gap-6 xl:flex-row">
                <CustomFormField control={form.control}
                                    fieldType={FormFieldType.INPUT}
                                    name="insuranceProvider"
                                    label="Insurance Provider"
                                    placeholder="BlueCross BlueShield" /> 

                    <CustomFormField control={form.control}
                                    fieldType={FormFieldType.INPUT}
                                    name="insurancePolicyNumber"
                                    label="Insurance Policy Number"
                                    placeholder="ABC123456789" /> 
            </div>

            <div className="flex flex-col gap-6 xl:flex-row">
                <CustomFormField control={form.control}
                                 fieldType={FormFieldType.TEXTAREA}
                                 name="allergies"
                                 label="Allergies (if any)"
                                 placeholder="Peanuts, Penicillin, Pollen" /> 

                <CustomFormField control={form.control}
                                 fieldType={FormFieldType.TEXTAREA}
                                 name="currentMedication"
                                 label="Current Medication (if any)"
                                 placeholder="Ibuprofen 200mg, Paracetamol 500mg" /> 
            </div>

            <div className="flex flex-col gap-6 xl:flex-row">
                <CustomFormField control={form.control}
                                 fieldType={FormFieldType.TEXTAREA}
                                 name="familyMedicalHistory"
                                 label="Family Medical History"
                                 placeholder="Father had heart desease" /> 

                <CustomFormField control={form.control}
                                 fieldType={FormFieldType.TEXTAREA}
                                 name="pastMedicalHistory"
                                 label="Past Medical History"
                                 placeholder="Appendectomy, Tonsillectomy" /> 
            </div>

            <section className="space-y-6">
                <div className="mb-9 space-y-1">
                  <h2 className="sub-header">Identification and Verification</h2>
                </div>               
            </section>

            <CustomFormField control={form.control}
                             fieldType={FormFieldType.SELECT}
                             name="identificationType"
                             label="Identification Type"
                             placeholder="Select an identification type">
                { IdentificationTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              )) }              
            </CustomFormField>

            <CustomFormField control={form.control}
                             fieldType={FormFieldType.INPUT}
                             name="identificationNumber"
                             label="Identification Number"
                             placeholder="123456789" /> 

            <CustomFormField control={form.control}
                             fieldType={FormFieldType.SKELETON} 
                             name="identificationDocument"
                             label="Scanned copy of Identification Document"
                             renderSkeleton={(field) => (
                                <FormControl>
                                   <FileUploader onChange={field.onChange}
                                                 files={field.value}/>
                                </FormControl>
                             )}/>                        

            <section className="space-y-6">
                <div className="mb-9 space-y-1">
                  <h2 className="sub-header">Consent and Privacy</h2>
                </div>               
            </section>

            <CustomFormField control={form.control}
                             fieldType={FormFieldType.CHECKBOX}
                             name="treatmentConsent"
                             label="I consent to treatment"
            />

            <CustomFormField control={form.control}
                             fieldType={FormFieldType.CHECKBOX}
                             name="disclosureConsent"
                             label="I consent to disclosure of information"
            />

            <CustomFormField control={form.control}
                             fieldType={FormFieldType.CHECKBOX}
                             name="privacyConsent"
                             label="I consent to privacy policy"
            />
            <SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
        </form>
    </Form>
  )
}




export default RegisterForm;