import { checkAuthOwner } from "@/module/auth/actions";
import { NextRequest, NextResponse } from "next/server";




export async function GET (request: NextRequest) {
    try {
        
    } catch (error) {
        
    }
}



export async function POST (request: NextRequest) {
  try {
    
    const checkOwner = await checkAuthOwner();
    if(!checkOwner.success) return NextResponse.json({
      success: checkOwner.success,
      error: checkOwner.error
    }, {status: +checkOwner.status})

    


  } catch (error) {
    
  }
}