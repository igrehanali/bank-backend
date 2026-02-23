import Transaction from "../models/transaction.model.js";
import ledgerModel from "../models/ledger.model.js";
import Account from "../models/account.model.js";
import emailService from "../services/email.service.js";
import mongoose from "mongoose";

async function createTransaction(req, res) {
  const { amount, fromAccount, toAccount, idempotencyKey } = req.body;

  //   Validate input

  if (!amount || !fromAccount || !toAccount || !idempotencyKey) {
    return res.status(400).json({
      error: "Amount, fromAccount, toAccount, and idempotencyKey are required",
    });
  }

  const fromAcc = await Account.findOne({
    _id: fromAccount,
  });
  const toAcc = await Account.findOne({
    _id: toAccount,
  });
  if (!fromAcc || !toAcc) {
    return res.status(404).json({ error: "One or both accounts not found" });
  }

  //    validate idempotencyKey

  const existingTransaction = await Transaction.findOne({
    idempotencyKey: idempotencyKey,
  });

  if (existingTransaction) {
    if (existingTransaction.status === "success") {
      res.status(200).json({
        message: "Transaction already processed",
      });
    }
    if (existingTransaction.status === "pending") {
      res.status(202).json({
        message: "Transaction is still pending",
      });
    }
    if (existingTransaction.status === "failed") {
      res.status(409).json({
        error:
          "Previous transaction with this idempotencyKey failed. Please try again.",
      });
    }
    if (existingTransaction.status === "reversed") {
      res.status(409).json({
        error:
          "Previous transaction with this idempotencyKey was reversed. Please try again.",
      });
    }
  }

  //    check both user's Account status are they active or not

  if (fromAcc.status !== "ACTIVE" || toAcc.status !== "ACTIVE") {
    return res
      .status(403)
      .json({ error: "Both accounts must be ACTIVE to perform a transaction" });
  }

  //   calculate balance of fromAccount and check if it has sufficient funds
  const balance = await fromAcc.getBalance();

  if (balance < amount) {
    return res.status(400).json({
      error: `Insufficient funds in fromAccount ${fromAccount}. Current balance is ${balance}. Requested amount is ${amount}.`,
    });
  }

  //    create transaction with pending status

  const transactionSession = await mongoose.startSession();
  transactionSession.startTransaction();

  const transactionDoc = await Transaction.create(
    {
      fromAccount,
      toAccount,
      status: "PENDING",
      idempotencyKey,
      amount,
    },
    { session: transactionSession },
  );

  const debitLedgerEntry = await ledgerModel.create(
    {
      account: fromAccount,
      type: "DEBIT",
      amount,
      transaction: transactionDoc._id,
    },
    { session: transactionSession },
  );

  const creditLedgerEntry = await ledgerModel.create(
    {
      account: toAccount,
      type: "CREDIT",
      amount,
      transaction: transactionDoc._id,
    },
    { session: transactionSession },
  );

  await transactionSession.commitTransaction();
  transactionSession.endSession();

  //   send transaction notification email to both users

  emailService.sendEmail(
    fromAcc.user.email,
    req.user.name,

    "Transaction Alert: Funds Debited",
    `An amount of ${amount} has been debited from your account ${fromAccount}. Transaction ID: ${transactionDoc._id}`,
  );
  emailService.sendEmail(
    toAcc.user.email,
    "Transaction Alert: Funds Credited",
    `An amount of ${amount} has been credited to your account ${toAccount}. Transaction ID: ${transactionDoc._id}`,
  );
}

export default createTransaction;
