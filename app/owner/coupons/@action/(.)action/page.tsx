"use client";

import DialogAction from "@/components/ui/dialog-action";
import CouponsActionForm from "@/module/coupons/components/coupons-action-from";
import { use2IdStore, useDialogActionStore, useFormDataStore, useFormTypeStore } from "@/store";
import { useEffect } from "react";

export default function CouponsAction() {

  const type = useFormTypeStore((state) => state.type)
  const setOpen = useDialogActionStore((state) => state.setOpen)
  const couponId = use2IdStore((state) => state.id)
  const defaultData = useFormDataStore((state) => state.data)

  useEffect(() => {
    setOpen(true)
  }, [setOpen])

  return (
    <div className='shadow-inner shadow-emerald-700/50 '>
      <DialogAction
      redirecting={true}
      title={type === "create" && "Create Coupon" || type === "edit" && "Update Coupon" || ""}
      description={type === "create" && "Manage coupon information." || type === "edit" && "Update coupon information." || ""}
      redirectingPath={`/owner/coupons`}>
        <CouponsActionForm formType={type} setOpen={setOpen} couponsId={couponId} defaultData={defaultData} />
      </DialogAction>
    </div>
  )
}
