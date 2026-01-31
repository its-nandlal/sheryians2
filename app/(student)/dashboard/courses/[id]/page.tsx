
import Course from '@/module/(students)/courses/view/components/course'
import { use } from 'react'

export default function ViewCourse({params}: {params: Promise<{id: string}>}) {

  const {id} = use(params)


  return (
    <div className='w-full h-screen'>
      <Course id={id} />
    </div>
  )
}
