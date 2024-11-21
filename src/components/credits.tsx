"use server";

import { db } from "~/server/db";
import { getServerSession } from "next-auth";
import { authOptions } from "~/server/auth/config";

const Credits = async () => {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return <p>User not authenticated or session invalid</p>;
  }

  const user = await db.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      credits: true,
    },
  });

  if (!user) {
    return <p>User not found in the database</p>;
  }

  return <p>{user.credits} credits left</p>;
};

export default Credits;
