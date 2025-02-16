"use server";

import { ID, Query } from "node-appwrite";
import { APPOINTMENT_COLLECTION_ID, DATABASE_ID, databases } from "../appwrite.config";
import { formatDateTime, parseStringify } from "../utils";
import { Appointment } from "@/types/appwrite.types";
import { revalidatePath } from "next/cache";
import { messaging } from "../appwrite.config";



export const createAppointment = async (appointmentValues: CreateAppointmentParams) => {

    try {
        const newAppointment = await databases.createDocument(
            DATABASE_ID!,
            APPOINTMENT_COLLECTION_ID!,
            ID.unique(),
            appointmentValues,
        );
        return parseStringify(newAppointment);
    } catch (error) {
        console.log(error);
    } 
};


export const getAppointment = async (appointmentId: string) => {
    try {
        const appointment = await databases.getDocument(
          DATABASE_ID!,
          APPOINTMENT_COLLECTION_ID!,
          appointmentId,
        );
      return parseStringify(appointment);
    } catch (error) {
        console.log("Failed to fetch appointment: ", error);
    }
};


export const getRecentAppointmentList = async () => {
    try {
      const appointments = await databases.listDocuments(
        DATABASE_ID!,
        APPOINTMENT_COLLECTION_ID!,
        [
            Query.orderDesc("$createdAt")
        ]
      );
      
      const initialCounts = {
        scheduledCount: 0,
        cancelledCount: 0,
        pendingCount: 0
      };
      const counts = (appointments.documents as Appointment[])
                       .reduce((acc, appointment) => {
        if (appointment.status === "pending") {
            acc.pendingCount++;
        }
        if (appointment.status === "scheduled") {
            acc.scheduledCount++;
        }
        if (appointment.status === "cancelled") {
            acc.cancelledCount++;
        }
        return acc;
      }, initialCounts);

      const data = {
        totalCount: appointments.total,
        ...counts,
        documents: appointments.documents
      };

      return parseStringify(data);
    
    } catch (error) {
        console.log("Failed to fetch appointments list: ", error);
    }
};

export const updateAppointment = async ({ appointmentId, userId, appointment, type}: UpdateAppointmentParams) => {

   try {
     const updatedAppointment = await databases.updateDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      appointmentId!,
      appointment   
     );

     if (!updatedAppointment) {
       throw new Error("Appointment not found");
     }

     //SMS notification
     const smsMessage = `
       Hi, it's Care-Pulse.
       ${type === 'schedule' ? 
        `Your appointment has been scheduled for 
         ${formatDateTime(appointment.schedule!).dateTime} with Dr.${appointment.primaryPhysician}`
         : `We regret to inform you that your appointment has been cancelled
            for the following reason: ${appointment.cancellationReason}`
      }`;
     await sendSMSNotification(userId, smsMessage);

     revalidatePath("/admin");   //displays new data about appointment on admin dashboard
     return parseStringify(updatedAppointment);
   } catch (error) {
      console.log("Failed to update appointment: ", error);
   }
};

export const sendSMSNotification = async (userId: string, content: string) => {
  try {
    await messaging.createSms(
      ID.unique(),
      content,
      [],
      [userId],   
    )
  } catch (error) {
    console.log(error);
  }
}