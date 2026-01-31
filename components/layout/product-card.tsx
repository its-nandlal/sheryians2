

import Badge from '@/components/ui/badge'

interface ProductCardProps {
  url?: string;
  tags?: string[];
}

export default function ProductCard({url = "https://www.youtube.com/embed/60SRAWmMXyc?si=-kQVd6Bl2jI_XCuI" , tags}: ProductCardProps) {
  return (
    <div
      className="relative w-full h-100 md:h-170 flex items-center justify-center flex-col bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl
       inset-shadow-sm inset-shadow-zinc-100/10">

      <div className=" absolute top-3 left-3 flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-red-600/80"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-400/80"></div>
        <div className="w-3 h-3 rounded-full bg-green-600/80"></div>
      </div>

      <div className="w-[95%] h-full flex items-center justify-center flex-col gap-5">
        <div className="w-full h-[70%] md:h-[75%] rounded-2xl overflow-hidden border-2 border-zinc-500/5 shadow-sm shadow-zinc-500/10">
            <iframe
              width="560"
              height="315"
              className="w-full h-full"
              src={url}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            ></iframe>
        </div>

        <div className="w-full flex items-center max-md:justify-around gap-2">
          {tags ? (
            <>
              {tags.map((tag) => (
                <Badge key={tag} className='text-[9.5px] text-nowrap'>{tag}</Badge>
              ))}
            </>
          ) : (
           <>
            <Badge className='text-[9.5px] text-nowrap'>Takes to help</Badge>
            <Badge className='text-[9.5px] text-nowrap'>Concepts</Badge>
            <Badge className='text-[9.5px] text-nowrap'>Understand</Badge>
           </>
          )}
          
        </div>
      </div>
    </div>
  );
}
