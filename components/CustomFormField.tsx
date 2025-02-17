"use client"

import { Control, ControllerRenderProps, FieldValues, Path } from "react-hook-form";
import { FormControl,  
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
import { Checkbox } from "./ui/checkbox";




interface CustomProps <T extends FieldValues> {
  control: Control<T>,
  fieldType: FormFieldType,
  name: Path<T>,
  label?: string,
  placeholder?: string,
  iconSrc?: string,
  iconAlt?: string,
  disabled?: boolean,
  dateFormat?: string,
  showTimeSelect?: boolean,
  children?: React.ReactNode,
  renderSkeleton?: (field: ControllerRenderProps<T>) => React.ReactNode,
}

const RenderField = <T extends FieldValues>({ field, props }: 
  { field: ControllerRenderProps<T>, props: CustomProps<T>}) => {
  const { iconSrc, 
          fieldType, 
          iconAlt, 
          placeholder, 
          showTimeSelect, 
          dateFormat,
          renderSkeleton,
          label } = props;
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
      
    case FormFieldType.CHECKBOX:
      return (
        <FormControl>
           <div className="flex items-center gap-4">
              <Checkbox id={props.name}
                        checked={field.value} 
                        onCheckedChange={field.onChange} />
              <label htmlFor={props.name}
                     className="checkbox-label">
                { label }
              </label>          
           </div>
        </FormControl>
      )  
       
  }

}

const CustomFormField = <T extends FieldValues>(props: CustomProps<T>) => {
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