const { prismaExec } = require("../prismaExec");

async function getUserTz(prisma, userId) {
  const userTransaction = await prismaExec(() => prisma.user.findUnique({ where: { id: userId } }));
  if (userTransaction.status === "Error" || !userTransaction.status) return null;
  return userTransaction.transactionResponse.timezone;
}
module.exports = { getUserTz };