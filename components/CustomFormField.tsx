"use client"

import { Control } from "react-hook-form";
import { FormControl, 
         FormDescription, 
         FormField, 
         FormItem, 
         FormLabel, 
         FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { FormFieldType } from "./forms/PatientForm";
import Image from "next/image";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { E164Number } from "libphonenumber-js/core";




interface CustomProps {
  control: Control<any>,
  fieldType: FormFieldType,
  name: string,
  label?: string,
  placeholder?: string,
  iconSrc?: string,
  iconAlt?: string,
  disabled?: boolean,
  dateFormat?: string,
  showTimeSelect?: boolean,
  children?: React.ReactNode,
  renderSkeleton?: (field: any) => React.ReactNode,
}

const RenderField = ({ field, props}: { field: any, props: CustomProps}) => {
  const { iconSrc, fieldType, iconAlt, placeholder } = props;
  switch( fieldType ) {
    case FormFieldType.INPUT: 
      return <div className="flex rounded-md border-dark-200 bg-dark-400">
               { iconSrc && (
                <Image src={iconSrc}
                       width={24}
                       height={24}
                       alt={iconAlt || "icon"} 
                       className="ml-2"/>
               )}
                <FormControl>
                   <Input placeholder={placeholder}
                          {...field} 
                          className="border-0  shad-input"/> 
                          
                </FormControl> 
             </div>
    
    case FormFieldType.PHONE_INPUT:
      return (
        <FormControl>
          <PhoneInput defaultCountry="US"
                      placeholder={placeholder}
                      international
                      withCountryCallingCode
                      value={field.value as E164Number | undefined} 
                      onChange={field.onChange} 
                      className="input-phone" />

        </FormControl>
      )
    
  }

}

const CustomFormField = (props: CustomProps) => {
 const { control, 
         fieldType,
         name,
         label } = props;
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
             <FormItem className="flex-1">
               { fieldType !== FormFieldType.CHECKBOX && label && (
                <FormLabel>{label}</FormLabel>
               )}

               <RenderField field={field}
                            props={props}/>

               <FormMessage className="shad-error"/>             
             </FormItem>
            )}
          />
    )
};

export default CustomFormField;