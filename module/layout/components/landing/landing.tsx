import RightInfo from "./right-info";


export default function Landing() {
  return (
    <div className="w-full h-screen relative flex justify-between">

      {/* left side */}
      <div className="flex flex-col justify-end h-full">

        {/* reviews */}
        <div className="w-2/3 h-2/5 bg-[#28dcb2e3]/10 border-r border-zinc-600/10 rounded-r-2xl">

        </div>


        {/* bottom heading */}
        <div className="p-5">
          <h1 className="font-[NeueMachina] text-white text-8xl">
          <span className="font-[HelveticaL] font-thin! italic">good </span>
           at.
          <br />
          really really
          <br />
          what we are
          <br /> 
          We only <span className="text-[#28dcb2e3]">teach</span>
          </h1>
        </div>
      </div>


      {/* right side */}
      <RightInfo />


    </div>
  )
}
