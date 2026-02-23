import mongoose from "mongoose";

const ledgerSchema = new mongoose.Schema({
  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account",
    required: [true, "Ledger entry must be associated with an account"],
    index: true,
    immutable: true,
  },
  amount: {
    type: Number,
    required: [true, "Amount is required"],
    immutable: true,
  },
  transaction: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Transaction",
    required: [true, "Ledger entry must be associated with a transaction"],
    index: true,
    immutable: true,
  },
  type: {
    type: String,
    enum: {
      values: ["DEBIT", "CREDIT"],
      message: "Type must be either DEBIT or CREDIT",
    },
    required: [true, "Type is required"],
    immutable: true,
  },
});

function preventLedgerModification() {
  throw new Error("Ledger entries cannot be modified after creation");
}

ledgerSchema.pre("findOneAndUpdate", preventLedgerModification);
ledgerSchema.pre("updateOne", preventLedgerModification);
ledgerSchema.pre("updateMany", preventLedgerModification);
ledgerSchema.pre("update", preventLedgerModification);
ledgerSchema.pre("deleteOne", preventLedgerModification);
ledgerSchema.pre("deleteMany", preventLedgerModification);
ledgerSchema.pre("remove", preventLedgerModification);

export default mongoose.model("Ledger", ledgerSchema);
