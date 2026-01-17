
import DialogAction from "@/components/ui/dialog-action"
import CreateModuleForm from "@/module/course/module/components/( action page )/create-module-form"


export default function ModuleAction() {
  return (
    <div className='absolute top-0 left-0 w-full h-screen flex items-center justify-center bg-black/20 backdrop-blur-[1px]'>
      {/* <div className=""> */}

          <DialogAction redirecting={true} defaultOpen={true} redirectingPath="/owner/courses">
          <CreateModuleForm />
          </DialogAction>


        {/* </div> */}
    </div>
  )
}
