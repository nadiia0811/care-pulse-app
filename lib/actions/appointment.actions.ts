"use server";

import { ID } from "node-appwrite";
import { APPOINTMENT_COLLECTION_ID, DATABASE_ID, databases } from "../appwrite.config";
import { parseStringify } from "../utils";


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
  
}