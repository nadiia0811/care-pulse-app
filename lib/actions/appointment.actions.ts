"use server";

import { ID, Query } from "node-appwrite";
import { APPOINTMENT_COLLECTION_ID, DATABASE_ID, databases } from "../appwrite.config";
import { parseStringify } from "../utils";
import { Appointment } from "@/types/appwrite.types";



export const createAppointment = async (appointmentValues: CreateAppointmentParams) => {
console.log(APPOINTMENT_COLLECTION_ID, DATABASE_ID, databases )
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
        console.log("Failed to fetch appointments list");
    }
};