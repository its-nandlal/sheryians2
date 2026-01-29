"use client";

import { usePaginationStore } from "@/store/use-pagination-store";
import { useCoupons, useDeleteCoupon } from "../hooks/useCoupons";
import { useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ClipboardCopy, Copy, Loader2, Pencil, Trash2 } from "lucide-react";
import { Message } from "@/components/layout/message-box";
import Pagination from "@/components/ui/pagination";
import DropdowMenu2 from "@/components/layout/dropdow-menu2";
import { Button } from "@/components/ui/button";
import { coupon } from "@prisma/client";
import { use2IdStore, useDialogActionStore, useFormDataStore, useFormTypeStore } from "@/store";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const TableHeading = [
  "ID",
  "Code",
  "Discount",
  "Min Order",
  "Usage Limit",
  "Used",
  "Per User",
  "Start Date",
  "Expiry Date",
  "Status",
  "Action",
];

export default function CouponsList() {
  const page = usePaginationStore((s) => s.page);
  const search = usePaginationStore((s) => s.search);

  const { data, isPending, isError, refetch } = useCoupons({
    page,
    limit: 20,
    search,
  });

  const paginationData = useMemo(
    () => ({
      pages: data?.totalPages ?? 0,
      total: data?.total ?? 0,
      currentPage: page,
    }),
    [data, page],
  );



  return (
    <div className="w-full h-full flex flex-col justify-between">
      <div className="w-full overflow-y-auto rounded-md">
        <Table>
          <TableHeader className="bg-emerald-800 font-[NeueMachina] font-bold hover:bg-emerald-900!">
            <TableRow>
              {TableHeading.map((heading, index) => (
                <TableHead
                  key={index}
                  className={`${index === 0 && "pl-4"} text-white tracking-wide`}
                >
                  {heading}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {isPending && (
              <TableRow>
                <TableCell
                  colSpan={TableHeading.length}
                  className="text-center py-10"
                >
                  <Loader2 className="w-6 h-6 mx-auto animate-spin text-emerald-500" />
                </TableCell>
              </TableRow>
            )}

            {isError && (
              <TableRow>
                <TableCell colSpan={TableHeading.length}>
                  <Message message="Data Fetch Error" onReload={refetch} />
                </TableCell>
              </TableRow>
            )}

            {!isPending && data?.success && data.data.length === 0 && (
              <TableRow>
                <TableCell colSpan={TableHeading.length}>
                  <Message
                    message="Coupons Not Found"
                    rediract="/owner/coupons/action"
                    rediractText="Create Coupon"
                  />
                </TableCell>
              </TableRow>
            )}

            {/* DATA */}
            {data?.success &&
              data.data.map((coupon) => (
                <TableRow
                  key={coupon.id}
                  className="odd:bg-emerald-600/50 text-emerald-100 tracking-wide font-[Helvetica] font-semibold hover:even:bg-emerald-600 hover:odd:bg-emerald-600"
                >
                  <TableCell className="pl-4">{coupon.id}</TableCell>
                  <TableCell>{coupon.code}</TableCell>
                  <TableCell>{coupon.discountValue}</TableCell>
                  <TableCell>{coupon.minOrderAmount}</TableCell>
                  <TableCell>{coupon.usageLimit}</TableCell>
                  <TableCell>{coupon.usedCount}</TableCell>
                  <TableCell>{coupon.perUserLimit}</TableCell>
                  <TableCell>
                    {new Date(coupon.startsAt).toLocaleDateString("en-IN")}
                  </TableCell>
                  <TableCell>
                    {new Date(coupon.expiresAt).toLocaleDateString("en-IN")}
                  </TableCell>
                  <TableCell>
                    {coupon.isActive ? "Active" : "Inactive"}
                  </TableCell>
                  <TableCell>
                    <MenuAction couponId={coupon.id} couponCode={coupon.code} couponData={coupon} />
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      {paginationData.pages > 1 && (
        <div className="px-4 py-2">
          <Pagination {...paginationData} />
        </div>
      )}
    </div>
  );
}


interface MenuActionProps {
  couponId: string
  couponCode: string
  couponData: coupon
}

const MenuAction = ({ couponId, couponCode, couponData}: MenuActionProps) => {

  const setType = useFormTypeStore((state) => state.setType)
  const setOpen = useDialogActionStore((state) => state.setOpen)
  const setId = use2IdStore((state) => state.setId)
  const setFormData = useFormDataStore((state) => state.setData)

  const router = useRouter()

  const deleteMutate = useDeleteCoupon()

  const handleCopy = (copyText: string) => {
    navigator.clipboard.writeText(copyText)
    toast.success("Copied to clipboard");
  }
const handleEdite = (data: coupon) => {
  setType("edit");
  setId(data.id);
  setFormData(data);
  router.push("/owner/coupons/action");
};

const handleDelete = (id: string) => {
  if (deleteMutate.isPending) return;
  deleteMutate.mutate(id);
};

  return (
    <DropdowMenu2>
      <Button
        type="button"
        className="w-full flex items-center gap-2 justify-between
        bg-emerald-500/20 text-emerald-100
        hover:bg-emerald-800/30 active:bg-emerald-900/80
        rounded-md px-3 py-1 cursor-pointer h-auto"
        onClick={() => handleCopy(couponId)}>
        <div className="flex items-center gap-2">
          <Copy className="w-4 h-4" />
          Copy ID
        </div>
      </Button>

      <Button
        type="button"
        className="w-full flex items-center gap-2 justify-between
        bg-emerald-500/20 text-emerald-100
        hover:bg-emerald-800/30 active:bg-emerald-900/80
        rounded-md px-3 py-1 cursor-pointer h-auto"
        onClick={() => handleCopy(couponCode)}>
        <div className="flex items-center gap-2">
          <ClipboardCopy className="w-4 h-4" />
          Copy Code
        </div>
      </Button>

      <Button
        type="button"
        className="w-full flex items-center gap-2 justify-between
        bg-emerald-400/40 text-emerald-100
        hover:bg-emerald-700/80 active:bg-emerald-800/50
        rounded-md px-3 py-1 cursor-pointer h-auto"
        onClick={() => handleEdite(couponData)}>
        <div className="flex items-center gap-2">
          <Pencil className="w-4 h-4" />
          Edit Coupon
        </div>
      </Button>

      <Button
        type="button"
        className="w-full flex items-center gap-2 justify-between
        bg-red-400/40 text-emerald-100
        hover:bg-red-600/30 active:bg-red-700/80
        rounded-md px-3 py-1 cursor-pointer h-auto"
        onClick={() => handleDelete(couponId)}>
        <div className="flex items-center gap-2">
          <Trash2 className="w-4 h-4" />
          Delete Coupon
        </div>
      </Button>
    </DropdowMenu2>
  );
};

