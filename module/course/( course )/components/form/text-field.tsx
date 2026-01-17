import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { UseFormReturn, FieldValues, Path } from "react-hook-form";

interface TextFieldProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  name: Path<T>;                 // ✅ strongly typed field path
  label: string;
  placeholder?: string;
  value?: string | number;
  required?: boolean;
  type?: string;
  textarea?: boolean;
  maxLength?: number;
  icon?: LucideIcon;
  inputClass?: string;
  descriptionText?: string;
  keywordsHandler?: boolean;
}

export function TextField<T extends FieldValues>({
  form,
  name,
  label,
  placeholder,
  value,
  required = false,
  type = "text",
  textarea = false,
  maxLength,
  icon: Icon,
  inputClass,
  descriptionText,
  keywordsHandler = false,
}: TextFieldProps<T>) {
  const isNumberInput = type === "number";

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        const keywordProps = keywordsHandler
          ? {
              value: Array.isArray(field.value)
                ? field.value.join(", ")
                : field.value || "",
              onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                field.onChange(
                  e.target.value
                    .split(",")
                    .map((k) => k.trim())
                    .filter(Boolean)
                ),
            }
          : {};

        const numberProps = isNumberInput
          ? {
              value: field.value ?? "",
              onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                const val = e.target.value;
                field.onChange(val === "" ? undefined : Number(val));
              },
            }
          : {};

        const inputProps = keywordsHandler
          ? keywordProps
          : isNumberInput
          ? numberProps
          : field;

        return (
          <FormItem>
            <FormLabel className="text-emerald-100 text-sm">
              {label}
              {required && <span className="text-red-400 ml-1">*</span>}
            </FormLabel>

            <FormControl>
              <div className="relative">
                {Icon && (
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-300/60">
                    <Icon className="w-4 h-4" />
                  </span>
                )}

                {textarea ? (
                  <Textarea
                    {...field}
                    maxLength={maxLength}
                    placeholder={placeholder}
                    className="min-h-32 bg-emerald-950/30 border-emerald-600/30 text-emerald-50 placeholder:text-emerald-50/40 resize-none"
                  />
                ) : (
                  <Input
                    {...inputProps}
                    type={type}
                    maxLength={maxLength}
                    placeholder={placeholder}
                    value={value}
                    className={cn(
                      "bg-emerald-950/30 border-emerald-600/30 text-emerald-50 placeholder:text-emerald-50/40",
                      Icon && "pl-9",
                      inputClass
                    )}
                  />
                )}
              </div>
            </FormControl>

            {descriptionText && (
              <FormDescription className="text-xs text-emerald-300/50">
                {descriptionText}
              </FormDescription>
            )}

            {maxLength && typeof field.value === "string" && !keywordsHandler && (
              <FormDescription className="text-xs text-emerald-300/50">
                {field.value.length}/{maxLength} characters
              </FormDescription>
            )}

            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
