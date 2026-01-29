import { useForm } from "react-hook-form";
import { CreateCouponInput } from "../schemas";
import { useEffect } from "react";
import { toast } from "sonner";
import { Form } from "@/components/ui/form";
import { TextField } from "@/module/course/( course )/components/form/text-field";
import ButtonPrimary from "@/components/ui/button-primary";
import { useCreateCoupon, useUpdateCoupon } from "../hooks/useCoupons";
import { coupon } from "@prisma/client";

interface CouponsActionFormProps {
    couponsId?: string;
    defaultData?: coupon;
    formType: "create" | "edit";
    setOpen: (value: boolean) => void;
}


export default function CouponsActionForm({ couponsId, defaultData, formType, setOpen }: CouponsActionFormProps) {

  const form = useForm<CreateCouponInput>({
    defaultValues: {
      code: "",
      discountValue: 200,
      minOrderAmount: 1000,
      usageLimit: 1,
      perUserLimit: 1,
      startsAt: new Date() || "",
      expiresAt: new Date() || "",
      isActive: true
    }
  })

  const createCouponMutate = useCreateCoupon()
  const updateCouponMutate = useUpdateCoupon(couponsId || "")

  const { mutate, isPending } = formType === "create" ? createCouponMutate : updateCouponMutate



useEffect(() => {
  if (formType === "edit" && defaultData) {
    form.reset({
      code: defaultData.code,
      discountValue: defaultData.discountValue,
      minOrderAmount: defaultData.minOrderAmount,
      usageLimit: defaultData.usageLimit,
      perUserLimit: defaultData.perUserLimit,
      startsAt: defaultData.startsAt,
      expiresAt: defaultData.expiresAt,
      isActive: defaultData.isActive,
    });
  }
}, [formType, defaultData, form]);


const onSubmit = (data: CreateCouponInput) => {
  try {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (value === undefined || value === null || value === "") return;

      // 🔥 SAFE conversion
      formData.append(key, String(value));
    });

    mutate(formData, {
      onSuccess: () => {
        form.reset();
        setOpen(false);
      },
    });

  } catch (error) {
    toast.error(
      error instanceof Error ? error.message : "Something went wrong"
    );
  }
};



  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-6 font-[Helvetica] tracking-wide">
        <TextField
        form={form}
        name="code"
        label="Coupon Code"
        required
        placeholder="Enter coupon code"
        />

        <div className="w-full grid grid-cols-2 gap-4">
          <TextField
          form={form}
          name="discountValue"
          label="Discount Value"
          required
          type="number"
          placeholder="Enter discount value"
          />

          <TextField
          form={form}
          name="minOrderAmount"
          label="Minimum Order Amount"
          required
          type="number"
          placeholder="Enter minimum order amount"
          />

          <TextField
          form={form}
          name="usageLimit"
          label="Usage Limit"
          required
          type="number"
          placeholder="Enter usage limit"
          />


          <TextField
          form={form}
          name="perUserLimit"
          label="Per User Limit"
          required
          type="number"
          placeholder="Enter per user limit"
          />

          <TextField
          form={form}
          name="startsAt"
          label="Start Date"
          required
          type="date"
          />

          <TextField
          form={form}
          name="expiresAt"
          label="Expiry Date"
          required
          type="date"
          />
        </div>

                {/* Active Toggle */}
        <div className="pt-4 border-t border-emerald-700/50">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              {...form.register("isActive")}
              className="w-5 h-5 rounded accent-emerald-500"
            />
            <span className="text-emerald-200 font-medium">Coupon is Active</span>
          </label>
        </div>

        <div className="flex gap-3">
          <ButtonPrimary
          onClick={()=> setOpen(false)}
          size={"sm"}
          variant={"destructive"}
          type="button">
            Cancle
          </ButtonPrimary>

          <ButtonPrimary size={"sm"} variant={"secondary"} type="submit">
            {formType === "create" && (
              isPending ? "Creating Coupon..." : "Create Coupon"
            )}
            {formType === "edit" && (
              isPending ? "Updating Coupon..." : "Update Coupon"
            )}
          </ButtonPrimary>
        </div>
      </form>
    </Form>
  )
}
