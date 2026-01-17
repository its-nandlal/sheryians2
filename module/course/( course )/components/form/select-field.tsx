
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { FieldValues, Path, UseFormReturn } from "react-hook-form"

export function SelectField<T extends FieldValues>({
  form,
  name,
  label,
  options,
  required = false,
}: {
  form: UseFormReturn<T>;
  name: Path<T>; 
  label: string
  required?: boolean
  options: { label: string; value: string }[]
}) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-emerald-200 text-sm">
            {label} {required && <span className="text-red-400">*</span>}
          </FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value as string}>
            <FormControl>
              <SelectTrigger className="bg-emerald-950/30 border-emerald-600/30 text-emerald-50">
                <SelectValue placeholder={`Select ${label}`} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
