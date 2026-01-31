import { getCurrentUser } from '@/module/auth/actions'
import Image from 'next/image'

export default async function UserInfo() {
    const userInfo = await getCurrentUser()

    // ✅ Error handling
    if (!userInfo.success) {
        return (
            <div className='text-red-500'>
                {userInfo.error}
            </div>
        )
    }

    // ✅ Null safety
    if (!userInfo.data) {
        return <div>No user data</div>
    }

    return (
        <div className='flex items-center gap-3'>
            {/* User Image */}
            {userInfo.data.image && (
                <Image 
                    src={userInfo.data.image} 
                    alt={userInfo.data.name} 
                    className='w-10 h-10 rounded-full'
                />
            )}
            
            {/* User Info */}
            <div>
                <p className='font-semibold'>{userInfo.data.name}</p>
                <p className='text-sm text-gray-500 capitalize'>
                    {userInfo.data.role?.toLowerCase()}
                </p>
            </div>
        </div>
    )
}
