"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import CustomFormField from "../CustomFormField";
import SubmitButton from "../SubmitButton";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Doctors } from "@/constants";
import { SelectItem } from '../ui/select';
import { FormFieldType } from "./PatientForm";
import Image from 'next/image';
import { createAppointment, updateAppointment } from "@/lib/actions/appointment.actions";
import { getAppointmentSchema } from "@/lib/validation";
import { Appointment } from "@/types/appwrite.types";




type PatientData = {
    type: "create" | "cancel" | "schedule";
    patientId: string;
    userId: string;
    appointment?: Appointment;
    setOpen?: (open:boolean) => void
}

const AppointmentForm = ({type, patientId, userId, appointment, setOpen}: PatientData) => {

  const AppointmentFormValidation = getAppointmentSchema(type);  
  type AppointmentFormData = z.infer<typeof AppointmentFormValidation>;  
  
  const [isLoading, setIsLoading] = useState(false);
  let buttonLabel;

  switch (type) {
    case "cancel": 
      buttonLabel = "Cancel Appointment";
      break;
    case "create":
      buttonLabel = "Create Appointment";
      break; 
    case "schedule":
      buttonLabel = "Schedule Appointment";  
      break;   
  }

  const router = useRouter();
  
  const form = useForm<AppointmentFormData>({  
    resolver: zodResolver(AppointmentFormValidation),
    defaultValues: {
      primaryPhysician: appointment ? appointment.primaryPhysician : "",
      schedule: appointment? new Date(appointment.schedule) : new Date(Date.now()),
      reason: appointment ? appointment.reason : "",
      note: appointment ? appointment.note : "",
      cancellationReason: appointment?.cancellationReason || ""
    },
  });


  
   const onSubmit = async (values: AppointmentFormData) => { 
    
    let status;

    switch (type) {
      case "cancel":
        status = "cancelled";
        break;
      case "schedule":
        status = "scheduled";
        break; 
      default:
        status = "pending";
        break;   
    }
    setIsLoading(true); 
    
    try {
        if (type === "create" && patientId) {
            const appointmentData = {
                userId,
                patient: patientId,
                primaryPhysician: values.primaryPhysician,
                schedule:  new Date(values.schedule),
                reason: values.reason!,
                note: values.note,
                status: status as Status,
            };
            const appointment = await createAppointment(appointmentData);
            if (appointment) {
              form.reset();
              router.push(`/patients/${userId}/new-appointment/success?appointmentId=${appointment.$id}`);
            }
        } else { 
            const appointmentToUpdate = {
              userId,
              appointmentId: appointment?.$id,
              appointment: {
                primaryPhysician: values?.primaryPhysician,
                schedule: new Date(values?.schedule),
                status: status as Status,   
                cancellationReason: values?.cancellationReason
              },
              type
            };


            const updatedAppointment = await updateAppointment(appointmentToUpdate);
            if (updatedAppointment) {
              if (setOpen) {
                setOpen(false);
              }           
              form.reset();
            }
        }
       
    } catch (error) {
        console.log("Error: ", error)
    }
   };

  return (
    <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} 
              className="space-y-6 flex-1">
            { type === "create" && 
                <section className="mb-12 space-y-4">
                  <h1 className="header">New Appointment</h1>
                  <p className="text-dark-700">Request a new appointment in 10 seconds</p>
                </section> 
            }

            { type !== "cancel" && (
                <>
                   <CustomFormField control={form.control}
                                    fieldType={FormFieldType.SELECT}
                                    name="primaryPhysician"
                                    label="Doctor" 
                                    placeholder="Select a doctor">
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

                   <CustomFormField control={form.control}
                                    fieldType={FormFieldType.DATE_PICKER}
                                    name="schedule"
                                    label="Expected appointment date"
                                    showTimeSelect
                                    dateFormat="MM/dd/yyyy - h:mm aa"/>
                   <div className="flex flex-col gap-6 xl:flex-row">
                      <CustomFormField control={form.control}
                                       fieldType={FormFieldType.TEXTAREA}
                                       name="reason"
                                       label="Reason"
                                       placeholder="Enter a reason for appointment" 
                      />

                      <CustomFormField control={form.control}
                                       fieldType={FormFieldType.TEXTAREA}
                                       name="note"
                                       label="Notes"
                                       placeholder="Enter notes" 
                      />  
                   </div>                 
                </>
            )}

            { type == "cancel" && (
                <CustomFormField control={form.control}
                                 fieldType={FormFieldType.TEXTAREA}
                                 name="cancellationReason"
                                 label="Reason for Cancellation"
                                 placeholder="Enter reason for cancellation" 
                /> 
            )}     

           
            <SubmitButton isLoading={isLoading}
                          className={`${type === "cancel" ? "shad-danger-btn" : "shad-primary-btn"} w-full`}>
                {buttonLabel}
            </SubmitButton>
        </form>
    </Form>
  )
}

export default AppointmentForm;
