import clsx from 'clsx';
import React from 'react';
import Image from 'next/image';
import { getRecentAppointmentList } from '@/lib/actions/appointment.actions';

interface StatCardProps {
    count: number;
    label: string;
    type: "appointments" | "pending" | "cancelled";
    icon: string;
}

const StatCard = async ({ count = 0, label, type, icon}: StatCardProps) => {
  
  return (
    <div className={clsx("stat-card", {
        "bg-appointments": type === "appointments",
        "bg-pending": type === "pending",
        "bg-cancelled": type === "cancelled",
    })}>
       <div className="flex gap-4 items-center">
            <Image src={icon}
                   alt={label}
                   width={32}
                   height={32}
                   className="size-9 w-fit"/>
            <h2 className="text-32-bold text-white">{count}</h2>      
       </div>
       <p className="text-14-regular">{label}</p>
    </div>
  )
}

export default StatCard;