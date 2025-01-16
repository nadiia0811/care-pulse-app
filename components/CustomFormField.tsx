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
import { Textarea } from "@/components/ui/textarea"
import Image from "next/image";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { E164Number } from "libphonenumber-js/core";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Select, SelectContent, SelectValue, SelectTrigger } from "./ui/select";




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
  const { iconSrc, 
          fieldType, 
          iconAlt, 
          placeholder, 
          showTimeSelect, 
          dateFormat,
          renderSkeleton } = props;
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
        </FormControl> )
    
    case FormFieldType.DATE_PICKER:
      return (
        <div className="flex rounded-md border border-dark-500 bg-dark-400">
           <Image src="/assets/icons/calendar.svg"
                  width={24}
                  height={24}
                  alt="calendar"
                  className="ml-2"/>
           <FormControl>
              <DatePicker selected={field.value} 
                          onChange={(date) => field.onChange(date)} 
                          dateFormat={dateFormat ?? "MM/dd/yyyy"}
                          showTimeSelect={showTimeSelect ?? false}
                          timeInputLabel="Time:"
                          wrapperClassName="date-picker"
                          />
           </FormControl>       
        </div>
      )

    case FormFieldType.SKELETON:
      return (
           renderSkeleton ? renderSkeleton(field) : null 
      )

    case FormFieldType.SELECT:
      return (
        <FormControl>
           <Select onValueChange={field.onChange}
                   defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="shad-select-trigger">
                   <SelectValue placeholder={placeholder}/>
                </SelectTrigger>                 
              </FormControl> 
              <SelectContent className="shad-select-content">
                 {props.children}
              </SelectContent>     
           </Select>
        </FormControl>
      )

    case FormFieldType.TEXTAREA:
      return (
         <FormControl>
            <Textarea placeholder={placeholder}
                      {...field} 
                      className="shad-textArea" 
                      disabled={props.disabled}/>           
         </FormControl>
         
      )  
     /* default: 
        break; */    
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