import BackButton from "@/components/layout/back-button"
import { Input } from "@/components/ui/input"
import { getCurrentUser } from "@/module/auth/actions"
import Image from "next/image"
import {
  User,
  Mail,
  Shield,
  Calendar,
} from "lucide-react"

export default async function Profile() {
  const user = await getCurrentUser()

  if (!user.success) {
    return (
      <div className="w-full h-screen flex items-center justify-center text-red-500">
        No Data
      </div>
    )
  }

  const u = user.data

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center p-4">
      <div
        className="
          w-full max-w-lg
          rounded-2xl
          bg-linear-to-b from-emerald-900/80 to-emerald-950/80
          border border-emerald-700/40
          shadow-2xl
          p-6 space-y-8
        "
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">
              Profile
            </h2>
            <p className="text-xs text-emerald-300/70">
              Personal account details
            </p>
          </div>
          <BackButton />
        </div>

        {/* Avatar */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-24 h-24 rounded-full overflow-hidden border border-emerald-500/40 shadow-md">
              <Image
                src={u?.image || "/avatar.png"}
                alt={u?.name || "User"}
                width={200}
                height={200}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="absolute -bottom-1 -right-1 px-2 py-0.5 text-[10px] rounded-full bg-emerald-600 text-white">
              Active
            </span>
          </div>

          <div>
            <h3 className="text-lg font-medium text-white">
              {u?.name}
            </h3>
            <p className="text-sm text-emerald-300/70">
              {u?.email}
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-emerald-700/40" />

        {/* Info Fields */}
        <div className="space-y-4">
          <Field
            label="Full Name"
            icon={<User className="w-4 h-4" />}
            value={u?.name}
          />

          <Field
            label="Email Address"
            icon={<Mail className="w-4 h-4" />}
            value={u?.email}
          />

          <Field
            label="Role"
            icon={<Shield className="w-4 h-4" />}
            value={u?.role}
          />

          <Field
            label="Joined On"
            icon={<Calendar className="w-4 h-4" />}
            value={u?.createdAt.toISOString().split("T")[0]}
          />
        </div>
      </div>
    </div>
  )
}

/* ---------------------------------- */
/* Reusable Field Component */
/* ---------------------------------- */

function Field({
  label,
  value,
  icon,
}: {
  label: string
  value?: string
  icon: React.ReactNode
}) {
  return (
    <div className="space-y-2">
      <label className="text-xs text-emerald-300/70 flex items-center gap-2">
        {icon}
        {label}
      </label>
      <Input
        readOnly
        value={value ?? ""}
        className="
          bg-emerald-950/60
          border-emerald-700/40
          text-white
          focus-visible:ring-0
        "
      />
    </div>
  )
}
