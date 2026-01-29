import StudentList from "@/module/students/components/student-list"
import TopControler from "@/module/students/components/top-controler"

export default function Students() {
  return (
    <div className='w-full h-screen overflow-hidden p-4'>
      <TopControler />


      <div className='w-full h-[calc(100vh-10rem)] mt-4
       bg-linear-to-tr from-[#004934d7] to-[#001b12e1] backdrop-blur-md border border-[#000000] shadow-inner shadow-[#00835e]/50 rounded-4xl'>
        <StudentList />
      </div>
    </div>
  )
}
