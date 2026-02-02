import ProductCard from '@/components/layout/product-card'


export default function RightInfo() {
  return (
      <div className="w-full md:w-1/2 h-10/12 xl:h-full flex flex-col gap-2 justify-end md:pr-10 md:pb-20 max-md:pt-32 max-xl:pt-32 max-md:p-2">
        <div className="flex flex-col font-[NeueMachina] text-xl">
          <span>
            we do whatever it takes to help you
          </span>
          <span className="text-[#28dcb2e3]">
            understand the concepts.
          </span>
        </div>

        <ProductCard />

        <div className="w-full flex items-center justify-around pt-5">

        <div className="text-sm md:text-xl text-center">
            <h2 className="text-xl md:text-2xl font-[Helvetica] font-bold">250k+</h2>
            <p className="font-[NeueMachina]">Students taugth</p>
        </div>

        <div className="text-sm md:text-xl text-center">
            <h2 className="text-xl md:text-2xl font-[Helvetica] font-bold">20+</h2>
            <p className="font-[NeueMachina]">Instructors</p>
        </div>

        <div className="text-sm md:text-xl text-center">
            <h2 className="text-xl md:text-2xl font-[Helvetica] font-bold">616K+</h2>
            <p className="font-[NeueMachina]">Youtube Subs.</p>
        </div>
       
        </div>

      </div>
  )
}
