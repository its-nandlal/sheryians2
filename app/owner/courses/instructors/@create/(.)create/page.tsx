import { Button } from '@/components/ui/button'
import InstructorFormDialog from '@/module/instructor/components/InstructorFormDialog'

export default function InstructorCreatePopup() {

  return (
    <div className=' fixed top-0 left-0 z-10 w-full h-screen flex justify-center items-center pointer-events-none'>
      <InstructorFormDialog mode="create" rediracting={true} openDefault={true}>
        <Button className='bg-transparent border-0'>
            
        </Button>
      </InstructorFormDialog>
    </div>
  )
}
