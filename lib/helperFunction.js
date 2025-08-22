import { NextResponse } from "next/server"

export const helperResponse = (success,statusCode,message,data={}) =>{
    return NextResponse.json({
        success,statusCode,message,data
    })
}