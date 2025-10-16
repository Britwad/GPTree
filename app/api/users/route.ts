// We use this route to create users
// (Maybe also use it to get a list of users later)

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Create a new user
export async function POST(req: NextRequest) {
}