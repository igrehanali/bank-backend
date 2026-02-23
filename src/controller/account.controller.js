import AccountModel from "../models/account.model.js";

async function createAccountController(req, res) {
  const user = req.user;

  const account = await AccountModel.create({
    user: user._id,
  });
  res.status(201).json({
    success: true,
    message: "Account created successfully",
    data: account,
  });
}

export { createAccountController };
